"use client";
import React, { useState, useEffect } from "react";
import StatsCard from "../statsCard/statsCard";
import { FaCheckCircle, FaGlasses } from "react-icons/fa";
import { FaHand, FaHelmetSafety } from "react-icons/fa6";
import { TbJacket } from "react-icons/tb";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

const StatsSection = ({ filters }) => {
  const [statsData, setStatsData] = useState([]);
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

        const processedStats = processAlertData(
          alertsData.AlarmHistoryData || [],
          filteredZones || [],
          camerasData.devicesData || [],
          selectedPPEs || []
        );

        setStatsData(processedStats);
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
    let totalDetections = 0;
    const typeCounts = {};

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts } = alert;
      const zone = zones.find(z => z.installedDevices.includes(macAddress));
      if (!zone && selectedZones?.length > 0) return;

      Object.entries(alertTypeCounts).forEach(([personId, types]) => {
        alertTypes.forEach(type => {
          const typeId = Object.entries(ALERT_TYPE_MAP).find(([id, name]) => name === type)?.[0];
          if (types[typeId]) {
            typeCounts[type] = (typeCounts[type] || 0) + 1; // Count each true as one detection
            totalDetections += 1;
          }
        });
      });
    });

    const totalDetectionsSum = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

    return [
      {
        title: "Total PPE Detections",
        icon: FaCheckCircle,
        iconColor: "text-green-500",
        mainValue: totalDetections.toString(),
        mainColor: "text-green-600",
        subText: "Total detections",
        subColor: "text-paraColor",
      },
      {
        title: "Vest Detections",
        icon: TbJacket,
        iconColor: "text-orange-500",
        mainValue: (typeCounts["safety-vest"] || 0).toString(),
        mainColor: "text-headingColor",
        subText: totalDetectionsSum > 0 ? `${((typeCounts["safety-vest"] || 0) / totalDetectionsSum * 100).toFixed(1)}% of total` : "0%",
        subColor: "text-green-500",
      },
      {
        title: "Helmet Detections",
        icon: FaHelmetSafety,
        iconColor: "text-blue-500",
        mainValue: (typeCounts["helmet"] || 0).toString(),
        mainColor: "text-headingColor",
        subText: totalDetectionsSum > 0 ? `${((typeCounts["helmet"] || 0) / totalDetectionsSum * 100).toFixed(1)}% of total` : "0%",
        subColor: "text-green-500",
      },
      {
        title: "Gloves Detections",
        icon: FaHand,
        iconColor: "text-yellow-500",
        mainValue: (typeCounts["gloves"] || 0).toString(),
        mainColor: "text-headingColor",
        subText: totalDetectionsSum > 0 ? `${((typeCounts["gloves"] || 0) / totalDetectionsSum * 100).toFixed(1)}% of total` : "0%",
        subColor: "text-green-500",
      },
      {
        title: "Glasses Detections",
        icon: FaGlasses,
        iconColor: "text-green-500",
        mainValue: (typeCounts["glasses"] || 0).toString(),
        mainColor: "text-headingColor",
        subText: totalDetectionsSum > 0 ? `${((typeCounts["glasses"] || 0) / totalDetectionsSum * 100).toFixed(1)}% of total` : "0%",
        subColor: "text-green-500",
      },
    ];
  };

  return (
    <div className="flex flex-wrap justify-between my-6">
      {loading ? (
        <div className="text-center text-gray-600 w-full">Loading...</div>
      ) : (
        statsData.map((item, index) => (
          <StatsCard key={index} {...item} />
        ))
      )}
    </div>
  );
};

export default StatsSection;