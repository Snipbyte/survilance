"use client";
import dynamic from "next/dynamic";
import React from "react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";

// Fixes 'window is not defined' issue
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StackedColumnChart = () => {
  const series = [
    { name: "Vest", data: [175, 127, 111, 138, 146, 97, 118, 88, 72] },
    { name: "Helmet", data: [100, 80, 60, 70, 90, 50, 60, 40, 30] },
    { name: "Gloves", data: [50, 30, 20, 40, 60, 30, 40, 30, 20] },
    { name: "Glasses", data: [25, 17, 15, 18, 20, 10, 15, 12, 10] },
    { name: "Earplugs", data: [15, 10, 8, 10, 12, 5, 8, 6, 5] },
  ];

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
      categories: ["Terminal A", "Terminal B", "Gate Area", "Yard 1", "Crane 1", "Crane 2", "Crane 3", "Berth 1", "Berth 2"],
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
      title: { text: "Violation Count" },
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
    colors: ["#EF4444", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"], // Red, Blue, Yellow, Green, Purple
    grid: { borderColor: "#E5E7EB" },
  };

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          Non-compliance by PPE Type per Zone
        </h2>
        <HiOutlineViewfinderCircle className="text-gray-500 text-lg" />
      </div>

      {/* Chart */}
      <div className="mt-3">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default StackedColumnChart;