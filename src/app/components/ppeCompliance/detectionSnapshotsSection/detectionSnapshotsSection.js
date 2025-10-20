"use client";
import React, { useState, useEffect } from "react";
import DetectionCard from "../detectionCard/detectionCard";

const DetectionSnapshotsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isFading, setIsFading] = useState(false);

  const snapshots = [
    { zone: "Zone A", time: "14:23", issue: "Missing Vest", category: "Vest" },
    { zone: "Zone B", time: "14:18", issue: "Missing Helmet", category: "Helmet" },
    { zone: "Zone C", time: "14:15", issue: "Missing Gloves", category: "Gloves" },
    { zone: "Zone A", time: "14:12", issue: "Missing Glasses", category: "Gloves" },
    { zone: "Zone D", time: "14:08", issue: "Missing Vest", category: "Vest" },
    { zone: "Zone B", time: "14:05", issue: "Missing Helmet", category: "Helmet" },
  ];

  const tabs = ["All", "Vest", "Helmet", "Gloves"];

  useEffect(() => {
    const newData =
      activeTab === 0
        ? snapshots
        : snapshots.filter((s) => s.category === tabs[activeTab]);
    setFilteredData(newData);
  }, [activeTab]);

  const handleTabChange = (index) => {
    if (index === activeTab) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsFading(false);
    }, 200); // fade duration
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-headingColor font-bold text-base">
          Detection Snapshots
        </h2>

        {/* Tabs */}
        <div className="flex items-center space-x-2 bg-gray-50 rounded-md p-1">
          {tabs.map((label, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-all duration-200 ${
                index === activeTab
                  ? "bg-blue-100 text-blue-600"
                  : "text-paraColor hover:bg-lightCard"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards area with fade animation */}
      <div
        className={`flex flex-wrap gap-3 transition-opacity duration-300 ${
          isFading ? "opacity-0" : "opacity-100"
        }`}
      >
        {filteredData.map((item, idx) => (
          <DetectionCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default DetectionSnapshotsSection;
