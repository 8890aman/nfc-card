import { FaEye, FaMousePointer, FaBullseye, FaMoneyBillWave, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const StatCard = ({ title, value, period, color, icon }) => (
  <div className={`rounded-xl overflow-hidden ${color} text-white p-4 flex flex-col justify-between h-32`}>
    <div>
      <p className="text-xs opacity-80">{title}</p>
      <p className="text-xs opacity-80">{period}</p>
    </div>
    <div className="flex justify-between items-end">
      <span className="text-3xl font-bold">{value}</span>
      {icon}
    </div>
  </div>
);

const StatCards = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
    <StatCard title="Views" value="0" period="Last 7 days" color="bg-purple-500" icon={<FaEye className="text-3xl opacity-50" />} />
    <StatCard title="Clicks" value="0" period="Last 7 days" color="bg-cyan-400" icon={<FaMousePointer className="text-3xl opacity-50" />} />
    <StatCard title="Sales" value="0" period="Last 7 days" color="bg-orange-500" icon={<FaBullseye className="text-3xl opacity-50" />} />
    <StatCard title="Revenue" value="0" period="Last 7 days" color="bg-yellow-500" icon={<FaMoneyBillWave className="text-3xl opacity-50" />} />
    <StatCard title="Subscribers" value="0" period="Last 7 days" color="bg-pink-500" icon={<FaUsers className="text-3xl opacity-50" />} />
    <StatCard title="Meetings" value="0" period="Last 7 days" color="bg-red-500" icon={<FaCalendarAlt className="text-3xl opacity-50" />} />
  </div>
);

export default StatCards;