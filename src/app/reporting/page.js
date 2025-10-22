"use client"
import React, { useEffect, useState } from 'react'
import ReportingMainPage from '../components/reporting/reportingMainPage/reportingMainPage'
import { useRouter } from 'next/navigation';
import LoadingSkeleton from '../components/common/skeletonLoading/skeletonLoading';
import Cookies from 'js-cookie';

const Reporting = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const token = Cookies.get('orgUserToken');
      if (!token) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }, [router]);
  
    if (isLoading) {
      return <div><LoadingSkeleton numberOfCards={3} /></div>; 
    }
  

  return (
    <div>
        <ReportingMainPage/>
    </div>
  )
}

export default Reporting