'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getAlerts } from '../../../../../utils/organization/alert/api';
import { ALERT_TYPE_MAP } from '../../../../../lib/alertTypes';

const RealTimeAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
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

  // Function to get missing PPE items
  const getMissingPPE = (alert) => {
    const allPPE = Object.keys(ALERT_TYPE_MAP);
    const personAlerts = Object.entries(alert.alertTypeCounts).map(([personId, types]) => {
      const detectedPPE = Object.keys(types).filter((key) => types[key]);
      const missingPPE = allPPE
        .filter((key) => !detectedPPE.includes(key))
        .map((key) => ALERT_TYPE_MAP[key] || `Unknown (${key})`);
      return missingPPE.length > 0
        ? `Person ${personId}: Missing ${missingPPE.join(', ')}`
        : `Person ${personId}: All PPE detected`;
    });
    return personAlerts.length > 0 ? personAlerts.join(' | ') : 'No PPE issues detected';
  };

  // Function to fetch alerts
  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await getAlerts('PPE', 1, 10);
      const latestAlert = response.AlarmHistoryData[0];

      console.log('Fetched latest alert:', latestAlert?._id, 'Previous alert:', previousAlertId.current);

      // If no alerts found
      if (!latestAlert) {
        // Only show "No alerts found" if we don't have any previous alerts
        if (previousAlertId.current === null) {
          setNewAlert({
            message: 'No alerts found',
            localTime: convertToLocalTime(new Date()),
            macAddress: 'N/A',
            type: 'no-alerts'
          });
        }
        // Don't update if we already have "no alerts" state
        return;
      }

      // Check if this is a genuinely new alert
      if (latestAlert._id !== previousAlertId.current) {
        console.log('New alert detected, showing notification');
        previousAlertId.current = latestAlert._id;
        
        setIsExiting(false);
        setNewAlert({
          ...latestAlert,
          localTime: convertToLocalTime(latestAlert.recordedAt),
          message: getMissingPPE(latestAlert),
          type: 'actual-alert'
        });
        
        // Update alerts list for history
        setAlerts(prev => [latestAlert, ...prev].slice(0, 5));
      } else {
        console.log('No new alerts, keeping current state');
        // Don't set "No new alerts" message to avoid flickering
        // Only update if we have an actual alert to show
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setIsExiting(false);
      setNewAlert({
        message: 'Error fetching alerts',
        localTime: convertToLocalTime(new Date()),
        macAddress: 'N/A',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Poll every 5 seconds
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []); // Remove alerts dependency to avoid infinite loops

  // Auto-dismiss notification with exit animation
  useEffect(() => {
    if (newAlert && newAlert.type === 'actual-alert') {
      console.log('Auto-dismissing actual alert');
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setNewAlert(null), 500);
      }, 3000);
      return () => clearTimeout(timeout);
    }
    
    // For error or "no alerts" messages, don't auto-dismiss
    // Or dismiss them after a shorter time if desired
    if (newAlert && (newAlert.type === 'error' || newAlert.type === 'no-alerts')) {
      console.log('Auto-dismissing status message');
      const timeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setNewAlert(null), 500);
      }, 3000); // Shorter duration for status messages
      return () => clearTimeout(timeout);
    }
  }, [newAlert]);

  // Don't show anything while loading initial data
  if (isLoading && !newAlert) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 font-poppins">
      {newAlert && (
        <div
          className={`relative bg-gradient-to-br from-lightCard via-white to-blueColor/10 text-headingColor p-6 rounded-2xl shadow-2xl max-w-md w-full border border-blueColor/30 backdrop-blur-md transform transition-all ${isExiting ? 'animate-alert-exit' : 'animate-alert-enter'}`}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-blueColor/20 rounded-full animate-pulse" />
              <svg
                className="w-8 h-8 text-blueColor relative"
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-headingColor flex items-center">
                  {newAlert.type === 'actual-alert' ? 'PPE Compliance Alert' : 
                   newAlert.type === 'error' ? 'System Alert' : 'Alert Status'}
                  {newAlert.message.includes('Missing') && (
                    <span className="ml-2 px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">
                      URGENT
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => setNewAlert(null), 500);
                  }}
                  className="text-slateColor hover:text-red-500 transition-all duration-200 transform hover:scale-110 active:scale-95"
                >
                  <svg
                    className="w-5 h-5"
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
              
              {/* Progress bar only for actual alerts */}
              {newAlert.type === 'actual-alert' && (
                <div className="w-full bg-gray-200/50 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-blueColor to-red-500 rounded-full animate-shrink"
                  />
                </div>
              )}
              
              <p
                className={`text-sm font-medium p-3 rounded-lg ${
                  newAlert.message.includes('Missing')
                    ? 'text-red-600 bg-red-50 border border-red-100'
                    : newAlert.type === 'error'
                    ? 'text-yellow-600 bg-yellow-50 border border-yellow-100'
                    : 'text-paraColor bg-gray-50 border border-gray-100'
                }`}
              >
                {newAlert.message}
              </p>
              <div className="mt-3 text-xs text-slateColor space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="flex items-center">
                  <span className="font-medium w-12">Time:</span>
                  <span className="flex-1 font-mono">{newAlert.localTime}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-12">MAC:</span>
                  <span className="flex-1 font-mono text-blueColor">{newAlert.macAddress}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blueColor/15 to-red-500/10 blur-2xl rounded-2xl opacity-60 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default RealTimeAlert;