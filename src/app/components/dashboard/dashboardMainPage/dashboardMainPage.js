"use client";
import React, { useState, useEffect } from "react";
import OverViewSection from "../overViewSection/overViewSection";
import Intro from "../../common/intro/intro";
import StatsSection from "../statsSection/statsSection";
import QuickActionSection from "../quickActionSection/quickActionSection";
import ColumnsChart from "../columnsChart/columnsChart";
import HeatMapChart from "../../common/heatMapChart/heatMapChart";
import Breadcrumb from "../../common/breadcrumb/breadcurmb";
import Header from "../../common/header/header";
import { getAlertHistoryStats } from "../../../../../utils/organization/alert/api";
import SplineChart from "../../common/splineChart/splineChart";

const DashboardMainPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Port Surveillance", href: "#" },
    { label: "Main Dashboard", href: "/dashboard" },
  ];

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching alert history stats...");
        const statsResponse = await getAlertHistoryStats("PPE");
        console.log("Alert History Stats:", statsResponse);
        setStats(statsResponse);
        setError(null);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message || "Failed to fetch alert stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header variant="variant1" />
      <Breadcrumb items={breadcrumbItems} />
      <div className="p-3">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-800 font-semibold mb-2">Loading Data...</h3>
            <p className="text-blue-600 text-sm">Please wait while we fetch the latest data.</p>
          </div>
        )}
        <Intro
          heading="PPE Compliance Dashboard"
          des="Real-time monitoring and analytics for Personal Protective Equipment compliance"
          headingClassName="text-xl md:text-2xl lg:text-3xl font-bold"
        />
        <OverViewSection stats={stats} loading={loading} />
        <StatsSection />
        <div className="md:flex justify-between my-6">
          <div className="w-full md:w-[49%]">
            <HeatMapChart isDashboard={true} stats={stats} loading={loading} />
          </div>
          <div className="w-full md:w-[49%]">
            <SplineChart isDashboard={true} stats={stats} loading={loading} />
          </div>
        </div>
        <ColumnsChart isDashboard={true} stats={stats} loading={loading} />
        <QuickActionSection />
      </div>
    </div>
  );
};

export default DashboardMainPage;