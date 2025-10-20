import React from 'react'
import Intro from '../../common/intro/intro'
import ReportBuilderSection from '../reportBuilder/reportBuilderSection'
import ComplianceDataTable from '../complianceDataTable/complianceDataTable'
import ReportSchedulingSection from '../reportSchedulingSection/reportSchedulingSection'
import ColumnsChart from '../../dashboard/columnsChart/columnsChart'
import AiInsightsSection from '../aiInsightsSection/aiInsightsSection'
import Breadcrumb from '../../common/breadcrumb/breadcurmb'
import Header from '../../common/header/header'

const ReportingMainPage = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/dashboard" },
        { label: "Port Surveillance", href: "#" },
        { label: "Reporting", href: "/reporting" },
        { label: "PPE", href: "/reporting" },
    ];
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
                <ReportBuilderSection />
                <ComplianceDataTable />
                <div className='md:flex justify-between mt-6'>
                    <div className='w-full md:w-[49%]'>
                        <ColumnsChart isDashboard={false} />
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <AiInsightsSection />
                    </div>
                </div>
                <ReportSchedulingSection />
            </div>
        </div>
    )
}

export default ReportingMainPage