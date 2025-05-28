import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, AlertTriangle } from 'lucide-react';
import { Order } from '../types';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Mock data for development
const mockOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        product: {
          id: '1',
          name: 'Wireless Headphones',
          description: 'High-quality wireless headphones with noise cancellation.',
          price: 99.99,
          imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Electronics',
          stock: 15
        },
        quantity: 1
      },
      {
        product: {
          id: 3,
          name: 'Novel - The Great Journey',
          description: 'A bestselling novel about adventure and discovery.',
          price: 18.95,
          imageUrl: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Books',
          stock: 30
        },
        quantity: 2
      }
    ],
    total: 137.89,
    status: 'PENDING',
    createdAt: '2023-09-15T14:48:00.000Z'
  },
  {
    id: 2,
    userId: 2,
    items: [
      {
        product: {
          id: 2,
          name: 'Casual T-Shirt',
          description: '100% cotton casual t-shirt, perfect for everyday wear.',
          price: 24.99,
          imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Clothing',
          stock: 50
        },
        quantity: 3
      }
    ],
    total: 74.97,
    status: 'SHIPPED',
    createdAt: '2023-09-14T09:23:00.000Z'
  },
  {
    id: 3,
    userId: 3,
    items: [
      {
        product: {
          id: 4,
          name: 'Coffee Maker',
          description: 'Programmable coffee maker with thermal carafe.',
          price: 79.95,
          imageUrl: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Home & Kitchen',
          stock: 10
        },
        quantity: 1
      },
      {
        product: {
          id: 6,
          name: 'Winter Jacket',
          description: 'Warm winter jacket with water-resistant outer shell.',
          price: 149.99,
          imageUrl: 'https://images.pexels.com/photos/8364025/pexels-photo-8364025.jpeg?auto=compress&cs=tinysrgb&w=800',
          category: 'Clothing',
          stock: 20
        },
        quantity: 1
      }
    ],
    total: 229.94,
    status: 'DELIVERED',
    createdAt: '2023-09-10T16:42:00.000Z'
  },
];

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
};

const AdminOrdersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real application, we would fetch from the API
        // const response = await orderAPI.getAllOrders();
        // setOrders(response.data);
        
        // Using mock data for development
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const updateOrderStatus = async (orderId: number, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED') => {
    try {
      // In a real application, we would call the API
      // await orderAPI.updateStatus(orderId, status);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      // Update selected order if it's currently displayed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Manage Orders
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                        User #{order.userId}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-800">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="flex flex-wrap justify-between mb-2">
                <span className="text-gray-600">Customer ID:</span>
                <span className="text-gray-800">User #{selectedOrder.userId}</span>
              </div>
              <div className="flex flex-wrap justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex flex-wrap justify-between mb-2">
                <span className="text-gray-600">Total Items:</span>
                <span className="text-gray-800">
                  {selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex flex-wrap justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-gray-800 font-semibold">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="h-14 w-14 flex-shrink-0 rounded overflow-hidden">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} x ${item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'PENDING')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedOrder.status === 'PENDING' 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-gray-200 text-gray-800 hover:bg-yellow-100'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'PROCESSING')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedOrder.status === 'PROCESSING' 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'SHIPPED')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedOrder.status === 'SHIPPED' 
                      ? 'bg-purple-200 text-purple-800' 
                      : 'bg-gray-200 text-gray-800 hover:bg-purple-100'
                  }`}
                >
                  Shipped
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedOrder.status === 'DELIVERED' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-gray-200 text-gray-800 hover:bg-green-100'
                  }`}
                >
                  Delivered
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;