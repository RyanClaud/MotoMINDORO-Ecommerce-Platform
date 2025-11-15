import { useState, useEffect } from 'react';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-down">
      <div className={`rounded-xl shadow-2xl px-6 py-4 flex items-center space-x-3 ${
        isOnline 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : 'bg-gradient-to-r from-red-500 to-orange-500'
      } text-white`}>
        {isOnline ? (
          <>
            <div className="bg-white/20 p-2 rounded-lg">
              <FaWifi className="text-xl" />
            </div>
            <div>
              <p className="font-bold">Back Online!</p>
              <p className="text-sm text-white/90">Connection restored</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white/20 p-2 rounded-lg">
              <FaExclamationTriangle className="text-xl" />
            </div>
            <div>
              <p className="font-bold">You're Offline</p>
              <p className="text-sm text-white/90">Limited functionality</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
