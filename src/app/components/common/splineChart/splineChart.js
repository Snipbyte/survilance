"use client";
import React from "react";
import dynamic from "next/dynamic";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SplineChart = ({
  stats,
  isDashboard = true,
  title = "Hourly Compliance Timeline",
  categories = [
    "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
  ],
  yTitle = "Violation Rate (%)",
}) => {
  // Process real data from stats prop
  const processHourlyViolationsData = () => {
    if (!stats?.hourlyViolationsByType?.length) {
      return [];
    }

    // Extract PPE types from alertTypes
    const ppeTypes = stats.alertTypes || [];
    
    return ppeTypes.map((ppeType, index) => {
      const data = stats.hourlyViolationsByType.map(hourData => {
        const hourIndex = ppeTypes.indexOf(ppeType);
        return hourIndex >= 0 && hourData.data && hourData.data[hourIndex] 
          ? hourData.data[hourIndex] 
          : 0;
      });

      return {
        name: formatPPEName(ppeType),
        data: data,
      };
    });
  };

  // Process violation trends data
  const processViolationTrendsData = () => {
    if (!stats?.violationsTrend?.length) {
      return [];
    }

    // Group by PPE type (simplified - you might need more complex logic based on your actual data structure)
    const ppeTypes = stats.mostViolatedPPE || [];
    
    return ppeTypes.map(ppeType => {
      const data = stats.violationsTrend.map(day => {
        // This is a simplified mapping - adjust based on your actual data structure
        // You might need to access day[ppeType] or similar based on how your data is structured
        return day.violations || 0;
      });

      return {
        name: `${formatPPEName(ppeType)} Violations`,
        data: data,
      };
    });
  };

  // Format PPE names for display
  const formatPPEName = (ppeType) => {
    const nameMap = {
      "ear": "Ear Protection",
      "ear-mufs": "Ear Muffs", 
      "face": "Face Shield",
      "face-guard": "Face Guard",
      "foot": "Safety Shoes",
      "hand": "Gloves",
      "head": "Helmet",
      "vest": "Safety Vest"
    };
    
    return nameMap[ppeType] || ppeType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get categories for dashboard (time-based)
  const getDashboardCategories = () => {
    if (stats?.hourlyViolationsByType?.length) {
      return stats.hourlyViolationsByType.map(hourData => {
        const hour = parseInt(hourData.name);
        return `${hour.toString().padStart(2, '0')}:00`;
      });
    }
    return categories;
  };

  // Get categories for trends (date-based)
  const getTrendsCategories = () => {
    if (stats?.violationsTrend?.length) {
      return stats.violationsTrend.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
    }
    return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  };

  // Shared chart styling
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

  // Process real data
  const realDashboardSeries = processHourlyViolationsData();
  const realTrendsSeries = processViolationTrendsData();
  const dashboardCategories = getDashboardCategories();
  const trendsCategories = getTrendsCategories();

  // --- Dashboard design ---
  const dashboardOptions = {
    ...baseOptions,
    colors: ["#FACC15", "#F43F5E", "#3B82F6", "#10B981", "#8B5CF6", "#06B6D4", "#EF4444"], // Multiple colors for different PPE types
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      labels: { colors: "#6B7280" },
      markers: { width: 12, height: 12, radius: 0 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    xaxis: {
      ...baseOptions.xaxis,
      categories: dashboardCategories,
    },
    yaxis: {
      ...baseOptions.yaxis,
      min: 0,
      tickAmount: 6,
    },
  };

  const dashboardSeries = realDashboardSeries.length > 0 ? realDashboardSeries.map((series, index) => ({
    ...series,
    color: ["#FACC15", "#F43F5E", "#3B82F6", "#10B981", "#8B5CF6", "#06B6D4", "#EF4444"][index % 7],
    marker: { 
      shape: ["square", "circle", "triangle", "diamond"][index % 4] 
    },
  })) : [
    {
      name: "No Data",
      data: dashboardCategories.map(() => 0),
      color: "#9CA3AF",
    }
  ];

  // --- Non-dashboard (Violation Trends) design ---
  const trendsOptions = {
    ...baseOptions,
    colors: ["#F43F5E", "#3B82F6", "#FACC15", "#10B981", "#8B5CF6"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      labels: { colors: "#6B7280" },
      markers: { width: 12, height: 12, radius: 0 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    xaxis: {
      ...baseOptions.xaxis,
      categories: trendsCategories,
    },
    yaxis: {
      ...baseOptions.yaxis,
      title: {
        text: "Violation Count",
        style: { fontSize: "12px", color: "#9CA3AF" },
      },
      min: 0,
      tickAmount: 5,
    },
  };

  const trendsSeries = realTrendsSeries.length > 0 ? realTrendsSeries : [
    {
      name: "No Data Available",
      data: trendsCategories.map(() => 0),
      color: "#9CA3AF",
    }
  ];

  console.log('Processed stats data:', {
    dashboardSeries: realDashboardSeries,
    trendsSeries: realTrendsSeries,
    dashboardCategories,
    trendsCategories
  });

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-headingColor font-bold text-base">
          {isDashboard ? "Hourly Compliance Timeline" : "Compliance Trends"}
        </h2>
        <HiOutlineViewfinderCircle className="text-paraColor text-lg" />
      </div>

      <Chart
        options={isDashboard ? dashboardOptions : trendsOptions}
        series={isDashboard ? dashboardSeries : trendsSeries}
        type="line"
        height={350}
      />
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          Data points: {isDashboard ? dashboardSeries[0]?.data?.length : trendsSeries[0]?.data?.length}
        </div>
      )}
    </div>
  );
};

export default SplineChart;