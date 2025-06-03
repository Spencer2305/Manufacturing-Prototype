import { 
  InventoryItem, 
  SalesData, 
  Order, 
  Alert, 
  PredictionData, 
  BottleneckData, 
  DashboardMetrics,
  PerformanceMetrics,
  TimeSeriesData
} from '@/types';

// Helper function to generate random dates
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random numbers within range
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Product categories and names for realistic data
const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Health & Beauty', 'Tools'];
const productNames = [
  'Wireless Headphones', 'Smart Watch', 'Laptop Charger', 'USB Cable', 'Phone Case',
  'T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Hat',
  'Garden Hose', 'Plant Pot', 'LED Bulb', 'Cushion', 'Candle',
  'Basketball', 'Yoga Mat', 'Dumbbells', 'Tennis Racket', 'Water Bottle',
  'Programming Book', 'Novel', 'Cookbook', 'Magazine', 'Journal',
  'Car Filter', 'Motor Oil', 'Brake Pads', 'Windshield Wipers', 'Floor Mats',
  'Shampoo', 'Face Cream', 'Toothbrush', 'Vitamins', 'Soap',
  'Screwdriver Set', 'Hammer', 'Drill Bits', 'Wrench Set', 'Measuring Tape'
];

const suppliers = ['Global Supply Co.', 'Premium Parts Ltd.', 'Quick Logistics', 'Reliable Wholesale', 'Express Import'];
const locations = ['A1-01', 'A1-02', 'A2-01', 'A2-02', 'B1-01', 'B1-02', 'B2-01', 'B2-02', 'C1-01', 'C1-02'];
const regions = ['North', 'South', 'East', 'West', 'Central'];

// Generate inventory data
export const generateInventoryData = (count: number = 50): InventoryItem[] => {
  const items: InventoryItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const currentStock = randomBetween(0, 500);
    const minStockLevel = randomBetween(10, 50);
    const maxStockLevel = randomBetween(100, 1000);
    
    let status: InventoryItem['status'] = 'in_stock';
    if (currentStock === 0) status = 'out_of_stock';
    else if (currentStock <= minStockLevel) status = 'low_stock';
    
    const hasExpiry = Math.random() > 0.7;
    const expiryDate = hasExpiry ? getRandomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) : undefined;
    
    if (expiryDate && expiryDate < new Date()) {
      status = 'expired';
    }
    
    items.push({
      id: `INV-${(i + 1).toString().padStart(4, '0')}`,
      name: productNames[i % productNames.length],
      sku: `SKU-${(i + 1).toString().padStart(6, '0')}`,
      category: categories[i % categories.length],
      currentStock,
      minStockLevel,
      maxStockLevel,
      unit: Math.random() > 0.5 ? 'pcs' : 'kg',
      unitCost: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      location: locations[i % locations.length],
      supplier: suppliers[i % suppliers.length],
      lastRestocked: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
      expiryDate,
      status
    });
  }
  
  return items;
};

// Generate sales data
export const generateSalesData = (days: number = 30): SalesData[] => {
  const sales: SalesData[] = [];
  const inventory = generateInventoryData();
  
  for (let day = 0; day < days; day++) {
    const salesPerDay = randomBetween(10, 50);
    const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
    
    for (let sale = 0; sale < salesPerDay; sale++) {
      const product = inventory[randomBetween(0, inventory.length - 1)];
      const quantity = randomBetween(1, 10);
      const amount = parseFloat((product.unitCost * quantity * (1 + Math.random() * 0.5)).toFixed(2));
      
      sales.push({
        id: `SALE-${Date.now()}-${sale}`,
        date,
        amount,
        quantity,
        productId: product.id,
        productName: product.name,
        channel: ['online', 'retail', 'wholesale'][randomBetween(0, 2)] as any,
        customerType: Math.random() > 0.3 ? 'returning' : 'new',
        region: regions[randomBetween(0, regions.length - 1)]
      });
    }
  }
  
  return sales;
};

// Generate order data
export const generateOrderData = (count: number = 100): Order[] => {
  const orders: Order[] = [];
  const inventory = generateInventoryData();
  
  for (let i = 0; i < count; i++) {
    const numItems = randomBetween(1, 5);
    const orderItems = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = inventory[randomBetween(0, inventory.length - 1)];
      const quantity = randomBetween(1, 5);
      const unitPrice = parseFloat((product.unitCost * (1 + Math.random() * 0.5)).toFixed(2));
      const itemTotal = parseFloat((unitPrice * quantity).toFixed(2));
      
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        total: itemTotal
      });
      
      total += itemTotal;
    }
    
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const status = statuses[randomBetween(0, statuses.length - 1)] as any;
    const orderDate = getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
    
    const hasTracking = status === 'shipped' || status === 'delivered';
    const trackingNumber = hasTracking ? `TRK-${(i + 1).toString().padStart(8, '0')}` : undefined;
    
    orders.push({
      id: `ORD-${(i + 1).toString().padStart(6, '0')}`,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      orderDate,
      status,
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      shippingAddress: `${randomBetween(1, 999)} Main St, City ${i + 1}`,
      trackingNumber,
      estimatedDelivery: hasTracking ? getRandomDate(orderDate, new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000)) : undefined,
      actualDelivery: status === 'delivered' ? getRandomDate(orderDate, new Date()) : undefined
    });
  }
  
  return orders;
};

// Generate alert data
export const generateAlerts = (): Alert[] => {
  const alerts: Alert[] = [];
  const inventory = generateInventoryData();
  const orders = generateOrderData();
  
  // Low stock alerts
  inventory.filter(item => item.status === 'low_stock').forEach((item, index) => {
    alerts.push({
      id: `ALERT-LOW-${index + 1}`,
      type: 'low_stock',
      severity: 'medium',
      title: 'Low Stock Alert',
      message: `${item.name} (${item.sku}) is running low. Current stock: ${item.currentStock} ${item.unit}`,
      productId: item.id,
      timestamp: getRandomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
      isRead: Math.random() > 0.3,
      isResolved: false
    });
  });
  
  // Out of stock alerts
  inventory.filter(item => item.status === 'out_of_stock').forEach((item, index) => {
    alerts.push({
      id: `ALERT-OUT-${index + 1}`,
      type: 'out_of_stock',
      severity: 'high',
      title: 'Out of Stock',
      message: `${item.name} (${item.sku}) is completely out of stock`,
      productId: item.id,
      timestamp: getRandomDate(new Date(Date.now() - 12 * 60 * 60 * 1000), new Date()),
      isRead: Math.random() > 0.5,
      isResolved: false
    });
  });
  
  // Expired product alerts
  inventory.filter(item => item.status === 'expired').forEach((item, index) => {
    alerts.push({
      id: `ALERT-EXP-${index + 1}`,
      type: 'expired',
      severity: 'critical',
      title: 'Expired Product',
      message: `${item.name} (${item.sku}) has expired and should be removed from inventory`,
      productId: item.id,
      timestamp: getRandomDate(new Date(Date.now() - 6 * 60 * 60 * 1000), new Date()),
      isRead: false,
      isResolved: false
    });
  });
  
  // Delivery delay alerts
  const delayedOrders = orders.filter(order => 
    order.status === 'shipped' && 
    order.estimatedDelivery && 
    order.estimatedDelivery < new Date()
  ).slice(0, 5);
  
  delayedOrders.forEach((order, index) => {
    alerts.push({
      id: `ALERT-DEL-${index + 1}`,
      type: 'delivery_delay',
      severity: 'medium',
      title: 'Delivery Delay',
      message: `Order ${order.id} is delayed. Expected delivery was ${order.estimatedDelivery?.toLocaleDateString()}`,
      orderId: order.id,
      timestamp: getRandomDate(new Date(Date.now() - 4 * 60 * 60 * 1000), new Date()),
      isRead: Math.random() > 0.4,
      isResolved: false
    });
  });
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate prediction data
export const generatePredictionData = (): PredictionData[] => {
  const inventory = generateInventoryData();
  const predictions: PredictionData[] = [];
  
  inventory.forEach(item => {
    const trend = ['increasing', 'decreasing', 'stable'][randomBetween(0, 2)] as any;
    const seasonality = ['high', 'medium', 'low'][randomBetween(0, 2)] as any;
    const predictedDemand = randomBetween(50, 300);
    const confidence = parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)); // 60-100%
    
    let recommendedOrder = 0;
    let daysUntilStockOut = 999;
    
    if (item.currentStock < predictedDemand) {
      recommendedOrder = predictedDemand - item.currentStock + item.minStockLevel;
      daysUntilStockOut = Math.max(1, Math.floor(item.currentStock / (predictedDemand / 30)));
    }
    
    predictions.push({
      productId: item.id,
      productName: item.name,
      currentStock: item.currentStock,
      predictedDemand,
      recommendedOrder,
      confidence,
      daysUntilStockOut,
      trend,
      seasonality
    });
  });
  
  return predictions.sort((a, b) => a.daysUntilStockOut - b.daysUntilStockOut);
};

// Generate bottleneck data
export const generateBottleneckData = (): BottleneckData[] => {
  return [
    {
      area: 'Picking Zone A',
      type: 'picking',
      severity: 'high',
      description: 'Congestion in main picking aisle during peak hours',
      impact: 'Reduced picking efficiency by 25%',
      suggestion: 'Implement zone picking strategy and add additional picker',
      metrics: {
        currentThroughput: 75,
        targetThroughput: 100,
        efficiency: 75
      }
    },
    {
      area: 'Packing Station 3',
      type: 'packing',
      severity: 'medium',
      description: 'Equipment malfunction causing delays',
      impact: 'Increased packing time by 15 minutes per order',
      suggestion: 'Schedule maintenance and have backup equipment ready',
      metrics: {
        currentThroughput: 85,
        targetThroughput: 100,
        efficiency: 85
      }
    },
    {
      area: 'Loading Dock B',
      type: 'shipping',
      severity: 'low',
      description: 'Truck scheduling conflicts during morning shift',
      impact: 'Minor delays in outbound shipments',
      suggestion: 'Optimize truck scheduling system',
      metrics: {
        currentThroughput: 90,
        targetThroughput: 100,
        efficiency: 90
      }
    },
    {
      area: 'Storage Section C',
      type: 'storage',
      severity: 'medium',
      description: 'Near capacity limit for bulky items',
      impact: 'Difficulty in storing new inventory',
      suggestion: 'Reorganize storage layout and consider vertical solutions',
      metrics: {
        currentThroughput: 88,
        targetThroughput: 100,
        efficiency: 88
      }
    }
  ];
};

// Generate dashboard metrics
export const generateDashboardMetrics = (): DashboardMetrics => {
  const inventory = generateInventoryData();
  const sales = generateSalesData();
  const orders = generateOrderData();
  const alerts = generateAlerts();
  
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  const todaySales = sales
    .filter(sale => sale.date.toDateString() === today.toDateString())
    .reduce((sum, sale) => sum + sale.amount, 0);
  
  const yesterdaySales = sales
    .filter(sale => sale.date.toDateString() === yesterday.toDateString())
    .reduce((sum, sale) => sum + sale.amount, 0);
  
  const monthlyRevenue = sales
    .filter(sale => sale.date.getMonth() === today.getMonth())
    .reduce((sum, sale) => sum + sale.amount, 0);
  
  return {
    totalProducts: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0),
    lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
    outOfStockItems: inventory.filter(item => item.status === 'out_of_stock').length,
    todaySales,
    yesterdaySales,
    monthlyRevenue,
    yearlyRevenue: monthlyRevenue * 12, // Simplified calculation
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    shippedOrders: orders.filter(order => order.status === 'shipped').length,
    activeAlerts: alerts.filter(alert => !alert.isResolved).length,
    criticalAlerts: alerts.filter(alert => alert.severity === 'critical' && !alert.isResolved).length
  };
};

// Generate performance metrics
export const generatePerformanceMetrics = (): PerformanceMetrics => {
  return {
    orderFulfillmentTime: parseFloat((Math.random() * 2 + 1).toFixed(1)), // 1-3 hours
    inventoryTurnover: parseFloat((Math.random() * 4 + 8).toFixed(1)), // 8-12 times per year
    stockAccuracy: parseFloat((Math.random() * 5 + 95).toFixed(1)), // 95-100%
    onTimeDeliveryRate: parseFloat((Math.random() * 10 + 90).toFixed(1)), // 90-100%
    warehouseUtilization: parseFloat((Math.random() * 15 + 75).toFixed(1)), // 75-90%
    pickingEfficiency: parseFloat((Math.random() * 20 + 80).toFixed(1)) // 80-100%
  };
};

// Generate time series data for charts
export const generateTimeSeriesData = (days: number = 30, type: 'sales' | 'orders' | 'stock'): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    let value = 0;
    
    switch (type) {
      case 'sales':
        value = randomBetween(1000, 5000);
        break;
      case 'orders':
        value = randomBetween(20, 80);
        break;
      case 'stock':
        value = randomBetween(85, 98);
        break;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }
  
  return data;
}; 