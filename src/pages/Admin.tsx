import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, ShoppingCart, Users, BarChart, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data
const mockProducts = [
  { id: '1', name: 'Wireless Headphones', price: 8299, stock: 15, category: 'Electronics', imageUrl: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Casual T-Shirt', price: 2075, stock: 25, category: 'Clothing', imageUrl: 'https://via.placeholder.com/50' },
];
const mockOrders = [
  { id: 1001, status: 'SHIPPED', total: 8299, orderDate: '2025-05-25', items: [{ product: { name: 'Headphones' }, quantity: 1 }], address: { fullName: 'John Doe' } },
  { id: 1002, status: 'PENDING', total: 2075, orderDate: '2025-05-26', items: [{ product: { name: 'T-Shirt' }, quantity: 2 }], address: { fullName: 'Jane Doe' } },
];
const mockUsers = [
  { id: 'u1', username: 'admin', email: 'admin@simpleshop.com', role: 'ADMIN' },
  { id: 'u2', username: 'user', email: 'user@simpleshop.com', role: 'USER' },
];

// Mock analytics data
const analyticsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Sales (₹)',
      data: [120000, 150000, 100000, 180000, 200000],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    },
  ],
};

const AdminPanel: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [users, setUsers] = useState(mockUsers);

  // Protect admin route
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  // Filter data based on search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOrders = orders.filter(o =>
    o.id.toString().includes(searchQuery) ||
    o.address.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock product actions
  const addProduct = () => {
    const newProduct = {
      id: (products.length + 1).toString(),
      name: `New Product ${products.length + 1}`,
      price: 1000,
      stock: 10,
      category: 'General',
      imageUrl: 'https://via.placeholder.com/50',
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Mock order status update
  const updateOrderStatus = (id: number, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  // Mock user role toggle
  const toggleUserRole = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' } : u));
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white shadow-md h-screen fixed"
        initial={{ x: -64 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-gray-200 flex items-center gap-2">
          <img
            src="https://via.placeholder.com/150x50?text=SimpleShop"
            alt="SimpleShop Logo"
            className="h-8"
          />
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          {[
            { name: 'Dashboard', icon: BarChart, section: 'dashboard' },
            { name: 'Products', icon: Package, section: 'products' },
            { name: 'Orders', icon: ShoppingCart, section: 'orders' },
            { name: 'Users', icon: Users, section: 'users' },
          ].map(item => (
            <button
              key={item.section}
              className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                activeSection === item.section ? 'bg-gray-100 text-blue-600' : ''
              }`}
              onClick={() => setActiveSection(item.section)}
              aria-label={`Go to ${item.name}`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
            aria-label="Log Out"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={`Search ${activeSection}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-600 focus:border-blue-600"
                aria-label={`Search ${activeSection}`}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Dashboard */}
          {activeSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
                  <p className="text-2xl font-bold text-blue-600">₹{[750285].toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Orders</h3>
                  <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Products</h3>
                  <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Sales Overview</h3>
                <div className="h-32">
                  <Bar data={analyticsData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Products */}
          {activeSection === 'products' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Products</h3>
                <button
                  onClick={addProduct}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md flex items-center"
                  aria-label="Add Product"
                >
                  <Plus className="h-5 w-5 mr-2" /> Add Product
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">Image</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Price (₹)</th>
                      <th className="py-3 px-4 text-left">Stock</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded" />
                        </td>
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4">{product.price.toLocaleString()}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <button aria-label={`Edit ${product.name}`} className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            aria-label={`Delete ${product.name}`}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Orders */}
          {activeSection === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">Orders</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Customer</th>
                      <th className="py-3 px-4 text-left">Total (₹)</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order.id}</td>
                        <td className="py-3 px-4">{order.address.fullName}</td>
                        <td className="py-3 px-4">{order.total.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">{order.orderDate}</td>
                        <td className="py-3 px-4">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1"
                            aria-label={`Update status for order ${order.id}`}
                          >
                            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            to={`/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`View details for order ${order.id}`}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Users */}
          {activeSection === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium text-gray-700 mb-4">Users</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-gray-700">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">Username</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.username}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.role}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleUserRole(user.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                            aria-label={`Toggle role for ${user.username}`}
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;