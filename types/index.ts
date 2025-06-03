export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  unitCost: number;
  location: string;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

export interface SalesData {
  id: string;
  date: Date;
  amount: number;
  quantity: number;
  productId: string;
  productName: string;
  channel: 'online' | 'retail' | 'wholesale';
  customerType: 'new' | 'returning';
  region: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expired' | 'system' | 'delivery_delay';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  productId?: string;
  orderId?: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
}

export interface PredictionData {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
  daysUntilStockOut: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: 'high' | 'medium' | 'low';
}

export interface BottleneckData {
  area: string;
  type: 'picking' | 'packing' | 'shipping' | 'receiving' | 'storage';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  suggestion: string;
  metrics: {
    currentThroughput: number;
    targetThroughput: number;
    efficiency: number;
  };
}

export interface DashboardMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  todaySales: number;
  yesterdaySales: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
  activeAlerts: number;
  criticalAlerts: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface PerformanceMetrics {
  orderFulfillmentTime: number;
  inventoryTurnover: number;
  stockAccuracy: number;
  onTimeDeliveryRate: number;
  warehouseUtilization: number;
  pickingEfficiency: number;
} 