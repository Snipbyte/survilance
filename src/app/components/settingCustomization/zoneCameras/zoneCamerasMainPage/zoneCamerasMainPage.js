import React from 'react'
import Intro from '@/app/components/common/intro/intro'
import PortZoneSection from '../portZoneSection/portZoneSection'
import CameraMangementSection from '../cameraMangementSection/cameraMangementSection'

const ZoneCamerasMainPage = () => {
    return (
        <div className='p-2'>
            <Intro
                heading='Zones & Cameras Management'
                des='Configure port areas and manage camera assignments'
                headingClassName='text-xl md:text-2xl lg:text-3xl font-bold mb-2'
                paraClassName='mb-4 text-sm md:text-base'
            />
            <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-4 my-4 md:my-6'>
                <div className='w-full md:w-[49%]'>
                   <PortZoneSection/>
                </div>
                <div className='w-full md:w-[49%]'>
                    <CameraMangementSection/>
                </div>
            </div>
        </div>
    )
}

export default ZoneCamerasMainPage