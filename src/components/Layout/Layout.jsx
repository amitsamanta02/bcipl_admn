import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import useStore from '../../store/useStore';

const Layout = () => {
  const { sidebarOpen } = useStore();




  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Header (auto-adjusts based on sidebar width) */}
      <Header />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
      >
        <main className="p-6 pt-40 md:pt-20 overflow-y-hidden">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '#e2e8f0',
          },
        }}
      />
    </div>
  );
};

export default Layout;