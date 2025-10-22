import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaBuilding, FaWarehouse, FaAnchor } from "react-icons/fa";
import { SiProgate } from "react-icons/si";

const getZoneIcon = (zoneType) => {
  switch (zoneType) {
    case "entry":
      return { Icon: SiProgate, bgColor: "bg-yellow-100 text-yellow-600" };
    case "exit":
      return { Icon: SiProgate, bgColor: "bg-green-100 text-green-600" };
    case "restricted":
      return { Icon: FaAnchor, bgColor: "bg-purple-100 text-purple-600" };
    case "general":
    default:
      return { Icon: FaBuilding, bgColor: "bg-blue-100 text-blue-600" };
  }
};

const PortZoneCard = ({ zone, onEdit, onDelete }) => {
  const { Icon, bgColor } = getZoneIcon(zone.zoneType);

  return (
    <div className="bg-white rounded-lg border p-3 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <h3 className="text-headingColor font-semibold text-base">{zone.zoneName}</h3>
          <p className="text-paraColor text-sm">
            {zone.zoneStatus} | {zone.installedDevices?.length || 0} devices
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(zone)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600 transition-colors duration-200"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(zone)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-red-50 text-red-600 transition-colors duration-200"
        >
          <RiDeleteBin6Line size={18} />
        </button>
      </div>
    </div>
  );
};

export default PortZoneCard;