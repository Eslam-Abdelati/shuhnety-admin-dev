import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, Bell, Moon, Sun, User, LogOut, 
  Home, Users, ShieldCheck, Settings, FileText, 
  MessageSquare, LayoutGrid, Globe 
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`relative px-6 py-3 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
      active 
        ? 'text-gray-800 dark:text-gray-100' 
        : 'text-gray-500 dark:text-gray-400'
    }`}
  >
    {active && (
      <span
        className="absolute inset-y-0 right-0 w-1 bg-brand-primary rounded-l-lg"
        aria-hidden="true"
      ></span>
    )}
    <Icon className="w-5 h-5 ml-4" />
    <span className="ml-4">{label}</span>
  </Link>
);

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Dark Mode Toggle Logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { to: '/admin', icon: Home, label: 'لوحة التحكم' },
    { to: '/admin/users', icon: Users, label: 'المستخدمين' },
    { to: '/admin/verification', icon: ShieldCheck, label: 'توثيق السائقين' },
    { to: '/admin/operations', icon: Globe, label: 'إدارة المنصة' },
    { to: '/admin/reports', icon: FileText, label: 'التقارير والإحصائيات' },
    { to: '/admin/disputes', icon: MessageSquare, label: 'النزاعات والشكاوى' },
    { to: '/admin/contracts', icon: LayoutGrid, label: 'العقود الرقمية' },
    { to: '/admin/settings', icon: Settings, label: 'إعدادات النظام' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-cairo" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 border-l dark:border-gray-700">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link to="/admin" className="mr-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
              SH
            </div>
            شحنتي أدمن
          </Link>
          <ul className="mt-6">
            {menuItems.map((item) => (
              <li className="relative px-0 py-0" key={item.to}>
                <SidebarItem 
                  {...item} 
                  active={location.pathname === item.to} 
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar Back-drop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-0 overflow-y-auto bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400 font-cairo">
          <div className="flex items-center justify-between px-6 mb-6">
            <Link to="/admin" className="text-lg font-bold text-gray-800 dark:text-gray-200">
              شحنتي
            </Link>
            <button onClick={toggleSidebar}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul>
            {menuItems.map((item) => (
              <li className="relative px-0 py-0" key={item.to}>
                <SidebarItem 
                  {...item} 
                  active={location.pathname === item.to}
                  onClick={toggleSidebar}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-brand-primary dark:text-brand-primary">
            {/* Mobile hamburger */}
            <button
              className="p-1 -mr-1 ml-5 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
              onClick={toggleSidebar}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search input */}
            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl ml-5 focus-within:text-brand-primary">
                <div className="absolute inset-y-0 flex items-center pr-2">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  className="w-full pr-8 pl-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-brand-primary focus:outline-none focus:shadow-outline-purple form-input py-2 transition-all"
                  type="text"
                  placeholder="البحث عن شحنات، مستخدمين..."
                  aria-label="Search"
                />
              </div>
            </div>

            <ul className="flex items-center flex-shrink-0 space-x-6 space-x-reverse">
              {/* Theme toggler */}
              <li className="flex">
                <button
                  className="rounded-md focus:outline-none focus:shadow-outline-purple"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  aria-label="Toggle color mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </li>

              {/* Notifications menu */}
              <li className="relative">
                <button
                  className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Notifications"
                  aria-haspopup="true"
                >
                  <Bell className="w-5 h-5" />
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                  ></span>
                </button>
                {isNotificationsOpen && (
                  <ul className="absolute left-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700">
                    <li className="flex">
                      <a className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                        <span>طلبات توثيق جديدة</span>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">13</span>
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              {/* Profile menu */}
              <li className="relative">
                <button
                  className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Account"
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                    AD
                  </div>
                </button>
                {isProfileOpen && (
                  <ul className="absolute left-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700">
                    <li className="flex">
                      <a className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200" href="#">
                        <User className="w-4 h-4 ml-3" />
                        <span>الملف الشخصي</span>
                      </a>
                    </li>
                    <li className="flex">
                      <Link to="/login" className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <LogOut className="w-4 h-4 ml-3" />
                        <span>تسجيل الخروج</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="h-full overflow-y-auto">
          <div className="container grid px-6 mx-auto">
            {/* Header section in content */}
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
               مرحباً بك في لوحة تحكم شحنتي
            </h2>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

