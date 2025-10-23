"use client";
import React, { useState, useEffect } from "react";
import Button from "../../common/button/button";
import { FaRegChartBar } from "react-icons/fa6";
import Input from "../../common/input/input";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";

const ReportBuilderSection = ({ onGenerateReport }) => {
  const [zones, setZones] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [selectedPPEs, setSelectedPPEs] = useState([]);
  const [dateFrom, setDateFrom] = useState("2025-10-01");
  const [dateTo, setDateTo] = useState("2025-10-23");
  const [groupBy, setGroupBy] = useState("Zone");
  const [reportType, setReportType] = useState("Summary");
  const [compareMode, setCompareMode] = useState("This week vs. Last week");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const zonesData = await getZones(1, 100);
        const camerasData = await getCameras(1, 100);
        setZones(zonesData.zonesData || []);
        setCameras(camerasData.devicesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateReportClick = () => {
    onGenerateReport({
      dateFrom,
      dateTo,
      selectedZones,
      selectedCameras,
      selectedPPEs,
      groupBy,
      reportType,
      compareMode,
    });
  };

  const ppeOptions = Object.values(ALERT_TYPE_MAP)

  return (
    <div className="bg-white rounded-lg border p-4 my-6 w-full">
      <h2 className="text-lg font-semibold mb-6">Report Builder</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Date Range</label>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                type="date"
                className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
             
            </div>
            <span className="text-gray-500 text-sm">to</span>
            <div className="relative w-full">
              <Input
                type="date"
                className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
             
            </div>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Zones (Multi-select)</label>
          <select
            multiple
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-[80px]"
            value={selectedZones.map(z => z._id)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option =>
                zones.find(z => z._id === option.value)
              );
              setSelectedZones(selected);
            }}
          >
            {zones.map(zone => (
              <option key={zone._id} value={zone._id}>
                {zone.zoneName} ({zone.zoneCode})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Cameras</label>
          <select
            multiple
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-[80px]"
            value={selectedCameras.map(c => c.deviceMAC)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(option =>
                cameras.find(c => c.deviceMAC === option.value)
              );
              setSelectedCameras(selected);
            }}
          >
            {cameras.map(camera => (
              <option key={camera.deviceMAC} value={camera.deviceMAC}>
                {camera.deviceName} ({camera.deviceMAC})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">PPE Types</label>
          <div className="flex flex-col gap-2 border rounded-md p-2">
            {ppeOptions.map(ppe => (
              <label key={ppe} className="flex items-center text-sm text-paraColor">
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-500"
                  checked={selectedPPEs.includes(ppe)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPPEs([...selectedPPEs, ppe]);
                    } else {
                      setSelectedPPEs(selectedPPEs.filter(p => p !== ppe));
                    }
                  }}
                />
                {ppe.replace("-", " ").toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Group By</label>
          <select
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option>Zone</option>
            <option>Camera</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Report Type</label>
          <select
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option>Summary</option>
            <option>Detailed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end gap-6">
     

        <div className="flex justify-end w-full md:w-auto">
          <Button
            className="text-white font-medium text-sm px-5 py-2.5 rounded-md flex items-center gap-2 mt-5 md:mt-0 bg-blue-600 hover:bg-blue-700"
            onClick={handleGenerateReportClick}
          >
            <FaRegChartBar className="mr-2" />Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilderSection;