import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Loading Warehouse Dashboard</h3>
        <p className="text-gray-600">Fetching real-time data...</p>
      </div>
    </div>
  );
} 