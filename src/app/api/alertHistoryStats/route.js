import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { AlertHistory } from "../../../../models/AlertHistory";
import { ALERT_TYPE_MAP } from "../../../../lib/alertTypes";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    // Fetch records for last 7 days
    const last7Days = new Date(todayStart);
    last7Days.setDate(todayStart.getDate() - 6);

    const records = await AlertHistory.find({
      recordedAt: { $gte: last7Days },
    });

    if (!records.length) {
      return NextResponse.json({ message: "No data available" });
    }

    // --- Initialize stats ---
    let totalDetectionsToday = 0;
    let totalDetectionsYesterday = 0;
    let totalViolations = 0;
    let deviceViolationMap = {};
    let modelTypeViolations = {};
    let trendMap = {};
    let violationCountPerDetection = [];

    const allAlertKeys = Object.keys(ALERT_TYPE_MAP);

    // --- Analyze records ---
    for (const rec of records) {
      const dateKey = rec.recordedAt.toISOString().split("T")[0];

      // Count detections by date
      if (!trendMap[dateKey]) trendMap[dateKey] = 0;

      // Count for today/yesterday
      if (rec.recordedAt >= todayStart) totalDetectionsToday++;
      if (rec.recordedAt >= yesterdayStart && rec.recordedAt < todayStart)
        totalDetectionsYesterday++;

      let violationsForThisRecord = 0;

      // Go through alertTypeCounts (like { "1": { ... }, "2": { ... } })
      Object.values(rec.alertTypeCounts || {}).forEach((alertMap) => {
        const presentAlerts = Object.keys(alertMap || {});
        const missing = allAlertKeys.filter((key) => !presentAlerts.includes(key));

        violationsForThisRecord += missing.length;
        totalViolations += missing.length;

        // Add to device violations
        deviceViolationMap[rec.macAddress] =
          (deviceViolationMap[rec.macAddress] || 0) + missing.length;

        // Add to model type violations
        if (rec.modelType) {
          modelTypeViolations[rec.modelType] =
            (modelTypeViolations[rec.modelType] || 0) + missing.length;
        }

        // Track missing PPEs
        missing.forEach((key) => {
          const name = ALERT_TYPE_MAP[key];
          violationCountPerDetection.push(name);
        });
      });

      trendMap[dateKey] += violationsForThisRecord;
    }

    // --- Calculate Derived Stats ---

    // Detection % change and trend interpretation
    let detectionChangePercent = 0;
    let detectionTrend = "stable";

    if (totalDetectionsYesterday >= 10) {
    detectionChangePercent =
        ((totalDetectionsToday - totalDetectionsYesterday) /
        totalDetectionsYesterday) *
        100;

    // Clamp to realistic range to avoid wild spikes
    // detectionChangePercent = Math.max(-100, Math.min(100, detectionChangePercent));
    }

    // Define human-readable trend
    if (detectionChangePercent > 5) detectionTrend = "upward";
    else if (detectionChangePercent < -5) detectionTrend = "downward";
    else detectionTrend = "stable";


    // Most Violated PPEs
    const ppeCounts = {};
    violationCountPerDetection.forEach((v) => {
      ppeCounts[v] = (ppeCounts[v] || 0) + 1;
    });
    const mostViolatedPPE = Object.entries(ppeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3) // Top 3
      .map(([ppe]) => ppe);

    // Top 3 devices with highest violations
    const topViolatingDevices = Object.entries(deviceViolationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([macAddress, violations]) => ({ macAddress, violations }));

    // Avg violations per detection
    const avgViolationsPerDetection = records.length
      ? (totalViolations / records.length).toFixed(2)
      : 0;

    // 7-day trend
    const trend = Object.entries(trendMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, violations]) => ({ date, violations }));

    // Active devices (last 24h)
    const activeDevices = new Set(
      records
        .filter((r) => r.recordedAt >= todayStart)
        .map((r) => r.macAddress)
    ).size;

    // Avg time between alerts per device
    const deviceTimes = {};
    records.forEach((r) => {
      if (!deviceTimes[r.macAddress]) deviceTimes[r.macAddress] = [];
      deviceTimes[r.macAddress].push(new Date(r.recordedAt).getTime());
    });

    let avgTimeBetweenAlerts = "N/A";
    const allIntervals = [];

    Object.values(deviceTimes).forEach((times) => {
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

    // --- Final JSON Response ---
    return NextResponse.json({
      totalDetectionsToday,
      detectionChangePercentFromYesterday: Number(detectionChangePercent.toFixed(2)),
      detectionTrend,
      mostViolatedPPE,
      topViolatingDevices,
      avgViolationsPerDetection: Number(avgViolationsPerDetection),
      violationsTrend: trend,
      modelTypeBreakdown: modelTypeViolations,
      activeDevicesCount: activeDevices,
      avgTimeBetweenAlerts,
    });
  } catch (error) {
    console.error("Error generating alert stats:", error);
    return NextResponse.json(
      { error: "Failed to generate alert statistics" },
      { status: 500 }
    );
  }
}
