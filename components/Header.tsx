import { useState, useEffect } from 'react';
import { BellIcon, CogIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { DashboardMetrics } from '@/types';
import { motion } from 'framer-motion';

type TabType = 'overview' | 'alerts' | 'tracking' | 'statistics' | 'predictive';
type PageType = TabType | 'settings' | 'account';

interface HeaderProps {
  metrics: DashboardMetrics;
  currentPage?: PageType;
  setCurrentPage?: (page: PageType) => void;
}

export default function Header({ metrics, currentPage, setCurrentPage }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSettingsClick = () => {
    if (setCurrentPage) {
      setCurrentPage('settings');
    }
  };

  const handleAccountClick = () => {
    if (setCurrentPage) {
      setCurrentPage('account');
    }
  };

  const handleNotificationsClick = () => {
    if (setCurrentPage) {
      setCurrentPage('alerts');
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Left side - Title and status */}
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Warehouse Management Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>
            
            {/* System Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-success-700">System Online</span>
            </div>
          </div>

          {/* Right side - Quick metrics and actions */}
          <div className="flex items-center space-x-6">
            {/* Quick Metrics */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  £{metrics.todaySales.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Today's Sales</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-danger-600">
                  {metrics.criticalAlerts}
                </div>
                <div className="text-xs text-gray-500">Critical Alerts</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNotificationsClick}
                className={`relative p-2 transition-colors duration-200 ${
                  currentPage === 'alerts' 
                    ? 'text-primary-600 bg-primary-50 rounded-lg' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <BellIcon className="h-6 w-6" />
                {metrics.activeAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {metrics.activeAlerts > 9 ? '9+' : metrics.activeAlerts}
                  </span>
                )}
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSettingsClick}
                className={`p-2 transition-colors duration-200 ${
                  currentPage === 'settings' 
                    ? 'text-primary-600 bg-primary-50 rounded-lg' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <CogIcon className="h-6 w-6" />
              </motion.button>

              {/* User Profile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAccountClick}
                className={`p-2 transition-colors duration-200 ${
                  currentPage === 'account' 
                    ? 'text-primary-600 bg-primary-50 rounded-lg' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <UserCircleIcon className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 