import React from "react";
import { FaEye, FaExclamationTriangle, FaUserShield, FaShieldAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";

const OverViewSection = ({ stats, loading }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 my-6">
      {/* Total Detections */}
      <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-paraColor text-sm md:text-base">Total Detections</h3>
          <FaEye className="text-blue-500 mr-2 text-lg md:text-xl" />
        </div>
        {loading ? (
          <p className="text-3xl font-bold mb-1">Loading...</p>
        ) : stats ? (
          <>
            <p className="text-3xl font-bold mb-1">{stats.totalDetectionsToday}</p>
            <p className={`text-sm flex items-center ${stats.detectionTrend === "upward" ? "text-green-500" : stats.detectionTrend === "downward" ? "text-red-500" : "text-gray-500"}`}>
              {stats.detectionChangePercentFromYesterday.toFixed(1)}% from yesterday
            </p>
          </>
        ) : (
          <p className="text-3xl font-bold mb-1">0</p>
        )}
      </div>

      {/* Non-Compliant */}
      <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-paraColor text-sm md:text-base">Non-Compliant</h3>
          <FaExclamationTriangle className="text-red-500 mr-2 text-lg md:text-xl" />
        </div>
        {loading ? (
          <p className="text-3xl font-bold mb-1">Loading...</p>
        ) : stats ? (
          <>
            <p className="text-3xl text-red-600 font-bold mb-1">
              {(stats.totalDetectionsToday * stats.avgViolationsPerDetection).toFixed(0)}
            </p>
            <p className="text-gray-500 text-sm">
              {(stats.avgViolationsPerDetection / Object.keys(stats.alertTypes || {}).length * 100).toFixed(1)}% of total
            </p>
          </>
        ) : (
          <p className="text-3xl text-red-600 font-bold mb-1">0</p>
        )}
      </div>

      {/* PPE Types */}
      <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-paraColor text-sm md:text-base">PPE Types</h3>
          <FaUserShield className="text-orange-500 mr-2 text-lg md:text-xl" />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : stats && stats.mostViolatedPPE?.length ? (
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="text-headingColor space-y-1 text-sm md:text-base">
              {stats.mostViolatedPPE.map((ppe, index) => (
                <p key={index}>{ppe}</p>
              ))}
            </div>
            <div className="text-headingColor space-y-1 text-sm md:text-base">
              {stats.mostViolatedPPE.map((ppe, index) => (
                <p key={index}>
                {stats.totalDetectionsToday
  ? ((
      1 - 
      (stats.mostViolatedPPE.length / 
        (stats.totalDetectionsToday * Object.keys(stats.alertTypes || {}).length)
      )
    ) * 100).toFixed(0)
  : 0}%

                </p>
              ))}
            </div>
          </div>
        ) : (
          <p>No PPE data</p>
        )}
      </div>

      {/* Hot Zones */}
      <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-paraColor text-sm md:text-base">Hot Zones</h3>
          <MdLocationPin className="text-red-500 mr-2 text-lg md:text-xl" />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : stats && stats.topViolatingDevices?.length ? (
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="text-headingColor space-y-1 text-sm md:text-base">
              {stats.topViolatingDevices.map((device, index) => (
                <p key={index}>{device.macAddress}</p>
              ))}
            </div>
            <div className="text-red-600 space-y-1 text-sm md:text-base">
              {stats.topViolatingDevices.map((device, index) => (
                <p key={index}>
                  {stats.totalViolations
                    ? ((device.violations / stats.totalViolations) * 100).toFixed(1)
                    : 0}%
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p>No zone data</p>
        )}
      </div>

      {/* Compliance Rate */}
      <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-paraColor text-sm md:text-base">Compliance Rate</h3>
          <FaShieldAlt className="text-green-600 mr-2 text-lg md:text-xl" />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : stats ? (
          <>
            <p className="text-2xl text-green-600 mb-1 font-bold">{stats.complianceRate}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${stats.complianceRate}%` }}></div>
            </div>
          </>
        ) : (
          <p className="text-2xl text-green-600 mb-1 font-bold">0%</p>
        )}
      </div>
    </div>
  );
};

export default OverViewSection;