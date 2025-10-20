"use client";
import dynamic from "next/dynamic";
import React from "react";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";

// Dynamically import ApexCharts (fixes window not defined)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const HeatMapChart = ({ isDashboard = true }) => {
  // ✅ Data changes based on prop
  const series = isDashboard
    ? [
        { name: "14:00", data: [67, 48, 52, 16, 115, 120, 96, 30] },
        { name: "12:00", data: [24, 117, 64, 19, 117, 6, 98, 32] },
        { name: "10:00", data: [8, 78, 123, 114, 8, 12, 88, 82] },
        { name: "08:00", data: [19, 58, 15, 132, 5, 32, 44, 1] },
        { name: "06:00", data: [10, 92, 35, 72, 38, 88, 13, 31] },
      ]
    : [
        { name: "14:00", data: [25, 55, 60, 40, 75, 20, 65, 45] },
        { name: "12:00", data: [45, 80, 55, 60, 35, 90, 70, 30] },
        { name: "10:00", data: [60, 40, 70, 55, 85, 50, 95, 20] },
        { name: "08:00", data: [75, 60, 85, 40, 65, 80, 55, 25] },
        { name: "06:00", data: [45, 80, 55, 60, 35, 90, 70, 30] },
      ];

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
            { from: 0, to: 50, color: "#FEE2E2" },
            { from: 51, to: 75, color: "#FCA5A5" },
            { from: 76, to: 100, color: "#F87171" },
            { from: 101, to: 150, color: "#DC2626" },
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
      categories: isDashboard
        ? [
            "Loading A",
            "Loading B",
            "Crane 1",
            "Crane 2",
            "Crane 3",
            "Storage 1",
            "Storage 2",
            "Storage 3",
          ]
        : [
            "Terminal A",
            "Terminal B",
            "Gate",
            "Yard 1",
            "Yard 2",
            "Crane 1",
            "Crane 2",
            "Berth",
          ],
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
      categories: isDashboard
        ? ["06:00", "08:00", "10:00", "12:00", "14:00"]
        : ["Week 1", "Week 2", "Week 3", "Week 4"],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      reversed: true,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#E5E7EB",
      padding: {
        right: 0,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          {isDashboard ? "Zone Heatmap" : "Zone × Time Heatmap"}
        </h2>
        <HiOutlineViewfinderCircle className="text-gray-500 text-lg" />
      </div>

      <div className="mt-3">
        <Chart options={options} series={series} type="heatmap" height={350} />
      </div>
    </div>
  );
};

export default HeatMapChart;
