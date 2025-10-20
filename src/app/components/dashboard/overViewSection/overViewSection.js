import React from 'react';
import { FaEye, FaExclamationTriangle, FaUserShield, FaShieldAlt } from 'react-icons/fa';
import { MdArrowUpward, MdLocationPin } from 'react-icons/md';

const OverViewSection = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-4 my-6">
            {/* Total Detections */}
            <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-paraColor text-sm md:text-base">Total Detections</h3>
                    <FaEye className="text-blue-500 mr-2 text-lg md:text-xl" />
                </div>
                <p className="text-3xl font-bold mb-1">2,847</p>
                <p className="text-green-500 text-sm flex items-center"><MdArrowUpward />12% from yesterday</p>
            </div>

            {/* Non-Compliant */}
            <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-paraColor text-sm md:text-base">Non-Compliant</h3>
                    <FaExclamationTriangle className="text-red-500 mr-2 text-lg md:text-xl" />
                </div>
                <p className="text-3xl text-red-600 font-bold mb-1">342</p>
                <p className="text-gray-500 text-sm">12.0% of total</p>
            </div>

            {/* PPE Types */}
            <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-paraColor text-sm md:text-base">PPE Types</h3>
                    <FaUserShield className="text-orange-500 mr-2 text-lg md:text-xl" />
                </div>
                <div className='flex items-center justify-between flex-col md:flex-row'>
                    <div className='text-headingColor space-y-1 text-sm md:text-base'>
                        <p>Vest</p>
                        <p>Helmet</p>
                        <p>Gloves</p>
                    </div>
                    <div className='text-headingColor space-y-1 text-sm md:text-base'>
                        <p>88%</p>
                        <p>94%</p>
                        <p>74%</p>
                    </div>
                </div>
            </div>

            {/* Hot Zones */}
            <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-paraColor text-sm md:text-base">Hot Zones</h3>
                    <MdLocationPin className="text-red-500 mr-2 text-lg md:text-xl" />
                </div>
                <div className='flex items-center justify-between flex-col md:flex-row'>
                    <div className='text-headingColor space-y-1 text-sm md:text-base'>
                        <p>Loading Dock A</p>
                        <p>Crane Area 3</p>
                        <p>Storage Bay 7</p>
                    </div>
                    <div className='text-red-600 space-y-1 text-sm md:text-base'>
                        <p>23%</p>
                        <p>18%</p>
                        <p>15%</p>
                    </div>
                </div>
            </div>

            {/* Compliance Rate */}
            <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-paraColor text-sm md:text-base">Compliance Rate</h3>
                    <FaShieldAlt className="text-green-600 mr-2 text-lg md:text-xl" />
                </div>
                <p className="text-2xl text-green-600 mb-1 font-bold">88.0%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default OverViewSection;