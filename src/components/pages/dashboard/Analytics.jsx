import React from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaMousePointer, FaBullseye, FaMoneyBillWave, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', views: 4000, clicks: 2400, sales: 2400 },
  { name: 'Feb', views: 3000, clicks: 1398, sales: 2210 },
  { name: 'Mar', views: 2000, clicks: 9800, sales: 2290 },
  { name: 'Apr', views: 2780, clicks: 3908, sales: 2000 },
  { name: 'May', views: 1890, clicks: 4800, sales: 2181 },
  { name: 'Jun', views: 2390, clicks: 3800, sales: 2500 },
  { name: 'Jul', views: 3490, clicks: 4300, sales: 2100 },
];

const Analytics = ({ darkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}
    >
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Views" value="24,000" icon={<FaEye />} color="bg-blue-500" />
        <StatCard title="Total Clicks" value="12,000" icon={<FaMousePointer />} color="bg-green-500" />
        <StatCard title="Conversion Rate" value="2.5%" icon={<FaBullseye />} color="bg-yellow-500" />
      </div>

      {/* Chart */}
      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg mb-8`}>
        <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
            <Line type="monotone" dataKey="sales" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Revenue" value="$12,500" icon={<FaMoneyBillWave />} color="bg-purple-500" />
        <StatCard title="New Users" value="120" icon={<FaUsers />} color="bg-pink-500" />
        <StatCard title="Avg. Session Duration" value="3m 24s" icon={<FaCalendarAlt />} color="bg-indigo-500" />
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} text-white rounded-lg p-4 flex items-center`}>
    <div className="mr-4">
      {React.cloneElement(icon, { className: "text-3xl" })}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Analytics;
