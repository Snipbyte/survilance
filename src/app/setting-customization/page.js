"use client"
import React, { useEffect,useState } from 'react'
import SettingCustomizationMainPage from '../components/settingCustomization/settingCustomizationMainPage/settingCustomizationMainPage'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import LoadingSkeleton from '../components/common/skeletonLoading/skeletonLoading';

const SettingCustomization = () => {
  
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
        <SettingCustomizationMainPage/>
    </div>
  )
}

export default SettingCustomization