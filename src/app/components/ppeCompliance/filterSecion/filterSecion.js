"use client";
import React, { useState, useEffect } from 'react';
import Input from '../../common/input/input';
import Button from '../../common/button/button';
import { getZones } from '../../../../../utils/organization/zone/api';
import { getCameras } from '../../../../../utils/organization/camera/api';
import { ALERT_TYPE_MAP } from '../../../../../lib/alertTypes';

const FilterSection = ({ onApplyFilters }) => {
  const [zones, setZones] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [selectedPPEs, setSelectedPPEs] = useState([]);
  const [dateFrom, setDateFrom] = useState("2025-10-01");
  const [dateTo, setDateTo] = useState("2025-10-23");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const zonesData = await getZones(1, 100);
        const camerasData = await getCameras(1, 100);
        setZones(zonesData.zonesData || []);
        setCameras(camerasData.devicesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyFiltersClick = () => {
    onApplyFilters({
      dateFrom,
      dateTo,
      selectedZones,
      selectedCameras,
      selectedPPEs,
    });
  };

  const ppeOptions = Object.values(ALERT_TYPE_MAP).filter(type =>
    ["safety-vest", "helmet", "gloves", "glasses"].includes(type)
  );

  return (
    <div className="bg-white p-4 rounded-lg border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
      <div>
        <label className="text-ellipsis text-sm font-medium text-paraColor">Date Range</label>
        <div className="flex items-center gap-2 mt-1">
          <div className="relative w-full">
            <Input
              type="date"
              className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
           
          </div>
          <span className="text-gray-500 text-sm">to</span>
          <div className="relative w-full">
            <Input
              type="date"
              className="border rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
           
          </div>
        </div>
      </div>
      <div>
        <label className="text-ellipsis text-sm font-medium text-paraColor">Zone/Area</label>
        <select
          multiple
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm h-[80px]"
          value={selectedZones.map(z => z._id)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(option =>
              zones.find(z => z._id === option.value)
            );
            setSelectedZones(selected);
          }}
        >
          {zones.map(zone => (
            <option key={zone._id} value={zone._id}>
              {zone.zoneName} ({zone.zoneCode})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-ellipsis text-sm font-medium text-paraColor">Camera</label>
        <select
          multiple
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm h-[80px]"
          value={selectedCameras.map(c => c.deviceMAC)}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(option =>
              cameras.find(c => c.deviceMAC === option.value)
            );
            setSelectedCameras(selected);
          }}
        >
        
          {cameras.map(camera => (
            <option key={camera.deviceMAC} value={camera.deviceMAC}>
              {camera.deviceName} ({camera.deviceMAC})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-ellipsis text-sm font-medium text-paraColor">PPE Type</label>
        <div className="mt-1 flex flex-col gap-2 border rounded-md p-2">
          {ppeOptions.map(ppe => (
            <label key={ppe} className="flex items-center text-sm text-paraColor">
              <input
                type="checkbox"
                className="mr-2 accent-blue-500"
                checked={selectedPPEs.includes(ppe)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPPEs([...selectedPPEs, ppe]);
                  } else {
                    setSelectedPPEs(selectedPPEs.filter(p => p !== ppe));
                  }
                }}
              />
              {ppe.replace("-", " ").toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-end">
        <Button
          className="text-white font-medium text-sm px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 w-full"
          onClick={handleApplyFiltersClick}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;