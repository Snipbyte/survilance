"use client";
import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      {/* ✅ Tab buttons row */}
      <div className="flex items-center space-x-2 bg-gray-50 rounded-md p-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-1 text-sm rounded-md font-medium transition-all duration-200
              ${
                index === activeTab
                  ? "bg-blue-100 text-blue-600"
                  : "text-paraColor hover:bg-lightCard"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
