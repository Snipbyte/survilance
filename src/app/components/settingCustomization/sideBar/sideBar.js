import React from "react";
import {
  FaCogs,
  FaFileAlt,
  FaPlug,
  FaPuzzlePiece,
} from "react-icons/fa";
import { FaHelmetSafety } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const tabs = [
    { id: "zones-cameras", icon: FaCogs, label: "Zones & Cameras" },
    { id: "ppe-rules", icon: FaHelmetSafety, label: "PPE Rules" },
    { id: "report-templates", icon: FaFileAlt, label: "Report Templates" },
    { id: "integrations", icon: FaPlug, label: "Integrations" },
    { id: "modules", icon: FaPuzzlePiece, label: "Modules" },
  ];

  return (
    <>
      {/* Overlay – visible only on mobile when drawer is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`
          /* Mobile (default) – fixed, slides in/out, full height, white bg */
          fixed top-0 left-0 h-screen w-64 bg-white border-r p-4 z-40
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}

          /* md+ – normal flow, full height, white bg, stays visible */
          md:relative md:h-screen md:translate-x-0
        `}
      >
        {/* Close button – mobile only */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-lg font-bold text-headingColor">Settings</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            <IoClose />
          </button>
        </div>

        {/* Title – desktop only */}
        <h2 className="hidden md:block text-xl font-bold mb-6 text-headingColor">
          Settings & Configuration
        </h2>

        <ul className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false); // close on mobile tap
                  }}
                  className={`
                    flex items-center w-full p-2 text-sm md:text-base
                    font-semibold rounded transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="mr-2 text-lg md:text-xl" /> {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;