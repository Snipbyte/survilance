import React from "react";
import AiInsightsCard from "../aiInsightsCard/aiInsightsCard";

const AiInsightsSection = () => {
  const insightsData = [
    {
      type: "Critical Alert",
      message:
        "Helmet non-compliance peaked at Terminal B during night shift with 43.4% violation rate.",
      color: "red",
    },
    {
      type: "Trend Analysis",
      message:
        "Glove compliance has decreased by 15% compared to last week across all zones.",
      color: "yellow",
    },
    {
      type: "Improvement",
      message:
        "Gate Area shows consistent improvement with 84.9% compliance rate for helmet usage.",
      color: "green",
    },
    {
      type: "Recommendation",
      message:
        "Focus safety training on Terminal A and B during day shifts for vest and glove compliance.",
      color: "blue",
    },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-3">AI Insights</h2>
      <div className="max-h-[500px] overflow-auto">
      <AiInsightsCard data={insightsData} />
      </div>
    </div>
  );
};

export default AiInsightsSection;