import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { AlertHistory } from "../../../../models/AlertHistory";
import { ALERT_TYPE_MAP } from "../../../../lib/alertTypes";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const modelType = searchParams.get("modelType") || "PPE";

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const last7Days = new Date(todayStart);
    last7Days.setDate(todayStart.getDate() - 6);

    // Fetch records for last 7 days, filtered by modelType
    const records = await AlertHistory.find({
      modelType,
      recordedAt: { $gte: last7Days },
    }).lean();

    if (!records.length) {
      return NextResponse.json({ message: "No data available" });
    }

    // Initialize stats
    let totalDetectionsToday = 0;
    let totalDetectionsYesterday = 0;
    let totalViolations = 0;
    let deviceViolationMap = {};
    let modelTypeViolations = {};
    let trendMap = {};
    let violationCountPerDetection = [];
    let hourlyViolationsByType = {};
    let zoneViolationsByType = {};

    const allAlertKeys = Object.keys(ALERT_TYPE_MAP);

    // Analyze records
    for (const rec of records) {
      const recordedAt = new Date(rec.recordedAt);
      const dateKey = recordedAt.toISOString().split("T")[0];
      const hourKey = recordedAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: false,
      });

      // Count detections by date
      if (!trendMap[dateKey]) trendMap[dateKey] = 0;
      trendMap[dateKey]++;

      // Count for today/yesterday
      if (recordedAt >= todayStart) totalDetectionsToday++;
      if (recordedAt >= yesterdayStart && recordedAt < todayStart)
        totalDetectionsYesterday++;

      let violationsForThisRecord = 0;

      // Initialize zone violations for this macAddress
      if (!zoneViolationsByType[rec.macAddress]) {
        zoneViolationsByType[rec.macAddress] = {};
        allAlertKeys.forEach(key => {
          zoneViolationsByType[rec.macAddress][ALERT_TYPE_MAP[key]] = 0;
        });
      }

      // Initialize hourly violations for this hour
      if (!hourlyViolationsByType[hourKey]) {
        hourlyViolationsByType[hourKey] = {};
        allAlertKeys.forEach(key => {
          hourlyViolationsByType[hourKey][ALERT_TYPE_MAP[key]] = 0;
        });
      }

      // CORRECTED: Process alertTypeCounts - Each alert type present = VIOLATION
      Object.entries(rec.alertTypeCounts || {}).forEach(([zoneId, alertMap]) => {
        // Each alert type in the map represents a VIOLATION
        const violationAlerts = Object.keys(alertMap || {});
        
        violationsForThisRecord += violationAlerts.length;
        totalViolations += violationAlerts.length;

        // Device violations
        deviceViolationMap[rec.macAddress] =
          (deviceViolationMap[rec.macAddress] || 0) + violationAlerts.length;

        // Model type violations
        modelTypeViolations[rec.modelType] =
          (modelTypeViolations[rec.modelType] || 0) + violationAlerts.length;

        // Zone violations by type
        violationAlerts.forEach(key => {
          const name = ALERT_TYPE_MAP[key];
          if (name) {
            zoneViolationsByType[rec.macAddress][name]++;
            hourlyViolationsByType[hourKey][name]++;
            violationCountPerDetection.push(name);
          }
        });
      });
    }

    // Calculate Derived Stats
    let detectionChangePercent = 0;
    let detectionTrend = "stable";
    if (totalDetectionsYesterday > 0) {
      detectionChangePercent =
        ((totalDetectionsToday - totalDetectionsYesterday) /
          totalDetectionsYesterday) * 100;
    }
    if (detectionChangePercent > 5) detectionTrend = "upward";
    else if (detectionChangePercent < -5) detectionTrend = "downward";

    // Most Violated PPEs (actually most common violations)
    const ppeCounts = {};
    violationCountPerDetection.forEach(v => {
      ppeCounts[v] = (ppeCounts[v] || 0) + 1;
    });
    const mostViolatedPPE = Object.entries(ppeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([ppe]) => ppe);

    // Top 3 devices (zones) with most violations
    const topViolatingDevices = Object.entries(deviceViolationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([macAddress, violations]) => ({ macAddress, violations }));

    // Avg violations per detection
    const avgViolationsPerDetection = records.length
      ? (totalViolations / records.length).toFixed(2)
      : 0;

    // 7-day trend (detections per day)
    const trend = Object.entries(trendMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, detections]) => ({ date, detections }));

    // Active devices (last 24h)
    const activeDevices = new Set(
      records
        .filter(r => new Date(r.recordedAt) >= todayStart)
        .map(r => r.macAddress)
    ).size;

    // Avg time between alerts per device
    const deviceTimes = {};
    records.forEach(r => {
      if (!deviceTimes[r.macAddress]) deviceTimes[r.macAddress] = [];
      deviceTimes[r.macAddress].push(new Date(r.recordedAt).getTime());
    });
    let avgTimeBetweenAlerts = "N/A";
    const allIntervals = [];
    Object.values(deviceTimes).forEach(times => {
      if (times.length > 1) {
        times.sort((a, b) => a - b);
        for (let i = 1; i < times.length; i++) {
          allIntervals.push(times[i] - times[i - 1]);
        }
      }
    });
    if (allIntervals.length > 0) {
      const avgMs = allIntervals.reduce((a, b) => a + b, 0) / allIntervals.length;
      const mins = Math.floor(avgMs / (1000 * 60));
      const hrs = Math.floor(mins / 60);
      avgTimeBetweenAlerts = `${hrs}h ${mins % 60}m`;
    }

    // Compliance rate (lower violations = better compliance)
    const totalPossibleViolations = records.length * allAlertKeys.length;
    const complianceRate = totalPossibleViolations
      ? (100 - (totalViolations / totalPossibleViolations * 100)).toFixed(1)
      : 100;

    // Format hourly violations for charts
    const hourlySeries = Object.entries(hourlyViolationsByType)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, types]) => ({
        name: hour,
        data: Object.values(ALERT_TYPE_MAP).map(type => types[type] || 0),
      }));

    // Format zone violations for charts
    const zoneSeries = Object.entries(zoneViolationsByType).map(([macAddress, types]) => ({
      macAddress,
      violations: Object.values(ALERT_TYPE_MAP).map(type => types[type] || 0),
    }));

    return NextResponse.json({
      totalDetectionsToday,
      totalDetectionsYesterday,
      totalViolations,
      detectionChangePercentFromYesterday: Number(detectionChangePercent.toFixed(2)),
      detectionTrend,
      mostViolatedPPE,
      topViolatingDevices,
      avgViolationsPerDetection: Number(avgViolationsPerDetection),
      violationsTrend: trend,
      modelTypeBreakdown: modelTypeViolations,
      activeDevicesCount: activeDevices,
      avgTimeBetweenAlerts,
      complianceRate: Number(complianceRate),
      hourlyViolationsByType: hourlySeries,
      zoneViolationsByType: zoneSeries,
      alertTypes: Object.values(ALERT_TYPE_MAP),
      // Debug info
      _debug: {
        totalRecords: records.length,
        sampleRecord: records[0] ? {
          macAddress: records[0].macAddress,
          alertTypeCounts: records[0].alertTypeCounts,
          recordedAt: records[0].recordedAt
        } : null
      }
    });
  } catch (error) {
    console.error("Error generating alert stats:", error);
    return NextResponse.json(
      { error: "Failed to generate alert statistics" },
      { status: 500 }
    );
  }
}