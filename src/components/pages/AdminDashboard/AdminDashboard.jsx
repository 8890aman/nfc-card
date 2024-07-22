import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { auth, db } from '../../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnimatedBackground from '../../utils/AnimatedBackground';
import StatCards from '../dashboard/StatCards';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activeComponent, setActiveComponent] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'overview':
        return <Overview users={users} />;
      case 'analytics':
        return <Analytics darkMode={darkMode} />;
      case 'settings':
        return <Settings users={users} />;
      default:
        return <Overview users={users} />;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="fixed inset-0 z-0">
        <AnimatedBackground darkMode={darkMode} />
      </div>
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} p-5 pt-8 relative`}
      >
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
        <nav>
          <SidebarItem
            icon={FaUsers}
            text="Overview"
            active={activeComponent === 'overview'}
            onClick={() => setActiveComponent('overview')}
          />
          <SidebarItem
            icon={FaChartBar}
            text="Analytics"
            active={activeComponent === 'analytics'}
            onClick={() => setActiveComponent('analytics')}
          />
          <SidebarItem
            icon={FaCog}
            text="Settings"
            active={activeComponent === 'settings'}
            onClick={() => setActiveComponent('settings')}
          />
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-5 left-5 flex items-center text-red-500 hover:text-red-600"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderComponent()}
        </motion.div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, text, active, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center p-2 rounded-lg cursor-pointer mb-2 ${
      active ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    <Icon className="mr-2" />
    {text}
  </motion.div>
);

const demoOrders = [
  { id: '1', user: 'John Doe', product: 'Premium Template', date: '2023-05-01', status: 'Completed', amount: '$99.99' },
  { id: '2', user: 'Jane Smith', product: 'Basic Template', date: '2023-05-02', status: 'Processing', amount: '$49.99' },
  { id: '3', user: 'Bob Johnson', product: 'Custom Design', date: '2023-05-03', status: 'Pending', amount: '$199.99' },
  { id: '4', user: 'Alice Brown', product: 'Premium Template', date: '2023-05-04', status: 'Completed', amount: '$99.99' },
  { id: '5', user: 'Charlie Wilson', product: 'Basic Template', date: '2023-05-05', status: 'Completed', amount: '$49.99' },
];

const Overview = ({ users }) => (
  <div>
    <h2 className="text-3xl font-bold mb-6">Overview</h2>
    <StatCards />
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Recent Users</h3>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.displayName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt?.toDate()).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold mb-4">Recent Orders</h3>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demoOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const Settings = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await deleteDoc(doc(db, 'users', selectedUser.id));
        setShowConfirmModal(false);
        setSelectedUser(null);
        // Refresh the user list or update the state to reflect the deletion
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.displayName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowConfirmModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the user {selectedUser?.displayName}?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Analytics = ({ darkMode }) => {
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [timeRange, setTimeRange] = useState('6months');

  const data = {
    '6months': [
      { name: 'Jan', revenue: 4000, orders: 240, users: 100 },
      { name: 'Feb', revenue: 3000, orders: 198, users: 120 },
      { name: 'Mar', revenue: 5000, orders: 300, users: 150 },
      { name: 'Apr', revenue: 4500, orders: 270, users: 180 },
      { name: 'May', revenue: 6000, orders: 350, users: 220 },
      { name: 'Jun', revenue: 5500, orders: 320, users: 250 },
    ],
    '1year': [
      { name: 'Jul', revenue: 5800, orders: 340, users: 280 },
      { name: 'Aug', revenue: 6200, orders: 360, users: 310 },
      { name: 'Sep', revenue: 5900, orders: 330, users: 290 },
      { name: 'Oct', revenue: 6500, orders: 380, users: 340 },
      { name: 'Nov', revenue: 7000, orders: 400, users: 370 },
      { name: 'Dec', revenue: 7500, orders: 450, users: 400 },
    ],
  };

  const metrics = [
    { key: 'revenue', label: 'Revenue', color: '#8884d8' },
    { key: 'orders', label: 'Orders', color: '#82ca9d' },
    { key: 'users', label: 'Users', color: '#ffc658' },
  ];

  const timeRanges = [
    { key: '6months', label: '6 Months' },
    { key: '1year', label: '1 Year' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Analytics</h2>
      <div className={`bg-white shadow rounded-lg p-6 ${darkMode ? 'bg-gray-800' : ''}`}>
        <div className="flex justify-between mb-4">
          <div>
            {metrics.map((metric) => (
              <button
                key={metric.key}
                onClick={() => setActiveMetric(metric.key)}
                className={`mr-2 px-4 py-2 rounded ${
                  activeMetric === metric.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
          <div>
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`ml-2 px-4 py-2 rounded ${
                  timeRange === range.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data[timeRange]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey={activeMetric} stroke={metrics.find(metric => metric.key === activeMetric).color} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;