import React from 'react';
import PortZoneCard from '../portZoneCard/portZoneCard';
import { FaWarehouse, FaAnchor, FaPlus } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa6';
import { SiProgate } from 'react-icons/si';
import Button from '@/app/components/common/button/button';

const PortZoneSection = () => {
    // Sample data for port zones
    const portZonesData = [
        {
            id: 1,
            icon: FaBuilding,
            iconBgColor: 'bg-blue-100 text-blue-600',
            title: 'Terminal A',
            camerasActive: 12
        },
        {
            id: 2,
            icon: FaWarehouse,
            iconBgColor: 'bg-green-100 text-green-600',
            title: 'Yard 1',
            camerasActive: 8
        },
        {
            id: 3,
            icon: SiProgate,
            iconBgColor: 'bg-yellow-100 text-yellow-600',
            title: 'Gate Area',
            camerasActive: 6
        },
        {
            id: 4,
            icon: FaAnchor,
            iconBgColor: 'bg-purple-100 text-purple-600',
            title: 'Crane Operations',
            camerasActive: 10
        },
    ];

    const handleEdit = (id) => {
        console.log('Edit zone:', id);
        // Add your edit logic here
    };

    const handleDelete = (id) => {
        console.log('Delete zone:', id);
        // Add your delete logic here
    };

    const handleAddZone = () => {
        console.log('Add new zone');
        // Add your add zone logic here
    };

    return (
        <div className="bg-white rounded-lg border p-3 mb-2 md:mb-0">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-headingColor font-bold text-base md:text-lg">Port Zones</h2>
                <Button
                    icon={FaPlus}
                    onClick={handleAddZone}
                    className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-white"
                >
                    Add Zone
                </Button>
            </div>

            <div className="space-y-3 min-h-[250px] max-h-[350px] overflow-auto">
                {portZonesData.map((zone) => (
                    <PortZoneCard
                        key={zone.id}
                        icon={zone.icon}
                        iconBgColor={zone.iconBgColor}
                        title={zone.title}
                        camerasActive={zone.camerasActive}
                        onEdit={() => handleEdit(zone.id)}
                        onDelete={() => handleDelete(zone.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PortZoneSection;