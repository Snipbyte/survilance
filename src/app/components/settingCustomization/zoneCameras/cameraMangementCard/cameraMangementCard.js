import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const CameraManagementCard = ({ camera, onEdit, onDelete }) => {
  const isOnline = camera.deviceStatus === "online";
  const statusColor = isOnline ? "text-green-600" : "text-red-600";
  const statusBgColor = isOnline ? "bg-green-50" : "bg-red-50";
  const dotColor = isOnline ? "bg-green-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
          <h3 className="text-headingColor font-semibold text-base">{camera.deviceName}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBgColor}`}>
            {camera.deviceStatus.charAt(0).toUpperCase() + camera.deviceStatus.slice(1)}
          </span>
          <button
            onClick={() => onEdit(camera)}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600 transition-colors duration-200"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(camera)}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-red-50 text-red-600 transition-colors duration-200"
          >
            <RiDeleteBin6Line size={18} />
          </button>
        </div>
      </div>
      <p className="text-paraColor text-sm mb-2">
        {camera.deviceLocation} {camera.zoneId?.zoneName ? `| Zone: ${camera.zoneId.zoneName}` : ""}
      </p>
      <p className="text-paraColor text-xs">
        IP: {camera.deviceIP} | Resolution: {camera.deviceResolution}
      </p>
    </div>
  );
};

export default CameraManagementCard;