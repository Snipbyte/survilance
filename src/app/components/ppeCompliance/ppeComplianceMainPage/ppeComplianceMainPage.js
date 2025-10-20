import React from 'react'
import Intro from '../../common/intro/intro'
import StatsSection from '../statsSection/statsSection'
import HeatMapChart from '../../common/heatMapChart/heatMapChart'
import SplineChart from '../../common/splineChart/splineChart'
import StackedColumnChart from '../stackedColumnChart/stackedColumnChart'
import FilterSecion from '../filterSecion/filterSecion'
import ViolationZoneSection from '../violationZoneSection/violationZoneSection'
import ShiftComparisonSection from '../shiftComparisonSection/shiftComparisonSection'
import DetectionSnapshotsSection from '../detectionSnapshotsSection/detectionSnapshotsSection'
import Breadcrumb from '../../common/breadcrumb/breadcurmb'
import Header from '../../common/header/header'

const PpeComplianceMainPage = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/dashboard" },
        { label: "Port Surveillance", href: "#" },
        { label: "PPE Compliance", href: "/PPE-compliance" },
        { label: "Overview", href: "/PPE-compliance" },
    ];

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
                <FilterSecion />
                <StatsSection />
                <div className='md:flex justify-between my-6'>
                    <div className='w-full md:w-[49%]'>
                        <ViolationZoneSection />
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <ShiftComparisonSection />
                    </div>
                </div>
                <StackedColumnChart />
                <div className='md:flex justify-between my-6'>
                    <div className='w-full md:w-[49%]'>
                        <HeatMapChart isDashboard={false} />
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <SplineChart isDashboard={false} />
                    </div>
                </div>
                <DetectionSnapshotsSection />
            </div>
        </div>
    )
}

export default PpeComplianceMainPage