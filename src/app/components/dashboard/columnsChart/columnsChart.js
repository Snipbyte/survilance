"use client"
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColumnsChart = ({ isDashboard = true, stats, loading, filters }) => {
  const [activeFilter, setActiveFilter] = useState("Zone");
  const [internalStats, setInternalStats] = useState({ alertTypes: [], zoneViolationsByType: [] });
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (!isDashboard) {
      const fetchData = async () => {
        setInternalLoading(true);
        try {
          const { dateFrom, dateTo, selectedZones, selectedCameras, selectedPPEs, groupBy } = filters || {};
          const macAddresses = selectedCameras?.length > 0
            ? selectedCameras.map(c => c.deviceMAC).join(",")
            : "";
          const alertsData = await getAlerts("PPE", 1, 100, macAddresses, dateFrom, dateTo);
          const zonesData = await getZones(1, 100);
          const camerasData = await getCameras(1, 100);

          const filteredZones = selectedZones?.length > 0
            ? zonesData.zonesData.filter(z => selectedZones.some(sz => sz._id === z._id))
            : zonesData.zonesData;

          const processedStats = processAlertData(
            alertsData.AlarmHistoryData || [],
            filteredZones || [],
            camerasData.devicesData || [],
            selectedPPEs || [],
            groupBy || "Zone"
          );

          setInternalStats(processedStats);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setInternalLoading(false);
        }
      };
      fetchData();
    }
  }, [isDashboard, filters]);

  const processAlertData = (alerts, zones, cameras, selectedPPEs, groupBy) => {
    const alertTypes = selectedPPEs.length > 0
      ? selectedPPEs.filter(type => Object.values(ALERT_TYPE_MAP).includes(type))
      : Object.values(ALERT_TYPE_MAP);
    const violations = {};

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts } = alert;
      const zone = zones.find(z => z.installedDevices.includes(macAddress)) || { zoneName: "Unknown", _id: "unknown" };
      const camera = cameras.find(c => c.deviceMAC === macAddress) || { deviceName: "Unknown", deviceMAC: macAddress };

      const key = groupBy === "Zone" ? zone._id : macAddress;
      const name = groupBy === "Zone" ? zone.zoneName : camera.deviceName;

      if (!violations[key]) {
        violations[key] = {
          name,
          macAddress,
          violations: Array(alertTypes.length).fill(0),
        };
      }

      Object.values(alertTypeCounts).forEach(types => {
        alertTypes.forEach((type, index) => {
          const typeId = Object.entries(ALERT_TYPE_MAP).find(([id, name]) => name === type)?.[0];
          if (types[typeId]) {
            violations[key].violations[index]++;
          }
        });
      });
    });

    return {
      alertTypes,
      zoneViolationsByType: Object.values(violations),
    };
  };

  const series = isDashboard && stats?.alertTypes
    ? stats.alertTypes.map(type => ({
        name: `${type.replace("-", " ").toUpperCase()} Compliance `,
        data: (stats.zoneViolationsByType || []).map(zone => zone.violations[stats.alertTypes.indexOf(type)] || 0),
      }))
    : internalStats.alertTypes.map((type, index) => ({
        name: `${type.replace("-", " ").toUpperCase()} Compliance`,
        data: internalStats.zoneViolationsByType.map(zone => zone.violations[index] || 0),
      }));

  const categories = isDashboard
    ? (stats?.zoneViolationsByType || []).map(zone => zone.macAddress)
    : internalStats.zoneViolationsByType.map(zone => zone.name);

  const baseOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    tooltip: {
      y: { formatter: (val) => `${val} Compliance ` },
    },
    legend: {
      position: "bottom",
      markers: { shape: "circle", radius: 12 },
    },
  };

  const dashboardOptions = {
    ...baseOptions,
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
        borderRadiusApplication: "end",
      },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Non-compliance Count", style: { fontSize: "10px", color: "#9CA3AF" } },
      min: 0,
      max: Math.max(20, ...series.flatMap(s => s.data)),
    },
    fill: { opacity: 1 },
    colors: [
      "#1E90FF", "#FF4500", "#FFA500", "#32CD32", "#8B008B", 
      "#00CED1", "#FF69B4", "#228B22", "#FFD700", "#DC143C", 
      "#00FF7F", "#9932CC", "#20B2AA", "#FF6347", "#4682B4", 
      "#9ACD32", "#BA55D3"
    ], // Expanded color array to handle all alert types
  };

  return (
    <div className="p-4 bg-white rounded-lg border my-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-headingColor text-2xl font-bold">
          Compliance by {filters?.groupBy || "Zone"}
        </h3>
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 text-sm rounded ${
              activeFilter === "Zone" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-paraColor"
            }`}
            onClick={() => setActiveFilter("Zone")}
          >
            Zone
          </button>
        </div>
      </div>
      {(isDashboard ? loading : internalLoading) ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : !series.length ? (
        <div className="text-center text-gray-600">No data available</div>
      ) : (
        <div className="w-full">
          <Chart
            options={dashboardOptions}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      )}
    </div>
  );
};

export default ColumnsChart;