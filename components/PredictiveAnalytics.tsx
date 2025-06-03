import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CpuChipIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
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
import { generatePredictionData } from '@/lib/data';
import { PredictionData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PredictiveAnalytics() {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<PredictionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<'all' | 'increasing' | 'decreasing' | 'stable'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'daysUntilStockOut' | 'confidence' | 'recommendedOrder' | 'predictedDemand'>('daysUntilStockOut');
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<PredictionData | null>(null);

  useEffect(() => {
    const predictionData = generatePredictionData();
    setPredictions(predictionData);
    setFilteredPredictions(predictionData);
  }, []);

  useEffect(() => {
    let filtered = predictions.filter(prediction => {
      const matchesSearch = prediction.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.productId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTrend = selectedTrend === 'all' || prediction.trend === selectedTrend;
      
      const urgencyLevel = getUrgencyLevel(prediction.daysUntilStockOut);
      const matchesUrgency = selectedUrgency === 'all' || urgencyLevel === selectedUrgency;
      
      const confidenceLevel = getConfidenceLevel(prediction.confidence);
      const matchesConfidence = selectedConfidence === 'all' || confidenceLevel === selectedConfidence;
      
      return matchesSearch && matchesTrend && matchesUrgency && matchesConfidence;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'daysUntilStockOut':
          return a.daysUntilStockOut - b.daysUntilStockOut;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'recommendedOrder':
          return b.recommendedOrder - a.recommendedOrder;
        case 'predictedDemand':
          return b.predictedDemand - a.predictedDemand;
        default:
          return 0;
      }
    });

    setFilteredPredictions(filtered);
  }, [predictions, searchTerm, selectedTrend, selectedUrgency, selectedConfidence, sortBy]);

  const getUrgencyLevel = (days: number) => {
    if (days <= 7) return 'critical';
    if (days <= 14) return 'high';
    if (days <= 30) return 'medium';
    return 'low';
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  const getTrendIcon = (trend: PredictionData['trend']) => {
    switch (trend) {
      case 'increasing': return ArrowTrendingUpIcon;
      case 'decreasing': return ArrowTrendingDownIcon;
      default: return ArrowUpIcon;
    }
  };

  const getTrendColor = (trend: PredictionData['trend']) => {
    switch (trend) {
      case 'increasing': return 'text-green-600 bg-green-50';
      case 'decreasing': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-100 border-red-200';
    if (days <= 14) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (days <= 30) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Chart data preparation
  const chartData = {
    urgencyDistribution: {
      labels: ['Critical (≤7 days)', 'High (≤14 days)', 'Medium (≤30 days)', 'Low (>30 days)'],
      datasets: [{
        data: [
          filteredPredictions.filter(p => p.daysUntilStockOut <= 7).length,
          filteredPredictions.filter(p => p.daysUntilStockOut <= 14 && p.daysUntilStockOut > 7).length,
          filteredPredictions.filter(p => p.daysUntilStockOut <= 30 && p.daysUntilStockOut > 14).length,
          filteredPredictions.filter(p => p.daysUntilStockOut > 30).length,
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#EAB308', '#10B981'],
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    demandForecast: {
      labels: filteredPredictions.slice(0, 10).map(p => p.productName.substring(0, 12)),
      datasets: [
        {
          label: 'Current Stock',
          data: filteredPredictions.slice(0, 10).map(p => p.currentStock),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
        {
          label: 'Predicted Demand (30 days)',
          data: filteredPredictions.slice(0, 10).map(p => p.predictedDemand),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        }
      ],
    }
  };

  const urgentItems = filteredPredictions.filter(p => p.daysUntilStockOut <= 30).length;
  const highConfidencePredictions = filteredPredictions.filter(p => p.confidence >= 0.8).length;
  const totalRecommendedValue = filteredPredictions.reduce((sum, p) => sum + (p.recommendedOrder * 50), 0);
  const avgConfidence = filteredPredictions.length > 0 ? filteredPredictions.reduce((sum, p) => sum + p.confidence, 0) / filteredPredictions.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Header with AI Branding */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center space-x-3 mb-3">
          <SparklesIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold">AI-Powered Predictive Analytics</h1>
        </div>
        <p className="text-purple-100">
          Advanced machine learning algorithms analyze your inventory patterns to predict future demand and optimize stock levels.
        </p>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{urgentItems}</div>
              <div className="text-sm text-gray-600">Urgent Items</div>
              <div className="text-xs text-gray-500">Need ordering soon</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{highConfidencePredictions}</div>
              <div className="text-sm text-gray-600">High Confidence</div>
              <div className="text-xs text-gray-500">&gt; 80% accuracy</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">£{totalRecommendedValue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Recommended Investment</div>
              <div className="text-xs text-gray-500">Total order value</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CpuChipIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{(avgConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
              <div className="text-xs text-gray-500">Model accuracy</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Filters and Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Inventory Predictions</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {filteredPredictions.length} items
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Trend Filter */}
            <select
              value={selectedTrend}
              onChange={(e) => setSelectedTrend(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Trends</option>
              <option value="increasing">📈 Increasing</option>
              <option value="decreasing">📉 Decreasing</option>
              <option value="stable">➡️ Stable</option>
            </select>

            {/* Urgency Filter */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Urgency</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            {/* Confidence Filter */}
            <select
              value={selectedConfidence}
              onChange={(e) => setSelectedConfidence(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Confidence</option>
              <option value="high">High (&gt; 80%)</option>
              <option value="medium">Medium (60-80%)</option>
              <option value="low">Low (&lt; 60%)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="daysUntilStockOut">Sort by Urgency</option>
              <option value="confidence">Sort by Confidence</option>
              <option value="recommendedOrder">Sort by Order Size</option>
              <option value="predictedDemand">Sort by Demand</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-2 text-sm ${viewMode === 'chart' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Charts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPredictions.map((prediction, index) => {
                  const TrendIcon = getTrendIcon(prediction.trend);
                  
                  return (
                    <motion.div
                      key={prediction.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-6 rounded-xl border cursor-pointer hover:shadow-lg transition-all duration-200 bg-white ${getUrgencyColor(prediction.daysUntilStockOut)}`}
                      onClick={() => setSelectedProduct(prediction)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">{prediction.productName}</h3>
                        <div className={`p-2 rounded-lg ${getTrendColor(prediction.trend)}`}>
                          <TrendIcon className="h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Days until stockout:</span>
                          <span className={`font-bold ${prediction.daysUntilStockOut <= 14 ? 'text-red-600' : 'text-gray-900'}`}>
                            {prediction.daysUntilStockOut}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Confidence:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getConfidenceColor(prediction.confidence).includes('green') ? 'bg-green-500' : getConfidenceColor(prediction.confidence).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${prediction.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                              {(prediction.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Recommended order:</span>
                          <span className="font-bold text-primary-600">{prediction.recommendedOrder}</span>
                        </div>

                        {prediction.recommendedOrder > 0 && (
                          <button className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                            Generate Purchase Order
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            // Chart View
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Urgency Distribution</h3>
                <div className="chart-container">
                  <Doughnut 
                    data={chartData.urgencyDistribution}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' as const },
                        title: { display: true, text: 'Products by Urgency Level' }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Demand vs Current Stock</h3>
                <div className="chart-container">
                  <Bar 
                    data={chartData.demandForecast}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' as const },
                        title: { display: true, text: 'Top 10 Products - Current vs Predicted' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.productName}</h2>
                  <p className="text-gray-600">Product ID: {selectedProduct.productId}</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Current Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Current Stock:</span>
                        <span className="font-medium text-gray-900">{selectedProduct.currentStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Days Until Stockout:</span>
                        <span className={`font-medium ${selectedProduct.daysUntilStockOut <= 14 ? 'text-red-600' : 'text-gray-900'}`}>
                          {selectedProduct.daysUntilStockOut}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Trend:</span>
                        <span className="font-medium capitalize text-gray-900">{selectedProduct.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">AI Predictions</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Predicted Demand (30d):</span>
                        <span className="font-medium text-gray-900">{selectedProduct.predictedDemand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Confidence Level:</span>
                        <span className={`font-medium ${getConfidenceColor(selectedProduct.confidence)}`}>
                          {(selectedProduct.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Seasonality:</span>
                        <span className="font-medium capitalize text-gray-900">{selectedProduct.seasonality}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Recommended Order:</span>
                        <span className="font-bold text-primary-600">{selectedProduct.recommendedOrder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Estimated Cost:</span>
                        <span className="font-medium text-gray-900">£{(selectedProduct.recommendedOrder * 50).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {selectedProduct.recommendedOrder > 0 && (
                      <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                        Generate Purchase Order
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Risk Assessment</h3>
                    <div className="space-y-1 text-sm">
                      {selectedProduct.daysUntilStockOut <= 7 && (
                        <div className="text-red-600 font-medium">⚠️ Critical: Stock out imminent</div>
                      )}
                      {selectedProduct.confidence < 0.6 && (
                        <div className="text-orange-600 font-medium">⚠️ Low confidence prediction</div>
                      )}
                      {selectedProduct.trend === 'increasing' && (
                        <div className="text-green-600 font-medium">📈 Demand trending up</div>
                      )}
                      {selectedProduct.daysUntilStockOut > 30 && selectedProduct.confidence >= 0.8 && selectedProduct.trend === 'stable' && (
                        <div className="text-blue-600 font-medium">✅ Stable and well-stocked</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredPredictions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
          <CpuChipIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No predictions match your filters</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria to see more results.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedTrend('all');
              setSelectedUrgency('all');
              setSelectedConfidence('all');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </motion.div>
  );
} 