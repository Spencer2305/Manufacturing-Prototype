import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { generateSalesData, generateTimeSeriesData } from '@/lib/data';
import { SalesData, TimeSeriesData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const sales = generateSalesData(30);
    const timeSeries = generateTimeSeriesData(30, 'sales');
    setSalesData(sales);
    setTimeSeriesData(timeSeries);
  }, []);

  // Prepare sales trend data
  const salesTrendData = {
    labels: timeSeriesData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Daily Sales (£)',
        data: timeSeriesData.map(item => item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Prepare channel distribution data
  const channelData = salesData.reduce((acc, sale) => {
    acc[sale.channel] = (acc[sale.channel] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

  const channelChartData = {
    labels: Object.keys(channelData).map(channel => channel.charAt(0).toUpperCase() + channel.slice(1)),
    datasets: [
      {
        data: Object.values(channelData),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Orange
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sales Trend (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '£' + value.toLocaleString();
          },
        },
      },
    },
  };

  const channelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Sales by Channel',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: £${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Calculate summary metrics
  const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const avgOrderValue = salesData.length > 0 ? totalSales / salesData.length : 0;
  const totalOrders = salesData.length;
  const onlineSales = salesData.filter(sale => sale.channel === 'online').reduce((sum, sale) => sum + sale.amount, 0);
  const onlinePercentage = totalSales > 0 ? (onlineSales / totalSales) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sales Analytics</h2>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
          className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">£{totalSales.toLocaleString()}</div>
          <div className="text-xs text-blue-500">Total Sales</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{totalOrders}</div>
          <div className="text-xs text-green-500">Total Orders</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">£{avgOrderValue.toFixed(0)}</div>
          <div className="text-xs text-purple-500">Avg Order Value</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{onlinePercentage.toFixed(1)}%</div>
          <div className="text-xs text-orange-500">Online Sales</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="chart-container">
          <Line data={salesTrendData} options={trendChartOptions} />
        </div>
        <div className="chart-container">
          <Pie data={channelChartData} options={channelChartOptions} />
        </div>
      </div>
    </motion.div>
  );
} 