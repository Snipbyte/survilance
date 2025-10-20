"use client";
import React from "react";
import dynamic from "next/dynamic";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SplineChart = ({
  isDashboard = true,
  title = "Hourly Violations Timeline",
  categories = [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ],
  yTitle = "Violation Rate (%)",
  seriesData = [
    {
      name: "Helmet",
      data: [14, 17, 21, 28, 25, 22, 18, 15, 12],
    },
    {
      name: "Vest",
      data: [12, 14, 18, 25, 23, 20, 17, 14, 10],
    },
    {
      name: "Gloves",
      data: [10, 12, 16, 22, 20, 16, 13, 10, 8],
    },
    {
      name: "Glasses",
      data: [8, 10, 13, 19, 17, 14, 11, 9, 7],
    },
  ],
}) => {
  // shared chart styling
  const baseOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "light" },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: yTitle,
        style: { fontSize: "12px", color: "#9CA3AF" },
      },
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
    },
  };

  // --- dashboard design ---
  const dashboardOptions = {
    ...baseOptions,
    colors: ["#FACC15", "#F43F5E", "#3B82F6", "#10B981"], // yellow, red, blue, green
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      labels: { colors: "#6B7280" },
      markers: { width: 12, height: 12, radius: 0 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    yaxis: {
      ...baseOptions.yaxis,
      min: 0,
      max: 30,
      tickAmount: 6,
    },
  };

  const dashboardSeries = [
    {
      name: "Helmet",
      data: seriesData[0].data,
      color: "#FACC15",
      marker: { shape: "square" },
    },
    {
      name: "Vest",
      data: seriesData[1].data,
      color: "#F43F5E",
      marker: { shape: "square" },
    },
    {
      name: "Gloves",
      data: seriesData[2].data,
      color: "#3B82F6",
      marker: { shape: "circle" },
    },
    {
      name: "Glasses",
      data: seriesData[3].data,
      color: "#10B981",
      marker: { shape: "triangle" },
    },
  ];

  // --- non-dashboard (Violation Trends) design ---
  const trendsOptions = {
    ...baseOptions,
    colors: ["#F43F5E", "#3B82F6", "#FACC15", "#10B981"], // Vest, Helmet, Gloves, Other PPE
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      labels: { colors: "#6B7280" },
      markers: { width: 12, height: 12, radius: 0 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    yaxis: {
      ...baseOptions.yaxis,
      title: {
        text: "Violation Count",
        style: { fontSize: "12px", color: "#9CA3AF" },
      },
      min: 50,
      max: 200,
      tickAmount: 5,
    },
    xaxis: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
      },
    },
  };

  const trendsSeries = [
    {
      name: "Vest Violations",
      data: [120, 130, 135, 125, 150, 140],
      marker: { shape: "square" },
    },
    {
      name: "Helmet Violations",
      data: [100, 110, 115, 100, 125, 120],
      marker: { shape: "circle" },
    },
    {
      name: "Gloves Violations",
      data: [150, 160, 155, 145, 180, 165],
      marker: { shape: "triangle" },
    },
    {
      name: "Other PPE",
      data: [70, 80, 85, 75, 90, 85],
      marker: { shape: "square" },
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          {isDashboard ? "Hourly Violations Timeline" : "Violation Trends"}
        </h2>
        <HiOutlineViewfinderCircle className="text-paraColor text-lg" />
      </div>

      <Chart
        options={isDashboard ? dashboardOptions : trendsOptions}
        series={isDashboard ? dashboardSeries : trendsSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default SplineChart;
