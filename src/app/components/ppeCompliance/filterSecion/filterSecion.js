import React from 'react'

const FilterSection = () => {
    return (
        <div className="bg-white p-4 rounded-lg border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
            <div>
                <label className="text-ellipsis text-sm font-medium">Date Range</label>
                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="xxx to xxx" />
            </div>
            <div>
                <label className="text-ellipsis text-sm font-medium">Zone/Area</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option>All Zones</option>
                </select>
            </div>
            <div>
                <label className="text-ellipsis text-sm font-medium">Shift</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option>All Shifts</option>
                </select>
            </div>
            <div>
                <label className="text-ellipsis text-sm font-medium">Camera</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option>All Cameras</option>
                </select>
            </div>
            <div>
                <label className="text-ellipsis text-sm font-medium">PPE Type</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm">
                    <option>All Types</option>
                </select>
            </div>
            <div>
                <label className="text-ellipsis text-sm font-medium">Options</label>
                <div className="mt-1">
                    <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-1" /> Count Mode
                    </label>
                    <label className="flex items-center text-sm">
                        <input type="checkbox" className="mr-1" /> Exclude Snapshots
                    </label>
                </div>
            </div>
        </div>
    )
}

export default FilterSection