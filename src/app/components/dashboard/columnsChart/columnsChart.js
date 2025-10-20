"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts (disable SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColumnsChart = ({ isDashboard = true }) => {
  const [activeFilter, setActiveFilter] = useState("Zone");
  const [activeChart, setActiveChart] = useState("bar");

  // ✅ Common base options
  const baseOptions = {
    chart: {
      type: activeChart,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    tooltip: {
      y: { formatter: (val) => val + "%" },
    },
    legend: {
      position: "bottom",
      markers: { shape: "circle", radius: 12 },
    },
  };

  // ✅ Data for both charts
  const series = [
    { name: "Safety Vest", data: [72, 70, 80, 78, 74] },
    { name: "Helmet", data: [68, 63, 77, 75, 72] },
    { name: "Gloves", data: [65, 57, 70, 71, 69] },
  ];

  // ✅ Original Dashboard Chart Design (from your code)
  const dashboardOptions = {
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
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Loading Dock A",
        "Loading Dock B",
        "Crane Area 1",
        "Crane Area 2",
        "Crane Area 3",
        "Storage Bay 1",
        "Storage Bay 2",
        "Storage Bay 3",
        "Maintenance",
        "Office Area",
      ],
    },
    yaxis: {
      title: {
        text: "Non-compliance Count",
        style: { fontSize: "10px", color: "#9CA3AF" },
      },
    },
    fill: { opacity: 1 },
    colors: ["#1E90FF", "#FF4500", "#FFA500", "#32CD32"],
    tooltip: {
      y: { formatter: (val) => val + " violations" },
    },
    legend: { position: "bottom", markers: { shape: "circle" } },
    series: [
      { name: "Helmet Violations", data: [50, 30, 20, 40, 50, 20, 30, 10, 5, 10] },
      { name: "Vest Violations", data: [60, 40, 30, 45, 55, 25, 40, 15, 10, 5] },
      { name: "Gloves Violations", data: [20, 25, 15, 30, 35, 15, 20, 10, 5, 5] },
      { name: "Glasses Violations", data: [30, 20, 10, 25, 30, 10, 15, 5, 2, 2] },
    ],
  };

  // ✅ Visualization Chart (when isDashboard === false)
  const visualizationOptions = {
    ...baseOptions,
    xaxis: {
      categories: ["Terminal A", "Terminal B", "Yard 1", "Gate Area", "Crane 1"],
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Compliance Rate (%)", style: { color: "#6B7280", fontSize: "12px" } },
      min: 0,
      max: 100,
    },
    colors: ["#2563EB", "#F59E0B", "#10B981"], // blue, orange, green
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", borderRadius: 2 },
    },
    grid: { borderColor: "#E5E7EB" },
  };

  // ✅ Conditional Rendering
  return (
    <>
      {isDashboard ? (
        // ---- Dashboard Mode ----
        <div className="p-4 bg-white rounded-lg border my-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-headingColor text-2xl font-bold">
              Non-compliance by Zone
            </h3>
            <div className="flex space-x-2">
              <button
                className={`px-2 py-1 text-sm rounded ${
                  activeFilter === "Zone"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-paraColor"
                }`}
                onClick={() => setActiveFilter("Zone")}
              >
                Zone
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${
                  activeFilter === "Shift"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-paraColor"
                }`}
                onClick={() => setActiveFilter("Shift")}
              >
                Shift
              </button>
            </div>
          </div>
          <div className="w-full">
            <Chart
              options={dashboardOptions}
              series={dashboardOptions.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      ) : (
        // ---- Visualization Mode ----
        <div className="bg-white border rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-800 font-semibold text-base">
              Compliance Visualization
            </h3>

            {/* Buttons now same like Zone/Shift (no functionality) */}
            <div className="flex space-x-2">
              {["bar", "line", "pie"].map((type) => (
                <button
                  key={type}
                  className={`px-2 py-1 text-sm rounded capitalize ${
                    activeChart === type
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-paraColor"
                  }`}
                  onClick={() => setActiveChart(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <Chart
              options={visualizationOptions}
              series={series}
              type="bar"
              height={480}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ColumnsChart;
