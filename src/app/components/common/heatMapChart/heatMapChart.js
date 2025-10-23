"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const HeatMapChart = ({ isDashboard = true, stats, loading, filters }) => {
  const [internalStats, setInternalStats] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (!isDashboard) {
      const fetchData = async () => {
        setInternalLoading(true);
        try {
          const { dateFrom, dateTo, selectedZones, selectedCameras, selectedPPEs } = filters || {};
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
            selectedPPEs || []
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

  const processAlertData = (alerts, zones, cameras, selectedPPEs) => {
    const alertTypes = selectedPPEs.length > 0
      ? selectedPPEs.filter(type => ["safety-vest", "helmet", "gloves", "glasses"].includes(type))
      : ["safety-vest", "helmet", "gloves", "glasses"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const violationsByHour = hours.map(hour => ({
      name: hour,
      data: Array(alertTypes.length).fill(0),
    }));

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts, recordedAt } = alert;
      const zone = zones.find(z => z.installedDevices.includes(macAddress));
      if (!zone && selectedZones?.length > 0) return;

      const hour = new Date(recordedAt).getHours();
      const hourIndex = hours.indexOf(`${hour.toString().padStart(2, '0')}:00`);

      Object.values(alertTypeCounts).forEach(types => {
        alertTypes.forEach((type, index) => {
          const typeId = Object.entries(ALERT_TYPE_MAP).find(([id, name]) => name === type)?.[0];
          if (types[typeId] && hourIndex >= 0) {
            violationsByHour[hourIndex].data[index] += types[typeId];
          }
        });
      });
    });

    return violationsByHour;
  };

  const series = isDashboard && stats?.hourlyViolationsByType
    ? stats.hourlyViolationsByType
    : internalStats;

  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        enableShades: true,
        colorScale: {
          ranges: [
            { from: 0, to: 5, color: "#FEE2E2" },
            { from: 6, to: 10, color: "#FCA5A5" },
            { from: 11, to: 15, color: "#F87171" },
            { from: 16, to: 100, color: "#DC2626" },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"],
        fontSize: "12px",
        fontWeight: "500",
      },
    },
    colors: ["#EF4444"],
    xaxis: {
      categories: isDashboard && stats?.alertTypes
        ? stats.alertTypes
        : (filters?.selectedPPEs || ["safety-vest", "helmet", "gloves", "glasses"]).map(type => type.replace("-", " ").toUpperCase()),
      labels: {
        rotate: -60,
        offsetY: 5,
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      categories: series.map(s => s.name),
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      reversed: true,
    },
    legend: { show: false },
    grid: {
      borderColor: "#E5E7EB",
      padding: { right: 0 },
    },
    tooltip: {
      enabled: true,
      y: { formatter: (val) => `${val} Compliance ` },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          {isDashboard ? "PPE Compliance by Hour" : "PPE Compliance by Type"}
        </h2>
        <HiOutlineViewfinderCircle className="text-gray-500 text-lg" />
      </div>
      {(isDashboard ? loading : internalLoading) ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : !series.length ? (
        <div className="text-center text-gray-600">No data available</div>
      ) : (
        <div className="mt-3">
          <Chart options={options} series={series} type="heatmap" height={350} />
        </div>
      )}
    </div>
  );
};

export default HeatMapChart;