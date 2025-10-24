'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getAlerts } from '../../../../../utils/organization/alert/api';
import { ALERT_TYPE_MAP } from '../../../../../lib/alertTypes';

const RealTimeAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertQueue, setAlertQueue] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const previousAlertId = useRef(null);

  // Function to convert UTC to local time
  const convertToLocalTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Function to get missing PPE items for each person separately
  const getMissingPPE = (alert) => {
    const allPPE = Object.keys(ALERT_TYPE_MAP);
    return Object.entries(alert.alertTypeCounts).map(([personId, types]) => {
      const detectedPPE = Object.keys(types).filter((key) => types[key]);
      const missingPPE = allPPE
        .filter((key) => !detectedPPE.includes(key))
        .map((key) => ALERT_TYPE_MAP[key] || `Unknown (${key})`);
      return {
        personId,
        message: missingPPE.length > 0
          ? `Person ${personId}: Missing ${missingPPE.join(', ')}`
          : `Person ${personId}: All PPE detected`,
        hasMissing: missingPPE.length > 0,
      };
    });
  };

  // Function to fetch alerts
  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await getAlerts('PPE', 1, 10);
      console.log('API response:', JSON.stringify(response, null, 2));
      const latestAlert = response.AlarmHistoryData?.[0];
      console.log('Fetched latest alert:', latestAlert?._id, 'Previous alert:', previousAlertId.current);

      if (!latestAlert) {
        console.log('No latest alert found, skipping display');
        return; // Skip showing any alert
      }

      if (latestAlert._id !== previousAlertId.current) {
        console.log('New alert detected, updating queue');
        previousAlertId.current = latestAlert._id;
        const personAlerts = getMissingPPE(latestAlert);
        setAlertQueue(personAlerts.map((alert) => ({
          ...alert,
          localTime: convertToLocalTime(latestAlert.recordedAt),
          macAddress: latestAlert.macAddress,
          type: 'actual-alert',
        })));
        setAlerts((prev) => {
          const newAlerts = [latestAlert, ...prev].slice(0, 5);
          console.log('Updated alerts:', newAlerts);
          return newAlerts;
        });
      } else {
        console.log('Same alert, skipping display');
        return; // Skip showing any alert
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      if (!currentAlert) {
        setIsExiting(false);
        setCurrentAlert({
          message: 'Error fetching alerts',
          localTime: convertToLocalTime(new Date()),
          macAddress: 'N/A',
          type: 'error',
          hasMissing: false,
        });
        setAlertQueue([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Poll every 10 seconds
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => {
      console.log('Clearing interval');
      clearInterval(interval);
    };
  }, []);

  // Cycle through alert queue
  useEffect(() => {
    if (alertQueue.length > 0 && !currentAlert) {
      console.log('Showing next alert from queue:', alertQueue[0]);
      setIsExiting(false);
      setCurrentAlert(alertQueue[0]);
      setAlertQueue((prev) => prev.slice(1));
    }
  }, [alertQueue, currentAlert]);

  // Auto-dismiss alert after 10 seconds
  useEffect(() => {
    if (currentAlert) {
      console.log('Displaying alert:', currentAlert);
      const timeout = setTimeout(() => {
        console.log('Auto-dismissing alert');
        setIsExiting(true);
        setTimeout(() => {
          setCurrentAlert(null);
          console.log('currentAlert cleared');
        }, 500); // Match exit animation duration
      }, currentAlert.type === 'actual-alert' ? 10000 : 5000); // 10s for actual alerts, 5s for error messages
      return () => clearTimeout(timeout);
    }
  }, [currentAlert]);

  // Don't show anything while loading initial data
  if (isLoading && !currentAlert) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 font-poppins max-w-md">
      {currentAlert && (
        <div
          className={`relative bg-gradient-to-br from-lightCard to-blueColor/5 text-headingColor p-5 rounded-xl shadow-xl w-full border border-blueColor/20 backdrop-blur-md transform transition-all ${isExiting ? 'animate-alert-exit' : 'animate-alert-enter'}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-blueColor/20 rounded-full animate-pulse opacity-50" />
              <svg
                className={`w-7 h-7 ${currentAlert.hasMissing ? 'text-red-500' : 'text-blueColor'} relative`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-headingColor flex items-center">
                  {currentAlert.type === 'actual-alert' ? 'PPE Compliance' : 'System Alert'}
                  {currentAlert.hasMissing && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">
                      URGENT
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    console.log('Close button clicked');
                    setIsExiting(true);
                    setTimeout(() => setCurrentAlert(null), 500);
                  }}
                  className="text-slateColor hover:text-red-500 transition-all duration-200 transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {currentAlert.type === 'actual-alert' && (
                <div className="w-full bg-gray-200/30 rounded-full h-1 mb-2 overflow-hidden">
                  <div
                    className="h-1 bg-gradient-to-r from-blueColor to-red-500 rounded-full animate-shrink"
                  />
                </div>
              )}
              <p
                className={`text-sm font-medium p-2 rounded-lg whitespace-normal break-words ${
                  currentAlert.hasMissing
                    ? 'text-red-600 bg-red-50 border border-red-100'
                    : currentAlert.type === 'error'
                    ? 'text-yellow-600 bg-yellow-50 border border-yellow-100'
                    : 'text-paraColor bg-gray-50 border border-gray-100'
                }`}
              >
                {currentAlert.message}
              </p>
              <div className="mt-2 text-xs text-slateColor space-y-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <p className="flex items-center">
                  <span className="font-medium w-12">Time:</span>
                  <span className="flex-1 font-mono">{currentAlert.localTime}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-12">MAC:</span>
                  <span className="flex-1 font-mono text-blueColor">{currentAlert.macAddress}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blueColor/10 to-red-500/5 blur-xl rounded-xl opacity-70 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default RealTimeAlert;