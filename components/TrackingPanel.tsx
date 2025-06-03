import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { generateOrderData } from '@/lib/data';
import { Order } from '@/types';

export default function TrackingPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');

  useEffect(() => {
    const orderData = generateOrderData(50);
    setOrders(orderData);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'processing': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'shipped': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'processing': return ClockIcon;
      case 'shipped': return TruckIcon;
      case 'delivered': return CheckCircleIcon;
      case 'cancelled': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Order Tracking</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, customers, tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending ({orderCounts.pending})</option>
              <option value="processing">Processing ({orderCounts.processing})</option>
              <option value="shipped">Shipped ({orderCounts.shipped})</option>
              <option value="delivered">Delivered ({orderCounts.delivered})</option>
              <option value="cancelled">Cancelled ({orderCounts.cancelled})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-lg font-bold text-yellow-600">{orderCounts.pending}</div>
          <div className="text-xs text-yellow-500">Pending</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-lg font-bold text-blue-600">{orderCounts.processing}</div>
          <div className="text-xs text-blue-500">Processing</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-lg font-bold text-purple-600">{orderCounts.shipped}</div>
          <div className="text-xs text-purple-500">Shipped</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-lg font-bold text-green-600">{orderCounts.delivered}</div>
          <div className="text-xs text-green-500">Delivered</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-lg font-bold text-red-600">{orderCounts.cancelled}</div>
          <div className="text-xs text-red-500">Cancelled</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{order.id}</h3>
                      <span className={`
                        px-2 py-0.5 text-xs font-medium rounded-full capitalize
                        ${getStatusColor(order.status)}
                      `}>
                        {order.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{order.customerName}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>Items: {order.items.length}</span>
                      <span>Total: £{order.total.toFixed(2)}</span>
                      <span>Order Date: {formatDate(order.orderDate)}</span>
                      {order.trackingNumber && (
                        <span>Tracking: {order.trackingNumber}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end text-xs text-gray-500 space-y-1">
                  {order.estimatedDelivery && (
                    <span>Est. Delivery: {formatDate(order.estimatedDelivery)}</span>
                  )}
                  {order.actualDelivery && (
                    <span>Delivered: {formatDate(order.actualDelivery)}</span>
                  )}
                  {order.status === 'shipped' && order.estimatedDelivery && new Date() > order.estimatedDelivery && (
                    <span className="text-red-500 font-medium">Delivery Delayed</span>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              {order.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Items:</div>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span className="text-gray-700">{item.productName} × {item.quantity}</span>
                        <span className="text-gray-500">£{item.total.toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No orders match "${searchTerm}"` 
                : statusFilter !== 'all'
                  ? `No ${statusFilter} orders at this time.`
                  : 'No orders available.'
              }
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 