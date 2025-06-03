import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { generateBottleneckData, generatePerformanceMetrics } from '@/lib/data';
import { BottleneckData, PerformanceMetrics, DashboardMetrics } from '@/types';
import DetailedMetrics from './DetailedMetrics';

interface StatisticsPanelProps {
  metrics: DashboardMetrics;
}

export default function StatisticsPanel({ metrics }: StatisticsPanelProps) {
  const [bottlenecks, setBottlenecks] = useState<BottleneckData[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const bottleneckData = generateBottleneckData();
    const performanceData = generatePerformanceMetrics();
    setBottlenecks(bottleneckData);
    setPerformance(performanceData);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPerformanceColor = (value: number, target: number = 95) => {
    if (value >= target) return 'text-green-600';
    if (value >= target * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!performance) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Detailed Metrics - moved from main overview */}
      <DetailedMetrics metrics={metrics} />

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.orderFulfillmentTime, 2)}`}>
              {performance.orderFulfillmentTime}h
            </div>
            <div className="text-sm text-gray-600 mt-1">Order Fulfillment Time</div>
            <div className="text-xs text-gray-500">Target: &lt; 2h</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.inventoryTurnover, 8)}`}>
              {performance.inventoryTurnover}x
            </div>
            <div className="text-sm text-gray-600 mt-1">Inventory Turnover</div>
            <div className="text-xs text-gray-500">Target: &gt; 8x/year</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.stockAccuracy)}`}>
              {performance.stockAccuracy}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Stock Accuracy</div>
            <div className="text-xs text-gray-500">Target: &gt; 95%</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.onTimeDeliveryRate)}`}>
              {performance.onTimeDeliveryRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">On-Time Delivery Rate</div>
            <div className="text-xs text-gray-500">Target: &gt; 95%</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.warehouseUtilization, 85)}`}>
              {performance.warehouseUtilization}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Warehouse Utilization</div>
            <div className="text-xs text-gray-500">Target: 75-90%</div>
          </div>

          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className={`text-2xl font-bold ${getPerformanceColor(performance.pickingEfficiency)}`}>
              {performance.pickingEfficiency}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Picking Efficiency</div>
            <div className="text-xs text-gray-500">Target: &gt; 95%</div>
          </div>
        </div>
      </div>

      {/* Bottleneck Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Bottleneck Analysis</h2>
        
        <div className="space-y-4">
          {bottlenecks.map((bottleneck, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getSeverityColor(bottleneck.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    <h3 className="font-semibold">{bottleneck.area}</h3>
                    <span className={`
                      px-2 py-0.5 text-xs font-medium rounded-full uppercase
                      ${getSeverityColor(bottleneck.severity)}
                    `}>
                      {bottleneck.severity}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">{bottleneck.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Impact:</span> {bottleneck.impact}
                    </div>
                    <div>
                      <span className="font-medium">Suggestion:</span> {bottleneck.suggestion}
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="text-lg font-bold">
                    {bottleneck.metrics.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500">Efficiency</div>
                  
                  <div className="mt-2 text-xs">
                    <div>Current: {bottleneck.metrics.currentThroughput}/hr</div>
                    <div>Target: {bottleneck.metrics.targetThroughput}/hr</div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Throughput</span>
                  <span>{bottleneck.metrics.currentThroughput}/{bottleneck.metrics.targetThroughput}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      bottleneck.metrics.efficiency >= 90 ? 'bg-green-500' :
                      bottleneck.metrics.efficiency >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(bottleneck.metrics.efficiency, 100)}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
              Performing Well
            </h3>
            
            <div className="space-y-2 text-sm">
              {performance.onTimeDeliveryRate >= 95 && (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Excellent on-time delivery performance
                </div>
              )}
              {performance.stockAccuracy >= 95 && (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  High inventory accuracy maintained
                </div>
              )}
              {performance.pickingEfficiency >= 95 && (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Picking operations are highly efficient
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2" />
              Needs Attention
            </h3>
            
            <div className="space-y-2 text-sm">
              {bottlenecks.filter(b => b.severity === 'high').length > 0 && (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  {bottlenecks.filter(b => b.severity === 'high').length} high-priority bottlenecks detected
                </div>
              )}
              {performance.orderFulfillmentTime > 2 && (
                <div className="flex items-center text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Order fulfillment time exceeds target
                </div>
              )}
              {performance.warehouseUtilization > 90 && (
                <div className="flex items-center text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Warehouse utilization near capacity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 