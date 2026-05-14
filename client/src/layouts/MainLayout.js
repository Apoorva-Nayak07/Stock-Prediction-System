import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBrain,
  FaChartBar,
  FaHeart,
  FaBriefcase,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import useAuthStore from '../store/authStore';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { path: '/predictions', icon: <FaBrain />, label: 'AI Predictions' },
    { path: '/sentiment', icon: <FaChartBar />, label: 'Sentiment' },
    { path: '/portfolio', icon: <FaBriefcase />, label: 'Portfolio' },
    { path: '/watchlist', icon: <FaHeart />, label: 'Watchlist' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-full glass-dark z-40 transition-all duration-300"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <Link to="/dashboard" className="flex items-center space-x-2">
                <FaChartLine className="text-2xl text-blue-500" />
                <span className="text-xl font-bold gradient-text">AI Stock</span>
              </Link>
            ) : (
              <FaChartLine className="text-2xl text-blue-500 mx-auto" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition lg:hidden"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-white/10 pt-4">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} px-4 py-3 rounded-lg bg-white/5`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
            >
              <FaSignOutAlt />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
      >
        {/* Top Bar */}
        <header className="glass-dark sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition hidden lg:block"
            >
              <FaBars className="text-xl" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
