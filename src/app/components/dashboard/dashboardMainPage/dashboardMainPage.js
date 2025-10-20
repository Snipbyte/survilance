import React from 'react'
import OverViewSection from '../overViewSection/overViewSection'
import Intro from '../../common/intro/intro'
import StatsSection from '../statsSection/statsSection'
import QuickActionSection from '../quickActionSection/quickActionSection'
import ColumnsChart from '../columnsChart/columnsChart'
import SplineChart from '../../common/splineChart/splineChart'
import HeatMapChart from '../../common/heatMapChart/heatMapChart'
import Breadcrumb from '../../common/breadcrumb/breadcurmb'
import Header from '../../common/header/header'

const DashboardMainPage = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/dashboard" },
        { label: "Port Surveillance", href: "#" },
        { label: "Main Dashboard", href: "/dashboard" },
    ];

    return (
        <div>
            <Header variant="variant1" />
            <Breadcrumb items={breadcrumbItems} />
            <div className='p-3'>
                <Intro
                    heading='PPE Compliance Dashboard'
                    des='Real-time monitoring and analytics for Personal Protective Equipment compliance'
                    headingClassName='text-xl md:text-2xl lg:text-3xl font-bold'
                />
                <OverViewSection />
                <StatsSection />
                <div className='md:flex justify-between my-6'>
                    <div className='w-full md:w-[49%]'>
                        <HeatMapChart />
                    </div>
                    <div className='w-full md:w-[49%]'>
                        <SplineChart isDashboard={true} />
                    </div>
                </div>
                <ColumnsChart isDashboard={true} />
                <QuickActionSection />
            </div>
        </div>
    )
}

export default DashboardMainPage