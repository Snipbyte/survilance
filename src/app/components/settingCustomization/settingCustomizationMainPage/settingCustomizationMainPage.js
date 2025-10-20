"use client";
import React, { useState } from "react";
import Sidebar from "../sideBar/sideBar";
import ZoneCamerasMainPage from "../zoneCameras/zoneCamerasMainPage/zoneCamerasMainPage";
import { FaBars } from "react-icons/fa";
import Breadcrumb from "../../common/breadcrumb/breadcurmb";
import Header from "../../common/header/header";

const SettingCustomizationMainPage = () => {
  const [activeTab, setActiveTab] = useState("zones-cameras");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Port Surveillance", href: "#" },
    { label: "Settings", href: "/setting-customization" },
  ];

  return (
    <div className="flex flex-col min-h-screen mt-8 md:mt-0">
      <Header variant="variant5" />
      <Breadcrumb items={breadcrumbItems} className="px-4 py-2" />
      <div className="flex flex-1 relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-20 flex items-center justify-between px-4 py-2">
          <button
            className="text-xl text-gray-700"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h2 className="font-semibold text-gray-800 text-sm md:text-base">Settings</h2>
        </div>

        <div className="flex-1 p-2 w-full">
          {activeTab === "zones-cameras" && <ZoneCamerasMainPage />}
          {activeTab === "ppe-rules" && "PPE Rules Page"}
          {activeTab === "report-templates" && "Report Templates Page"}
          {activeTab === "integrations" && "Integrations Page"}
          {activeTab === "modules" && "Modules Page"}
        </div>
      </div>
    </div>
  );
};

export default SettingCustomizationMainPage;