import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  CurrencyPoundIcon, 
  ExclamationTriangleIcon,
  TruckIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { DashboardMetrics } from '@/types';

interface DetailedMetricsProps {
  metrics: DashboardMetrics;
}

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  description?: string;
  category: string;
}

export default function DetailedMetrics({ metrics }: DetailedMetricsProps) {
  const formatCurrency = (amount: number) => {
    return `£${amount.toLocaleString()}`;
  };

  const stats: StatCard[] = [
    // Inventory Metrics
    {
      title: 'Total Inventory Value',
      value: formatCurrency(metrics.totalValue),
      icon: CurrencyPoundIcon,
      color: 'bg-green-500',
      description: 'Total stock value',
      category: 'Inventory'
    },
    {
      title: 'Low Stock Items',
      value: metrics.lowStockItems,
      icon: ExclamationTriangleIcon,
      color: 'bg-orange-500',
      description: 'Need restocking',
      category: 'Inventory'
    },
    {
      title: 'Out of Stock Items',
      value: metrics.outOfStockItems,
      icon: XCircleIcon,
      color: 'bg-red-500',
      description: 'Urgent attention required',
      category: 'Inventory'
    },
    
    // Sales Metrics
    {
      title: 'Monthly Revenue',
      value: formatCurrency(metrics.monthlyRevenue),
      icon: CurrencyPoundIcon,
      color: 'bg-blue-500',
      description: 'This month\'s total',
      category: 'Sales'
    },
    {
      title: 'Yearly Revenue',
      value: formatCurrency(metrics.yearlyRevenue),
      icon: CurrencyPoundIcon,
      color: 'bg-indigo-500',
      description: 'Annual performance',
      category: 'Sales'
    },
    
    // Operations Metrics
    {
      title: 'Shipped Orders',
      value: metrics.shippedOrders,
      icon: TruckIcon,
      color: 'bg-emerald-500',
      description: 'In transit',
      category: 'Operations'
    },
    {
      title: 'Total Active Alerts',
      value: metrics.activeAlerts,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      description: 'All unresolved alerts',
      category: 'Operations'
    }
  ];

  const categories = ['Inventory', 'Sales', 'Operations'];

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryStats = stats.filter(stat => stat.category === category);
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">{category} Metrics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryStats.map((stat, index) => {
                const Icon = stat.icon;
                
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="text-sm font-medium text-gray-700">{stat.title}</h4>
                    </div>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    
                    {stat.description && (
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 