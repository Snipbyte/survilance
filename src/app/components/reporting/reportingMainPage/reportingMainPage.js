"use client";
import React, { useState } from 'react';
import Intro from '../../common/intro/intro';
import ReportBuilderSection from '../reportBuilder/reportBuilderSection';
import ComplianceDataTable from '../complianceDataTable/complianceDataTable';
import PersonComplianceDataTable from '../PersonComplianceDataTable/PersonComplianceDataTable';
import ReportSchedulingSection from '../reportSchedulingSection/reportSchedulingSection';
import ColumnsChart from '../../dashboard/columnsChart/columnsChart';
import AiInsightsSection from '../aiInsightsSection/aiInsightsSection';
import Breadcrumb from '../../common/breadcrumb/breadcurmb';
import Header from '../../common/header/header';

const ReportingMainPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Port Surveillance", href: "#" },
    { label: "Reporting", href: "/reporting" },
    { label: "PPE", href: "/reporting" },
  ];

  const [filters, setFilters] = useState({
    dateFrom: "2025-10-01",
    dateTo: "2025-10-23",
    selectedZones: [],
    selectedCameras: [],
    selectedPPEs: [],
    groupBy: "Zone",
    reportType: "Summary",
    compareMode: "This week vs. Last week",
  });

  const handleGenerateReport = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <Header variant="variant3" />
      <Breadcrumb items={breadcrumbItems} />
      <div className='p-3'>
        <Intro
          heading='PPE Compliance Reporting'
          des='Generate comprehensive PPE compliance reports with advanced filtering and analysis'
          headingClassName='text-xl md:text-2xl lg:text-3xl font-bold'
        />
        <ReportBuilderSection onGenerateReport={handleGenerateReport} />
        <ComplianceDataTable filters={filters} />
        <PersonComplianceDataTable filters={filters} /> {/* Add the new component */}
        <div className='md:flex justify-between mt-6'>
          <div className='w-full md:w-[49%]'>
            <ColumnsChart isDashboard={false} filters={filters} />
          </div>
          <div className='w-full md:w-[49%]'>
            <AiInsightsSection />
          </div>
        </div>
        {/* <ReportSchedulingSection /> */}
      </div>
    </div>
  );
};

export default ReportingMainPage;