"use client";
import React, { useState } from "react";
import { FiEye, FiFilter, FiDownload } from "react-icons/fi";
import Pagination from "../../common/pagination/pagination";

const ComplianceDataTable = () => {
  const allData = [
    { zone: "Terminal A", shift: "Day Shift", ppe: "Safety Vest", total: "1,245", nonCompliant: "342", rate: 72.5 },
    { zone: "Terminal A", shift: "Day Shift", ppe: "Helmet", total: "1,245", nonCompliant: "298", rate: 76.1 },
    { zone: "Terminal B", shift: "Night Shift", ppe: "Gloves", total: "892", nonCompliant: "387", rate: 56.6 },
    { zone: "Yard 1", shift: "Day Shift", ppe: "Safety Vest", total: "756", nonCompliant: "152", rate: 79.9 },
    { zone: "Gate Area", shift: "Night Shift", ppe: "Helmet", total: "445", nonCompliant: "67", rate: 84.9 },
    { zone: "Terminal D", shift: "Evening", ppe: "Boots", total: "995", nonCompliant: "143", rate: 85.6 },
    { zone: "Warehouse", shift: "Morning", ppe: "Gloves", total: "543", nonCompliant: "167", rate: 69.2 },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(allData.length / rowsPerPage);

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

  const startIndex = currentPage * rowsPerPage;
  const paginatedData = allData.slice(startIndex, startIndex + rowsPerPage);

  const getRateColor = (rate) => {
    if (rate < 60) return "bg-red-500";
    if (rate < 75) return "bg-orange-400";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Compliance Data Table</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiFilter className="text-gray-500" /> Filter
          </button>
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiDownload className="text-gray-500" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Zone</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Shift</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">PPE Type</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Total Detections</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Non-Compliant</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Compliance Rate</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3">{row.zone}</td>
                <td className="px-4 py-3">{row.shift}</td>
                <td className="px-4 py-3">{row.ppe}</td>
                <td className="px-4 py-3 font-medium">{row.total}</td>
                <td className="px-4 py-3 text-red-500 font-medium">{row.nonCompliant}</td>
                <td className="px-4 py-3 flex items-center gap-2">
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
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <FiEye className="text-blue-600" /> View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={allData.length}
        resultsPerPage={rowsPerPage}
      />
    </div>
  );
};

export default ComplianceDataTable;