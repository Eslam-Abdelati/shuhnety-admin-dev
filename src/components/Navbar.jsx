import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, Search, Bell, Moon, Sun, User, LogOut,
  ShieldCheck, Package, MessageSquare, AlertCircle, Clock
} from 'lucide-react';

const Navbar = ({
  toggleSidebar,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Mock Notifications Data
  const notifications = [
    {
      id: 1,
      title: 'طلب توثيق جديد',
      desc: 'سائق جديد (أحمد علي) بانتظار التوثيق',
      time: 'منذ دقيقتين',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-100',
      unread: true
    },
    {
      id: 2,
      title: 'شحنة جديدة',
      desc: 'تمت إضافة شحنة جديدة بمسار (القاهرة - الإسكندرية)',
      time: 'منذ ساعة',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-100',
      unread: true
    },
    {
      id: 3,
      title: 'شكوى جديدة',
      desc: 'لديك رسالة شكوى جديدة بخصوص طلب #4521',
      time: 'منذ 3 ساعات',
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-100',
      unread: false
    },
    {
      id: 4,
      title: 'تنبيه نظام',
      desc: 'سيتم إجراء صيانة دورية للخوادم غداً الساعة 2 صباحاً',
      time: 'منذ 5 ساعات',
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-100',
      unread: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  return (
    <nav className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800 transition-colors border-b dark:border-gray-700">
      <div className="container flex items-center justify-between px-6 mx-auto text-brand-primary dark:text-brand-primary gap-6">

        <div className="flex items-center flex-1 gap-4">
          <button
            className="p-1 rounded-md md:hidden focus:outline-none flex items-center justify-center shrink-0"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-xl focus-within:text-brand-primary">
            <div className="absolute inset-y-0 flex items-center pr-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              className="w-full pr-10 pl-2 text-sm text-gray-700 placeholder-gray-500 bg-gray-100 border-0 rounded-xl dark:placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:outline-none py-2.5 transition-all"
              type="text"
              placeholder="البحث عن شحنات، مستخدمين..."
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 gap-3">
          {/* Dark Mode */}
          <li className="flex items-center">
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center cursor-pointer"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </li>

          {/* Notifications */}
          <li className="relative flex items-center" ref={notificationsRef}>
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center relative cursor-pointer"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 inline-block w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
            </button>
            {isNotificationsOpen && (
              <div className="absolute left-0 top-full w-80 mt-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200">الإشعارات</h3>
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">2 جديد</span>
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.map((n) => (
                    <a
                      key={n.id}
                      href="#"
                      className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b last:border-0 border-gray-50 dark:border-gray-700 ${n.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                        <n.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1 text-right">
                        <p className={`text-sm font-bold ${n.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {n.desc}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {n.time}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <button className="w-full py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-bold text-brand-primary transition-all border-t border-gray-100 dark:border-gray-700">
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </li>

          {/* Profile */}
          <li className="relative flex items-center" ref={profileRef}>
            <button
              className="group rounded-full focus:outline-none border-2 border-transparent hover:border-brand-primary transition-all flex items-center justify-center p-0.5 cursor-pointer"
              onClick={toggleProfile}
            >
              <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-brand-primary/20 transition-all">
                AD
              </div>
            </button>
            {isProfileOpen && (
              <ul className="absolute left-0 top-full w-56 p-2 mt-3 space-y-1 text-gray-600 bg-white border border-gray-100 rounded-2xl shadow-xl dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                <li className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                  <p className="text-xs font-bold text-gray-400">مرحباً</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">أدمن النظام</p>
                </li>
                <li>
                  <a className="inline-flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#">
                    <User className="w-4 h-4 ml-3" />
                    <span>الملف الشخصي</span>
                  </a>
                </li>
                <li>
                  <Link to="/login" className="inline-flex items-center w-full px-4 py-3 text-sm font-semibold rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4 ml-3" />
                    <span>تسجيل الخروج</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
