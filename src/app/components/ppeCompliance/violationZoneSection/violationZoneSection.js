"use client";
import React, { useState, useEffect } from 'react';
import { GoDotFill } from 'react-icons/go';
import { getAlerts } from '../../../../../utils/organization/alert/api';
import { getZones } from '../../../../../utils/organization/zone/api';
import { getCameras } from '../../../../../utils/organization/camera/api';
import { ALERT_TYPE_MAP } from '../../../../../lib/alertTypes';

const DetectionZoneSection = ({ filters }) => {
  const [topZones, setTopZones] = useState([]);
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

        const processedZones = processAlertData(
          alertsData.AlarmHistoryData || [],
          filteredZones || [],
          camerasData.devicesData || [],
          selectedPPEs || []
        );

        setTopZones(processedZones);
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
          detections: 0,
        };
      }

      Object.entries(alertTypeCounts).forEach(([personId, types]) => {
        alertTypes.forEach(type => {
          const typeId = Object.entries(ALERT_TYPE_MAP).find(([id, name]) => name === type)?.[0];
          if (types[typeId]) {
            zoneDetections[zone._id].detections += 1;
          }
        });
      });
    });

    return Object.values(zoneDetections)
      .sort((a, b) => b.detections - a.detections)
      .slice(0, 3)
      .map((zone, index) => ({
        ...zone,
        color: ["text-green-500", "text-blue-500", "text-yellow-500"][index],
        bgColor: ["bg-green-50", "bg-blue-50", "bg-yellow-50"][index],
      }));
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-headingColor font-bold text-base mb-2">Top 3 Detection Zones</h2>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : topZones.length === 0 ? (
        <div className="text-center text-gray-600">No data available</div>
      ) : (
        <div className="space-y-2">
          {topZones.map((zone, index) => (
            <div key={index} className={`flex items-center justify-between ${zone.bgColor} p-2 rounded-md`}>
              <span className="flex items-center gap-2 text-headingColor font-medium">
                <GoDotFill className={zone.color} />
                {zone.zoneName}
              </span>
              <span className={`${zone.color} font-medium`}>{zone.detections} detections</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionZoneSection;