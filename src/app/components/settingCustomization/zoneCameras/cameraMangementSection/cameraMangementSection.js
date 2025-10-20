import React from 'react';
import CameraManagementCard from '../cameraMangementCard/cameraMangementCard';
import { FaPlus } from 'react-icons/fa';
import Button from '@/app/components/common/button/button';

const CameraManagementSection = () => {
    // Sample data for cameras
    const camerasData = [
        {
            id: 1,
            cameraId: 'CAM-TA-001',
            location: 'Terminal A - North Entrance',
            ip: '192.168.1.101',
            resolution: '1920×1080',
            status: 'Online'
        },
        {
            id: 2,
            cameraId: 'CAM-YD-003',
            location: 'Yard 1 - Container Stack 3',
            ip: '192.168.1.103',
            resolution: '1920×1080',
            status: 'Offline'
        },
        {
            id: 3,
            cameraId: 'CAM-GT-002',
            location: 'Gate Area - Main Checkpoint',
            ip: '192.168.1.102',
            resolution: '1920×1080',
            status: 'Online'
        }
    ];

    const handleAddCamera = () => {
        console.log('Add new camera');
        // Add your add camera logic here
    };

    return (
        <div className="bg-white rounded-lg border p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-headingColor font-bold text-base md:text-lg">Camera Management</h2>
                <Button
                    icon={FaPlus}
                    onClick={handleAddCamera}
                    className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-white bg-green-600 hover:bg-green-700"
                >
                    Add Camera
                </Button>
            </div>

            {/* Cards List */}
            <div className="space-y-3 min-h-[250px] max-h-[350px] overflow-auto">
                {camerasData.map((camera) => (
                    <CameraManagementCard
                        key={camera.id}
                        cameraId={camera.cameraId}
                        location={camera.location}
                        ip={camera.ip}
                        resolution={camera.resolution}
                        status={camera.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default CameraManagementSection;