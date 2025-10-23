"use client";
import React, { useState, useEffect } from "react";
import { FiEye, FiFilter, FiDownload } from "react-icons/fi";
import Pagination from "../../common/pagination/pagination";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

const ComplianceDataTable = ({ filters }) => {
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { dateFrom, dateTo, selectedZones, selectedCameras, selectedPPEs } = filters;
        const macAddresses = selectedCameras.length > 0
          ? selectedCameras.map(c => c.deviceMAC)
          : cameras.map(c => c.deviceMAC);
        const alertsData = await getAlerts(
          "PPE",
          1,
          100,
          macAddresses.length > 0 ? macAddresses.join(",") : "",
          dateFrom,
          dateTo
        );
        const zonesData = await getZones(1, 100);
        const camerasData = await getCameras(1, 100);

        setZones(zonesData.zonesData || []);
        setCameras(camerasData.devicesData || []);

        const filteredZones = selectedZones.length > 0
          ? zonesData.zonesData.filter(z => selectedZones.some(sz => sz._id === z._id))
          : zonesData.zonesData;

        const processedData = processAlertData(
          alertsData.AlarmHistoryData || [],
          filteredZones,
          camerasData.devicesData || [],
          selectedPPEs
        );

        setData(processedData);
        setTotalPages(Math.ceil(processedData.length / rowsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const processAlertData = (alerts, zones, cameras, selectedPPEs) => {
    const groupedData = {};

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts, recordedAt } = alert;
      const camera = cameras.find(c => c.deviceMAC === macAddress);
      const zone = zones.find(z => z.installedDevices.includes(macAddress)) || { zoneName: "Unknown" };

      Object.entries(alertTypeCounts).forEach(([frameId, types]) => {
        Object.keys(types).forEach(typeId => {
          const ppeType = ALERT_TYPE_MAP[typeId];
          if (selectedPPEs.length > 0 && !selectedPPEs.includes(ppeType)) return;
          if (!["safety-vest", "helmet", "gloves", "glasses"].includes(ppeType)) return;

          const key = `${zone.zoneName}_${macAddress}_${ppeType}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              zone: zone.zoneName,
              camera: camera?.deviceName || macAddress,
              ppe: ppeType.replace("-", " ").toUpperCase(),
              total: 0,
              nonCompliant: 0,
            };
          }
          groupedData[key].total += 1;
          groupedData[key].nonCompliant += types[typeId] ? 1 : 0;
        });
      });
    });

    return Object.values(groupedData).map(item => ({
      ...item,
      rate: item.total > 0 ? ((item.total - item.nonCompliant) / item.total * 100).toFixed(1) : 0,
    }));
  };

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

  const getRateColor = (rate) => {
    if (rate < 60) return "bg-red-500";
    if (rate < 75) return "bg-orange-400";
    return "bg-green-500";
  };

  const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Compliance Data Table</h2>
        <div className="flex items-center gap-2">
          {/* <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiFilter className="text-gray-500" /> Filter
          </button>
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiDownload className="text-gray-500" /> Export
          </button> */}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Zone</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Camera</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">PPE Type</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Total Detections</th>
            
{/*             
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">No data available</td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3">{row.zone}</td>
                  <td className="px-4 py-3">{row.camera}</td>
                  <td className="px-4 py-3">{row.ppe}</td>
                  <td className="px-4 py-3 font-medium">{row.total}</td>
                  
                  {/* <td className="px-4 py-3 flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        row.rate < 60
                          ? "text-red-500"
                          : row.rate < 75
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    >
                      {row.rate}%
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`${getRateColor(row.rate)} h-2 rounded-full`}
                        style={{ width: `${row.rate}%` }}
                      ></div>
                    </div>
                  </td> */}
                  {/* <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-blue-600 hover:underline">
                      <FiEye className="text-blue-600" /> View Details
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data.length}
        resultsPerPage={rowsPerPage}
      />
    </div>
  );
};

export default ComplianceDataTable;