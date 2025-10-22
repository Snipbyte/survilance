"use client"
import React, { useEffect,useState } from 'react'
import UserRoleManagementMainPage from '../components/userRoleManagement/userRoleManagementMainPage/userRoleManagementMainPage'
import { useRouter } from 'next/navigation';
import LoadingSkeleton from '../components/common/skeletonLoading/skeletonLoading';
import Cookies from 'js-cookie';

const UserRoleManagement = () => {
  
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
       <UserRoleManagementMainPage/> 
    </div>
  )
}

export default UserRoleManagement