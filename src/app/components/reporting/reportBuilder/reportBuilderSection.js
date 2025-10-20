import React from "react";
import { FiCalendar, FiFileText } from "react-icons/fi";
import Button from "../../common/button/button";
import { FaChartBar } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa6";
import Input from "../../common/input/input";

const ReportBuilderSection = () => {
  return (
    <div className="bg-white rounded-lg border p-4 my-6 w-full">
      <h2 className="text-lg font-semibold mb-6">Report Builder</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Date Range</label>
          <div className="flex items-center gap-2">
            <div className="relative w-full">
              <Input
                type="date"
                className="border rounded-md w-full px-3 -mb-0 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue="2024-12-08"
              />
              <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            <span className="text-gray-500 text-sm">to</span>
            <div className="relative w-full">
              <Input
                type="date"
                className="border rounded-md w-full px-3 -mb-0 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue="2024-12-15"
              />
              <FiCalendar className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Zones (Multi-select)</label>
          <select
            multiple
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-[80px]"
          >
            <option>Terminal A</option>
            <option>Terminal B</option>
            <option>Gate Area</option>
            <option>Yard 1</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Shifts</label>
          <div className="flex flex-col gap-2 border rounded-md p-2">
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" defaultChecked className="mr-2 accent-blue-500" /> Day Shift (06:00–18:00)
            </label>
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" defaultChecked className="mr-2 accent-blue-500" /> Night Shift (18:00–06:00)
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Cameras</label>
          <select
            multiple
            className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-[80px]"
          >
            <option>CAM-001 (Terminal A)</option>
            <option>CAM-002 (Terminal B)</option>
            <option>CAM-003 (Gate)</option>
            <option>CAM-004 (Yard 1)</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">PPE Types</label>
          <div className="flex flex-col gap-2 border rounded-md p-2">
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" defaultChecked className="mr-2 accent-blue-500" /> Safety Vest
            </label>
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" defaultChecked className="mr-2 accent-blue-500" /> Helmet
            </label>
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" defaultChecked className="mr-2 accent-blue-500" /> Gloves
            </label>
            <label className="flex items-center text-sm text-paraColor">
              <input type="checkbox" className="mr-2 accent-blue-500" /> Safety Glasses
            </label>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Group By</label>
          <select className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Zone</option>
            <option>Shift</option>
            <option>Camera</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Compare Mode</label>
          <select className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>This week vs. Last week</option>
            <option>This month vs. Last month</option>
            <option>Custom</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-paraColor mb-1">Report Type</label>
          <select className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Summary</option>
            <option>Detailed</option>
          </select>
        </div>

        <div className="flex justify-end w-full md:w-auto">
          <Button className="text-white font-medium text-sm px-5 py-2.5 rounded-md flex items-center gap-2 mt-5 md:mt-0">
            <FaRegChartBar className="mr-2" />Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilderSection;
