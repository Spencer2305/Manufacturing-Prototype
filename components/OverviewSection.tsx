import { motion } from 'framer-motion';
import InventoryOverview from './InventoryOverview';
import SalesAnalytics from './SalesAnalytics';

export default function OverviewSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Warehouse Dashboard</h2>
        <p className="text-blue-100">
          Monitor your inventory, track sales performance, and get AI-powered insights all in one place.
        </p>
      </div>

      {/* Main Analytics */}
      <div className="space-y-6">
        <InventoryOverview />
        <SalesAnalytics />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
            <div className="text-blue-600 font-semibold">Add Inventory</div>
            <div className="text-xs text-gray-500 mt-1">New stock items</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
            <div className="text-green-600 font-semibold">Process Orders</div>
            <div className="text-xs text-gray-500 mt-1">Fulfill pending</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
            <div className="text-orange-600 font-semibold">View Alerts</div>
            <div className="text-xs text-gray-500 mt-1">Check issues</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
            <div className="text-purple-600 font-semibold">Generate Report</div>
            <div className="text-xs text-gray-500 mt-1">Export data</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 