'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  TruckIcon,
  ChartPieIcon,
  CpuChipIcon,
  BellIcon,
  CogIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

import Header from '@/components/Header';
import StatsGrid from '@/components/StatsGrid';
import OverviewSection from '@/components/OverviewSection';
import AlertsPanel from '@/components/AlertsPanel';
import TrackingPanel from '@/components/TrackingPanel';
import StatisticsPanel from '@/components/StatisticsPanel';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import Settings from '@/components/Settings';
import Account from '@/components/Account';
import LoadingSpinner from '@/components/LoadingSpinner';

import { generateDashboardMetrics } from '@/lib/data';
import { DashboardMetrics } from '@/types';

type TabType = 'overview' | 'alerts' | 'tracking' | 'statistics' | 'predictive';
type PageType = TabType | 'settings' | 'account';

interface Tab {
  id: TabType;
  name: string;
  icon: any;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: ChartBarIcon,
    description: 'Key Metrics & Charts'
  },
  {
    id: 'alerts',
    name: 'Alerts',
    icon: ExclamationTriangleIcon,
    description: 'System Notifications'
  },
  {
    id: 'tracking',
    name: 'Tracking',
    icon: TruckIcon,
    description: 'Order Management'
  },
  {
    id: 'statistics',
    name: 'Statistics',
    icon: ChartPieIcon,
    description: 'Detailed Metrics & Analysis'
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    icon: CpuChipIcon,
    description: 'AI Forecasting'
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dashboardMetrics = generateDashboardMetrics();
      setMetrics(dashboardMetrics);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(tab);
  };

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    // If it's a tab page, also update the active tab
    if (tabs.some(t => t.id === page)) {
      setActiveTab(page as TabType);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewSection />;
      case 'alerts':
        return <AlertsPanel />;
      case 'tracking':
        return <TrackingPanel />;
      case 'statistics':
        return metrics ? <StatisticsPanel metrics={metrics} /> : <div>Loading...</div>;
      case 'predictive':
        return <PredictiveAnalytics />;
      case 'settings':
        return <Settings />;
      case 'account':
        return <Account />;
      default:
        return null;
    }
  };

  const shouldShowStatsGrid = () => {
    return !['settings', 'account'].includes(currentPage);
  };

  const shouldShowTabs = () => {
    return !['settings', 'account'].includes(currentPage);
  };

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header metrics={metrics} currentPage={currentPage} setCurrentPage={handlePageChange} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid - Hide for settings and account pages */}
        {shouldShowStatsGrid() && (
          <div className="mb-8">
            <StatsGrid metrics={metrics} />
          </div>
        )}

        {/* Navigation Tabs - Hide for settings and account pages */}
        {shouldShowTabs() && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center text-sm font-medium hover:text-primary-600 focus:z-10 transition-colors duration-200
                        ${isActive 
                          ? 'text-primary-600 border-b-2 border-primary-600' 
                          : 'text-gray-500 hover:text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <span className="hidden sm:inline">{tab.name}</span>
                      </div>
                      <span className="absolute inset-x-0 bottom-0 h-0.5" />
                      
                      {/* Active tab indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {renderCurrentPage()}
        </motion.div>
      </main>
    </div>
  );
} 