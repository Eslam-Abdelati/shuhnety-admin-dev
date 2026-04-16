import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X, Home, Users, ShieldCheck, Globe,
  FileText, MessageSquare, LayoutGrid, Settings,
  ChevronDown, User, Truck, Building, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, active, onClick, subItems, pathname }) => {
  const [isOpen, setIsOpen] = useState(active || false);

  const hasSubItems = subItems && subItems.length > 0;

  const handleClick = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <Link
        to={hasSubItems ? '#' : to}
        onClick={handleClick}
        className={`relative px-6 py-3 inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-brand-primary dark:hover:text-brand-primary ${active && !hasSubItems
          ? 'text-brand-primary bg-brand-primary/5'
          : 'text-gray-500 dark:text-gray-400'
          }`}
      >
        <div className="flex items-center">
          {active && !hasSubItems && (
            <span
              className="absolute inset-y-0 right-0 w-1 bg-brand-primary rounded-l-lg"
              aria-hidden="true"
            ></span>
          )}
          <Icon className="w-5 h-5 ml-4" />
          <span className="ml-4">{label}</span>
        </div>
        {hasSubItems && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        )}
      </Link>

      {hasSubItems && (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50/50 dark:bg-gray-800/50 shadow-inner"
            >
              {subItems.map((sub) => {
                const isSubActive = pathname === sub.to || (pathname + location.search) === sub.to;
                // Since we use query params, we need to match carefully
                const currentFull = pathname + window.location.search;
                const activeMatch = currentFull === sub.to;

                return (
                  <li key={sub.to}>
                    <Link
                      to={sub.to}
                      onClick={onClick}
                      className={`flex items-center w-full px-12 py-2 text-xs font-bold transition-all duration-150 hover:text-brand-primary ${activeMatch ? 'text-brand-primary' : 'text-gray-400'
                        }`}
                    >
                      <sub.icon className="w-3.5 h-3.5 ml-3 opacity-60" />
                      {sub.label}
                    </Link>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const SidebarContent = ({ pathname, onLinkClick }) => {
  const menuItems = [
    { to: '/admin', icon: Home, label: 'لوحة التحكم' },
    {
      to: '/admin/users',
      icon: Users,
      label: 'إدارة المستخدمين',
      subItems: [
        { to: '/admin/users', icon: Users, label: 'جميع المستخدمين' },
        { to: '/admin/users/customer', icon: User, label: 'العملاء' },
        { to: '/admin/users/driver', icon: Truck, label: 'السائقين' },
        { to: '/admin/users/company', icon: Building, label: 'الشركات' },
      ]
    },
    { to: '/admin/shipments', icon: Package, label: 'إدارة الشحنات' },
    { to: '/admin/verification', icon: ShieldCheck, label: 'توثيق السائقين' },
    { to: '/admin/operations', icon: Globe, label: 'إدارة المنصة' },
    { to: '/admin/reports', icon: FileText, label: 'التقارير والإحصائيات' },
    { to: '/admin/disputes', icon: MessageSquare, label: 'النزاعات والشكاوى' },
    { to: '/admin/contracts', icon: LayoutGrid, label: 'العقود الرقمية' },
    { to: '/admin/settings', icon: Settings, label: 'إعدادات النظام' },
  ];

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <Link to="/admin" className="mr-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">
          SH
        </div>
        شحنتي أدمن
      </Link>
      <ul className="mt-6">
        {menuItems.map((item) => (
          <li className="relative" key={item.to}>
            <SidebarItem
              {...item}
              pathname={pathname}
              active={pathname.startsWith(item.to)}
              onClick={onLinkClick}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 border-l dark:border-gray-700 shadow-sm">
        <SidebarContent pathname={location.pathname} />
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center transition-opacity duration-300"
          onClick={toggle}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-0 overflow-y-auto bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/admin" className="text-lg font-bold text-gray-800 dark:text-gray-200">
            شحنتي
          </Link>
          <button onClick={toggle}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <SidebarContent
          pathname={location.pathname}
          onLinkClick={toggle}
        />
      </aside>
    </>
  );
};

export default Sidebar;
