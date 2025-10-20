import React from 'react'

const ShiftComparisonSection = () => {
    return (
        <div className="bg-white p-4 rounded-lg border h-full">
            <h2 className="text-headingColor font-bold text-base mb-2">Shift Comparison</h2>
            <div className="flex justify-between">
                <div className="bg-blue-50 p-4 rounded-lg text-center w-1/2 mr-2">
                    <p className="text-2xl font-bold text-blue-600">742</p>
                    <p className="text-sm text-paraColor">Day Shift</p>
                    <p className="text-sm text-blue-600">57.8% of total</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center w-1/2 ml-2">
                    <p className="text-2xl font-bold text-purple-600">542</p>
                    <p className="text-sm text-paraColor">Night Shift</p>
                    <p className="text-sm text-purple-600">42.2% of total</p>
                </div>
            </div>
        </div>
    )
}

export default ShiftComparisonSection