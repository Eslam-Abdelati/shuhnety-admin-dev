import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-cairo overflow-hidden" dir="rtl">
      {/* Sidebar Component handles its own menu and logic */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
      />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Navbar Component */}
        <Navbar
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Root Content Area */}
        <main className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="grid px-6 mx-auto py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
