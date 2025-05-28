import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Package, Truck, CheckCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../types';
import { differenceInDays, addDays, format } from 'date-fns';

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();

  // Load orders from localStorage and navigation state
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    let parsedOrders: Order[] = [];
    if (storedOrders) {
      try {
        parsedOrders = JSON.parse(storedOrders);
        if (!Array.isArray(parsedOrders)) {
          console.error('Stored orders is not an array:', parsedOrders);
          parsedOrders = [];
        } else {
          parsedOrders = parsedOrders.map((order: any) => ({
            ...order,
            id: typeof order.id === 'string' ? parseInt(order.id, 10) || Date.now() : order.id,
            status: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)
              ? order.status
              : 'PENDING',
            orderDate: new Date(order.orderDate).toISOString(),
            estimatedDeliveryDate: new Date(order.estimatedDeliveryDate).toISOString(),
          }));
        }
      } catch (error) {
        console.error('Error parsing stored orders:', error);
        parsedOrders = [];
        localStorage.removeItem('orders');
      }
    }

    const newOrder = (location.state as { newOrder?: Order })?.newOrder;
    const combinedOrders = newOrder ? [...parsedOrders, newOrder] : parsedOrders;
    const uniqueOrders = Array.from(
      new Map(combinedOrders.map((order) => [order.id, order])).values()
    );

    setOrders(uniqueOrders);
    setFilteredOrders(uniqueOrders);
  }, [location]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Update order status based on days since order
  useEffect(() => {
    const updateOrderStatus = () => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const orderDate = new Date(order.orderDate);
          if (isNaN(orderDate.getTime())) return order; // Skip invalid dates
          const currentDate = new Date('2025-05-28T12:48:00+05:30');
          const daysSinceOrder = differenceInDays(currentDate, orderDate);

          if (daysSinceOrder >= 4) return { ...order, status: 'DELIVERED' };
          if (daysSinceOrder >= 3) return { ...order, status: 'SHIPPED' };
          if (daysSinceOrder >= 1) return { ...order, status: 'PROCESSING' };
          return { ...order, status: 'PENDING' };
        })
      );
    };

    updateOrderStatus();
    const interval = setInterval(updateOrderStatus, 24 * 60 * 60 * 1000); // Daily
    return () => clearInterval(interval);
  }, []);

  // Filter orders based on tab and search query
  useEffect(() => {
    let filtered = orders;
    if (activeTab !== 'All') {
      filtered = orders.filter((order) => order.status === activeTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          new Date(order.orderDate).toLocaleDateString('en-IN').includes(searchQuery)
      );
    }
    setFilteredOrders(filtered);
  }, [orders, activeTab, searchQuery]);

  // Tab options
  const tabs = [
    { name: 'All', count: orders.length },
    { name: 'PENDING', count: orders.filter((o) => o.status === 'PENDING').length },
    { name: 'PROCESSING', count: orders.filter((o) => o.status === 'PROCESSING').length },
    { name: 'SHIPPED', count: orders.filter((o) => o.status === 'SHIPPED').length },
    { name: 'DELIVERED', count: orders.filter((o) => o.status === 'DELIVERED').length },
  ];

  // Status progress mapping
  const statusProgress = {
    PENDING: { step: 1, icon: Package },
    PROCESSING: { step: 2, icon: Package },
    SHIPPED: { step: 3, icon: Truck },
    DELIVERED: { step: 4, icon: CheckCircle },
  };

  if (filteredOrders.length === 0 && !searchQuery) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No Orders Found</h1>
          <p className="text-gray-600 mb-8 text-lg">
            You haven't placed any orders yet. Start shopping to place an order!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-md font-medium transition-colors shadow-sm"
            aria-label="Continue Shopping"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-800">Your Orders</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Your Orders</h1>

        {/* Search and Tabs */}
        <div className="mb-8">
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search orders by ID or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-md py-2 px-4 pl-10 focus:ring-blue-600 focus:border-blue-600"
              aria-label="Search orders"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex space-x-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`pb-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.name
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab.name)}
                aria-label={`View ${tab.name} orders`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6" role="region" aria-label="Your Orders">
          <AnimatePresence>
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No orders match your search
                </h2>
                <p className="text-gray-600 mb-6">Try adjusting your search or filter to find your orders.</p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-colors"
                  aria-label="Continue Shopping"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </motion.div>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusProgress[order.status].icon;
                return (
                  <motion.div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`flex items-center space-x-2 px-3 py-1 text-sm font-medium rounded-full ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span>{order.status}</span>
                      </span>
                    </div>

                    {/* Status Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => (
                          <div key={step} className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                statusProgress[order.status].step > index
                                  ? 'bg-blue-600'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <span className="mt-1">{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(statusProgress[order.status].step / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-gray-600 mb-2">
                      Ordered on: {format(new Date(order.orderDate), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Estimated Delivery:{' '}
                      {format(new Date(order.estimatedDeliveryDate), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-gray-600 mb-4">
                      Total: ₹{order.total.toLocaleString('en-IN')}
                    </p>
                    <div className="mb-4">
                      <p className="text-gray-600 font-medium">Shipping Address:</p>
                      <p className="text-gray-600">
                        {order.address.fullName}, {order.address.streetAddress}, {order.address.city},{' '}
                        {order.address.state}, {order.address.pincode}
                      </p>
                      <p className="text-gray-600">Phone: {order.address.phone}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 font-medium mb-2">Items:</p>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 mb-4">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <Link
                              to={`/products/${item.product.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-gray-600">
                              Quantity: {item.quantity} @ ₹{item.product.price.toLocaleString('en-IN')} each
                            </p>
                            <p className="text-gray-600 font-medium">
                              Subtotal: ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <Link
                        to={`/track-order/${order.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium text-center transition-colors"
                        aria-label={`Track Order ${order.id}`}
                      >
                        Track Order
                      </Link>
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-medium text-center transition-colors"
                        aria-label={`View Details for Order ${order.id}`}
                      >
                        View Details
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <button
                          className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-md font-medium transition-colors"
                          aria-label={`Return Order ${order.id}`}
                        >
                          Return Item
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;