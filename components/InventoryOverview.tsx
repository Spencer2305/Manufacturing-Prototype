import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { generateInventoryData } from '@/lib/data';
import { InventoryItem } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function InventoryOverview() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedView, setSelectedView] = useState<'stock' | 'categories'>('stock');

  useEffect(() => {
    const data = generateInventoryData(50);
    setInventory(data);
  }, []);

  // Prepare stock levels data
  const stockLevelsData = {
    labels: inventory.slice(0, 10).map(item => item.name.substring(0, 12)),
    datasets: [
      {
        label: 'Current Stock',
        data: inventory.slice(0, 10).map(item => item.currentStock),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Min Stock Level',
        data: inventory.slice(0, 10).map(item => item.minStockLevel),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Prepare category distribution data
  const categoryData = inventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
          '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const stockChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Levels vs Minimum Thresholds',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Inventory by Category',
      },
    },
  };

  // Calculate summary stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
  const inStockItems = inventory.filter(item => item.status === 'in_stock').length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Inventory Overview</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('stock')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'stock'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Stock Levels
          </button>
          <button
            onClick={() => setSelectedView('categories')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'categories'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{totalItems}</div>
          <div className="text-xs text-blue-500">Total Items</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{inStockItems}</div>
          <div className="text-xs text-green-500">In Stock</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{lowStockItems}</div>
          <div className="text-xs text-orange-500">Low Stock</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{outOfStockItems}</div>
          <div className="text-xs text-red-500">Out of Stock</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        {selectedView === 'stock' ? (
          <Bar data={stockLevelsData} options={stockChartOptions} />
        ) : (
          <Doughnut data={categoryChartData} options={categoryChartOptions} />
        )}
      </div>
    </motion.div>
  );
} 