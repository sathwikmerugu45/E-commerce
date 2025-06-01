import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, RefreshCcw, ChevronDown, ChevronUp, BarChart2, DollarSign, ShoppingBag, Clock } from 'lucide-react';

interface Order {
  id: number;
  userId: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone?: string;
  };
  items: Array<{
    id: number;
    productId: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

const LOCAL_STORAGE_KEY = 'ecommerce_orders';

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'stats'>('orders');

  const loadOrdersFromLocalStorage = (): Order[] => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (err) {
      console.error('Error loading orders from localStorage:', err);
      return [];
    }
  };

  const saveOrdersToLocalStorage = (orders: Order[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Error saving orders to localStorage:', err);
    }
  };

  const fetchOrders = () => {
    setLoading(true);
    try {
      const loadedOrders = loadOrdersFromLocalStorage();
      setOrders(loadedOrders);
      setError(null);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders: Order[]): Stats => {
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalRevenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0)
    };
  };

  const fetchStats = () => {
    const loadedOrders = loadOrdersFromLocalStorage();
    setStats(calculateStats(loadedOrders));
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    try {
      const loadedOrders = loadOrdersFromLocalStorage();
      const updatedOrders = loadedOrders.map((order: Order) => 
        order.id === orderId ? {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        } : order
      );
      
      saveOrdersToLocalStorage(updatedOrders);
      setOrders(updatedOrders);
      setStats(calculateStats(updatedOrders));
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = 'Admin Dashboard | Eclypse';
    fetchOrders();
    fetchStats();
  }, []);

  const toggleExpand = (orderId: number) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && activeTab === 'orders') {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin text-primary">
              <RefreshCcw size={32} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Package2 size={24} className="text-primary mr-2" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setActiveTab('orders');
                  fetchOrders();
                }}
                className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                Orders
              </button>
              <button
                onClick={() => {
                  setActiveTab('stats');
                  fetchStats();
                }}
                className={`px-4 py-2 rounded-md ${activeTab === 'stats' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                Statistics
              </button>
              <button
                onClick={activeTab === 'orders' ? fetchOrders : fetchStats}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Refresh"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md mx-6 mt-4">
              {error}
            </div>
          )}

          {activeTab === 'stats' ? (
            <div className="p-6">
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <ShoppingBag className="text-blue-500 mr-2" />
                      <h3 className="text-gray-500">Total Orders</h3>
                    </div>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <Clock className="text-yellow-500 mr-2" />
                      <h3 className="text-gray-500">Pending Orders</h3>
                    </div>
                    <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <BarChart2 className="text-green-500 mr-2" />
                      <h3 className="text-gray-500">Completed Orders</h3>
                    </div>
                    <p className="text-3xl font-bold mt-2">{stats.completedOrders}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center">
                      <DollarSign className="text-purple-500 mr-2" />
                      <h3 className="text-gray-500">Total Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold mt-2">
                      ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin text-primary">
                    <RefreshCcw size={32} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {orders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                              <div className="text-xs text-gray-400">{order.shippingInfo.email}</div>
                              {order.shippingInfo.phone && (
                                <div className="text-xs text-gray-400">{order.shippingInfo.phone}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.items.length} item(s)
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`px-2 py-1 text-xs font-semibold rounded-md ${getStatusColor(order.status)}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                              <div className="text-xs text-gray-400">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => toggleExpand(order.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {expandedOrderIds.includes(order.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </td>
                          </tr>

                          <AnimatePresence>
                            {expandedOrderIds.includes(order.id) && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-50"
                              >
                                <td colSpan={7} className="px-6 py-4 text-sm text-gray-700">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="font-medium mb-2">Shipping Information</h3>
                                      <div className="bg-white p-4 rounded-md shadow-sm">
                                        <p>
                                          <span className="font-medium">Name:</span> {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                        </p>
                                        <p>
                                          <span className="font-medium">Email:</span> {order.shippingInfo.email}
                                        </p>
                                        {order.shippingInfo.phone && (
                                          <p>
                                            <span className="font-medium">Phone:</span> {order.shippingInfo.phone}
                                          </p>
                                        )}
                                        <p>
                                          <span className="font-medium">Address:</span> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.country} {order.shippingInfo.postalCode}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-medium mb-2">Order Items</h3>
                                      <div className="bg-white p-4 rounded-md shadow-sm">
                                        <ul className="space-y-3">
                                          {order.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start space-x-4">
                                              {item.image && (
                                                <img 
                                                  src={item.image} 
                                                  alt={item.name} 
                                                  className="w-16 h-16 object-cover rounded border border-gray-200"
                                                />
                                              )}
                                              <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                  ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500">Product ID: {item.productId}</p>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                          <p className="text-right font-medium">
                                            Subtotal: ${order.totalAmount.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;