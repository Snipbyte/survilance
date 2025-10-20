import React from 'react';
import Input from '../../common/input/input';
import { FaCalendarAlt } from 'react-icons/fa'; 

const ReportSchedulingSection = () => {
    return (
        <div className="p-4 bg-white rounded-lg border my-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Report Scheduling</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select className="w-full p-2 border rounded mb-4 outline-none">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Recipients</label>
                    <Input
                        placeholder="admin@port.com, safety@port.com"
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input type="radio" name="format" value="pdf" defaultChecked className="mr-2" />
                            <span className="text-blue-600">PDF</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="format" value="excel" className="mr-2" />
                            <span className="text-blue-600">Excel</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div className="flex items-center">
                    <input type="checkbox" id="autoScheduling" className="mr-2" />
                    <label htmlFor="autoScheduling" className="text-sm text-gray-700">
                        Enable automatic scheduling
                    </label>
                </div>
                <button className="bg-green-600 hover:bg-green-700 duration-300 text-white px-4 py-2 rounded flex items-center">
                    <FaCalendarAlt className="mr-2" /> Schedule Report
                </button>
            </div>
        </div>
    );
};

export default ReportSchedulingSection;