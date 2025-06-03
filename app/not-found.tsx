import Link from 'next/link';
import { HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Dashboard</h1>
        </div>

        {/* 404 Error */}
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-blue-600 mb-4">404</h2>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h3>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Return to Dashboard
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Need help? Contact your system administrator.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-900 mb-3">Quick Access:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/#inventory"
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Inventory
            </Link>
            <Link
              href="/#sales"
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Sales
            </Link>
            <Link
              href="/#alerts"
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Alerts
            </Link>
            <Link
              href="/#tracking"
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              Tracking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 