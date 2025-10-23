"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedColumnChart = ({ filters }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

        const { series: newSeries, categories: newCategories } = processAlertData(
          alertsData.AlarmHistoryData || [],
          filteredZones || [],
          camerasData.devicesData || [],
          selectedPPEs || []
        );

        setSeries(newSeries);
        setCategories(newCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const processAlertData = (alerts, zones, cameras, selectedPPEs) => {
    const alertTypes = selectedPPEs.length > 0
      ? selectedPPEs.filter(type => ["safety-vest", "helmet", "gloves", "glasses"].includes(type))
      : ["safety-vest", "helmet", "gloves", "glasses"];
    const zoneDetections = {};

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts } = alert;
      const zone = zones.find(z => z.installedDevices.includes(macAddress)) || { zoneName: "Unknown", _id: "unknown" };

      if (!zoneDetections[zone._id]) {
        zoneDetections[zone._id] = {
          zoneName: zone.zoneName,
          detections: Array(alertTypes.length).fill(0),
        };
      }

      Object.entries(alertTypeCounts).forEach(([personId, types]) => {
        alertTypes.forEach((type, index) => {
          const typeId = Object.entries(ALERT_TYPE_MAP).find(([id, name]) => name === type)?.[0];
          if (types[typeId]) {
            zoneDetections[zone._id].detections[index] += 1;
          }
        });
      });
    });

    const series = alertTypes.map(type => ({
      name: type.replace("-", " ").toUpperCase(),
      data: Object.values(zoneDetections).map(zone => zone.detections[alertTypes.indexOf(type)] || 0),
    }));

    const categories = Object.values(zoneDetections).map(zone => zone.zoneName);

    return { series, categories };
  };

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        dataLabels: { enabled: false },
        columnWidth: "40%",
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      title: { text: "Detection Count" },
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: "#6B7280",
      },
      markers: {
        shape: "circle",
      },
    },
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
    grid: { borderColor: "#E5E7EB" },
  };

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          Compliance by PPE Type per Zone
        </h2>
        <HiOutlineViewfinderCircle className="text-gray-500 text-lg" />
      </div>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : !series.length ? (
        <div className="text-center text-gray-600">No data available</div>
      ) : (
        <div className="mt-3">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      )}
    </div>
  );
};

export default StackedColumnChart;