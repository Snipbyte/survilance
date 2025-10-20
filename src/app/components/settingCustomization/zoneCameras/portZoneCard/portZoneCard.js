import React from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

const PortZoneCard = ({ icon: Icon, iconBgColor, title, camerasActive, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg border p-3 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
                <div 
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
                >
                    {Icon && <Icon className="text-xl" />}
                </div>

                <div>
                    <h3 className="text-headingColor font-semibold text-base">{title}</h3>
                    <p className="text-paraColor text-sm">{camerasActive} cameras active</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onEdit}
                    className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600 transition-colors duration-200"
                >
                    <FiEdit2 size={18} />
                </button>
                <button
                    onClick={onDelete}
                    className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-red-50 text-red-600 transition-colors duration-200"
                >
                    <RiDeleteBin6Line size={18} />
                </button>
            </div>
        </div>
    );
};

export default PortZoneCard;