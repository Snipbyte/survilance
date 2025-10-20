import React from 'react'
import { GoDotFill } from 'react-icons/go'

const ViolationZoneSection = () => {
    return (
        <div className="bg-white p-4 rounded-lg borer">
            <h2 className="text-headingColor font-bold text-base mb-2">Top 3 Violation Zones</h2>
            <div className="space-y-2">
                <div className="flex items-center justify-between bg-red-50 p-2 rounded-md">
                    <span className="flex items-center gap-2 text-headingColor font-medium">
                        <GoDotFill className="text-red-500"/>
                        Loading Terminal A
                    </span>
                    <span className="text-red-500 font-medium">423 violations</span>
                </div>
               <div className="flex items-center justify-between bg-orange-50 p-2 rounded-md">
                    <span className="flex items-center gap-2 text-headingColor font-medium">
                        <GoDotFill className="text-orange-500"/>
                        Crane Area 3
                    </span>
                    <span className="text-orange-500 font-medium">387 violations</span>
                </div>
               <div className="flex items-center justify-between bg-yellow-50 p-2 rounded-md">
                    <span className="flex items-center gap-2 text-headingColor font-medium">
                        <GoDotFill className="text-yellow-500"/>
                        Storage Yard B
                    </span>
                    <span className="text-yellow-500 font-medium">298 violations</span>
                </div>
            </div>
        </div>
    )
}

export default ViolationZoneSection