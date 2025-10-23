"use client";
import React, { useState } from 'react';
import Intro from '../../common/intro/intro';
import StatsSection from '../statsSection/statsSection';
import HeatMapChart from '../../common/heatMapChart/heatMapChart';
import SplineChart from '../../common/splineChart/splineChart';
import StackedColumnChart from '../stackedColumnChart/stackedColumnChart';
import FilterSection from '../filterSecion/filterSecion';
import ViolationZoneSection from '../violationZoneSection/violationZoneSection';
import AiInsightsSection from '../../reporting/aiInsightsSection/aiInsightsSection';
import Breadcrumb from '../../common/breadcrumb/breadcurmb';
import Header from '../../common/header/header';
import DetectionSnapshotsSection from '../detectionSnapshotsSection/detectionSnapshotsSection';

const PpeComplianceMainPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Port Surveillance", href: "#" },
    { label: "PPE Compliance", href: "/PPE-compliance" },
    { label: "Overview", href: "/PPE-compliance" },
  ];

  const [filters, setFilters] = useState({
    dateFrom: "2025-10-01",
    dateTo: "2025-10-23",
    selectedZones: [],
    selectedCameras: [],
    selectedPPEs: [],
  });

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <Header variant="variant2" />
      <Breadcrumb items={breadcrumbItems} />
      <div className='p-3'>
        <Intro
          heading='PPE Compliance Analytics'
          des='Object-based tracking and analysis of Personal Protective Equipment compliance'
          headingClassName='text-xl md:text-2xl lg:text-3xl font-bold'
        />
        <FilterSection onApplyFilters={handleApplyFilters} />
        <StatsSection filters={filters} />
        <div className='md:flex justify-between my-6'>
          <div className='w-full md:w-[49%]'>
            <ViolationZoneSection filters={filters} />
          </div>
          <div className='w-full md:w-[49%]'>
            <AiInsightsSection />
          </div>
        </div>
        <StackedColumnChart filters={filters} />
        {/* <div className='md:flex justify-between my-6'>
          <div className='w-full md:w-[49%]'>
            <HeatMapChart isDashboard={false} filters={filters} />
          </div>
          <div className='w-full md:w-[49%]'>
            <SplineChart isDashboard={false} filters={filters} />
          </div>
        </div> */}
        <DetectionSnapshotsSection />
      </div>
    </div>
  );
};

export default PpeComplianceMainPage;