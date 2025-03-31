import React, { useState } from 'react';
import { FaBars } from "react-icons/fa";
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center px-4 z-30 md:hidden">
        <button onClick={toggleSidebar} className="p-2">
          <FaBars className="text-xl" />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="h-full pt-16 md:pt-0">
          <AdminSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6 pt-20 md:pt-6">
          <Outlet />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout; 