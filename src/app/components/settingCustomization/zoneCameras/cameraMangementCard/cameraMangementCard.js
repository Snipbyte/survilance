import React from 'react';

const CameraManagementCard = ({ cameraId, location, ip, resolution, status }) => {
    // Determine status color and background
    const isOnline = status === 'Online';
    const statusColor = isOnline ? 'text-green-600' : 'text-red-600';
    const statusBgColor = isOnline ? 'bg-green-50' : 'bg-red-50';
    const dotColor = isOnline ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
            {/* Camera ID and Status */}
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
                    <h3 className="text-headingColor font-semibold text-base">{cameraId}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} ${statusBgColor}`}>
                    {status}
                </span>
            </div>

            {/* Location */}
            <p className="text-paraColor text-sm mb-2">{location}</p>

            {/* IP and Resolution */}
            <p className="text-paraColor text-xs">
                IP: {ip} | Resolution: {resolution}
            </p>
        </div>
    );
};

export default CameraManagementCard;