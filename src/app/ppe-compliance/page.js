"use client"
import React, { useEffect,useState } from 'react'
import PpeComplianceMainPage from '../components/ppeCompliance/ppeComplianceMainPage/ppeComplianceMainPage'
import LoadingSkeleton from '../components/common/skeletonLoading/skeletonLoading';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const PpeCompliance = () => {

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
        <PpeComplianceMainPage/>
    </div>
  )
}

export default PpeCompliance