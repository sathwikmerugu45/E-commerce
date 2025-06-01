import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package2, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

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
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/all`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    setOrders(data);
    setError(null);
  } catch (err) {
    setError('Failed to load orders. Please try again.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    document.title = 'Admin Dashboard | Eclypse';
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: number) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  if (loading) {
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
              <h1 className="text-2xl font-bold">Orders Dashboard</h1>
            </div>
            <button
              onClick={fetchOrders}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Refresh orders"
            >
              <RefreshCcw size={20} />
            </button>
          </div>

          {error ? (
            <div className="p-6 bg-red-50 text-red-700 rounded-md">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
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
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.items.length} item(s)
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => toggleExpand(order.id)}>
                            {expandedOrderIds.includes(order.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {expandedOrderIds.includes(order.id) && (
                          <motion.tr
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="bg-gray-50"
                          >
                            <td colSpan={7} className="px-6 py-4 text-sm text-gray-700">
                              <div className="mb-4">
                                <strong>Shipping Address:</strong>
                                <div>{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.country} - {order.shippingInfo.postalCode}</div>
                              </div>
                              <div>
                                <strong>Items:</strong>
                                <ul className="mt-2 space-y-2">
                                  {order.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center space-x-4">
                                      {item.image && (
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                      )}
                                      <div>
                                        <div>{item.name}</div>
                                        <div className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
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
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
