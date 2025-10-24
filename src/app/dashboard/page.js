// app/dashboard/page.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import DashboardMainPage from '../components/dashboard/dashboardMainPage/dashboardMainPage';
import RealTimeAlert from '../components/common/realTimeAlert/realTimeAlert';
import LoadingSkeleton from '../components/common/skeletonLoading/skeletonLoading';

const Dashboard = () => {
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
      <DashboardMainPage />
      <RealTimeAlert />
    </div>
  );
};

export default Dashboard;