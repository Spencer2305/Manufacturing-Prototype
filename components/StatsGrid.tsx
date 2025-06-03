import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  CurrencyPoundIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  TruckIcon,
  ShoppingCartIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { DashboardMetrics } from '@/types';

interface StatsGridProps {
  metrics: DashboardMetrics;
}

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: any;
  color: string;
  description?: string;
}

export default function StatsGrid({ metrics }: StatsGridProps) {
  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString()}`;
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return '0%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const salesChange = calculateChange(metrics.todaySales, metrics.yesterdaySales);
  const salesChangeType = metrics.todaySales > metrics.yesterdaySales ? 'positive' : 
                         metrics.todaySales < metrics.yesterdaySales ? 'negative' : 'neutral';

  // Simplified stats - only the most essential metrics
  const stats: StatCard[] = [
    {
      title: 'Today\'s Revenue',
      value: formatCurrency(metrics.todaySales),
      change: salesChange,
      changeType: salesChangeType,
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      description: 'Daily sales performance'
    },
    {
      title: 'Total Inventory',
      value: metrics.totalProducts.toLocaleString(),
      icon: CubeIcon,
      color: 'bg-green-500',
      description: 'Items in stock'
    },
    {
      title: 'Critical Alerts',
      value: metrics.criticalAlerts,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      description: 'Require immediate attention'
    },
    {
      title: 'Pending Orders',
      value: metrics.pendingOrders,
      icon: ClockIcon,
      color: 'bg-orange-500',
      description: 'Awaiting processing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                </div>
                
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <span className={`
                      text-sm font-medium px-2 py-1 rounded-full
                      ${stat.changeType === 'positive' ? 'text-success-700 bg-success-100' : 
                        stat.changeType === 'negative' ? 'text-danger-700 bg-danger-100' : 
                        'text-gray-700 bg-gray-100'}
                    `}>
                      {stat.change}
                    </span>
                  )}
                </div>
                
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 