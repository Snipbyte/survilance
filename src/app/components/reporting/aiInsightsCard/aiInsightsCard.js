import React from "react";
import {
  FaExclamationTriangle,
  FaChartLine,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";

const AiInsightsCard = ({ data }) => {
  const iconMap = {
    red: <FaExclamationTriangle className="text-red-500" />,
    yellow: <FaChartLine className="text-yellow-500" />,
    green: <FaCheckCircle className="text-green-500" />,
    blue: <FaLightbulb className="text-blue-500" />,
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      {data.map((item, index) => (
        <div
          key={index}
          className={`mb-4 p-4 rounded-lg flex items-start ${
            item.color === "red" ? "bg-red-50 border-l-red-500" :
            item.color === "yellow" ? "bg-yellow-50 border-l-yellow-500" :
            item.color === "green" ? "bg-green-50 border-l-green-500" :
            item.color === "blue" ? "bg-blue-50 border-l-blue-500" : ""
          } border-l-4`}
        >
          <div className="mr-3 mt-1 text-xl">{iconMap[item.color]}</div>
          <div>
            <span className="font-semibold">{item.type}</span>
            <p className="text-sm mt-1 text-paraColor">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiInsightsCard;