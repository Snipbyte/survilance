import React from "react";
import { FiImage } from "react-icons/fi";

const DetectionCard = ({ zone, time, issue, image }) => {
  return (
    <div className="bg-gray-50 rounded-lg border p-2 flex flex-col w-[160px] sm:w-[180px]">
      <div className="bg-gray-100 w-full h-[100px] rounded-md flex items-center justify-center mb-2">
        {image ? (
          <img
            src={image}
            alt={issue}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <FiImage className="text-gray-400 text-3xl" />
        )}
      </div>
      <p className="text-sm text-headingColor">
        {zone} - {time}
      </p>
      <p className="text-sm text-red-500 font-medium">{issue}</p>
    </div>
  );
};

export default DetectionCard;
