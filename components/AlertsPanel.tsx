import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { generateAlerts } from '@/lib/data';
import { Alert } from '@/types';

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    const alertData = generateAlerts();
    setAlerts(alertData);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.isResolved) return false;
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return ExclamationCircleIcon;
      case 'high': return ExclamationTriangleIcon;
      case 'medium': return ExclamationTriangleIcon;
      case 'low': return ClockIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'low_stock': return ExclamationTriangleIcon;
      case 'out_of_stock': return ExclamationCircleIcon;
      case 'expired': return ExclamationCircleIcon;
      case 'delivery_delay': return ClockIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true } : alert
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical' && !a.isResolved).length,
    high: alerts.filter(a => a.severity === 'high' && !a.isResolved).length,
    medium: alerts.filter(a => a.severity === 'medium' && !a.isResolved).length,
    low: alerts.filter(a => a.severity === 'low' && !a.isResolved).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Alert Center</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Filter by severity */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical ({alertCounts.critical})</option>
              <option value="high">High ({alertCounts.high})</option>
              <option value="medium">Medium ({alertCounts.medium})</option>
              <option value="low">Low ({alertCounts.low})</option>
            </select>
          </div>

          {/* Show resolved toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Show resolved</span>
          </label>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-lg font-bold text-red-600">{alertCounts.critical}</div>
          <div className="text-xs text-red-500">Critical</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-lg font-bold text-orange-600">{alertCounts.high}</div>
          <div className="text-xs text-orange-500">High</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-lg font-bold text-yellow-600">{alertCounts.medium}</div>
          <div className="text-xs text-yellow-500">Medium</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-lg font-bold text-blue-600">{alertCounts.low}</div>
          <div className="text-xs text-blue-500">Low</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert) => {
            const SeverityIcon = getSeverityIcon(alert.severity);
            const TypeIcon = getTypeIcon(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`
                  p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                  ${alert.isResolved ? 'opacity-60' : ''}
                  ${!alert.isRead ? 'border-l-4 border-l-primary-500' : ''}
                  ${getSeverityColor(alert.severity)}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <SeverityIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-semibold">{alert.title}</h3>
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full uppercase
                          ${getSeverityColor(alert.severity)}
                        `}>
                          {alert.severity}
                        </span>
                        {alert.isResolved && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                        {alert.productId && (
                          <span>Product: {alert.productId}</span>
                        )}
                        {alert.orderId && (
                          <span>Order: {alert.orderId}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!alert.isResolved && (
                    <div className="flex space-x-2 flex-shrink-0">
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Resolve alert"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No alerts</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'All systems are running smoothly!' 
                : `No ${filter} priority alerts at this time.`
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 