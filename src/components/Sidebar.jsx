import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X, Home, Users, ShieldCheck, Globe,
  FileText, MessageSquare, LayoutGrid, Settings,
  ChevronDown, User, Truck, Building, Package, UserPlus
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
              className="overflow-hidden bg-gray-100/70 dark:bg-gray-900/60 py-2 relative"
            >
              {/* Vertical line indicator */}
              <div className="absolute right-[31px] top-0 bottom-0 w-[1.5px] bg-gray-100 dark:bg-gray-800/50" />

              {subItems.map((sub) => {
                const activeMatch = pathname === sub.to;

                return (
                  <li key={sub.to} className="relative">
                    <Link
                      to={sub.to}
                      onClick={onClick}
                      className={`flex items-center w-full pr-12 pl-4 py-2.5 text-[11px] font-black transition-all duration-200 group relative ${activeMatch
                        ? 'text-brand-primary'
                        : 'text-gray-400 hover:text-brand-primary'
                        }`}
                    >
                      {/* Active indicator dot */}
                      <div className={`absolute right-[28px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full border-2 border-white dark:border-gray-800 transition-all duration-300 z-10 ${activeMatch ? 'bg-brand-primary scale-110' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-brand-primary/50'
                        }`} />

                      <sub.icon className={`w-3.5 h-3.5 ml-3 transition-all duration-300 ${activeMatch ? 'opacity-100 scale-110' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'
                        }`} />
                      <span className="tracking-wide uppercase">{sub.label}</span>


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
    { to: '/dashboard', icon: Home, label: 'لوحة التحكم' },
    {
      icon: Users,
      label: 'إدارة الحسابات',
      to: '/users-group', // Dummy path for parent activation logic
      subItems: [
        { to: '/admins', icon: ShieldCheck, label: 'الموظفين' },
        { to: '/users', icon: User, label: 'المستخدمين' },
        { to: '/verification', icon: Truck, label: 'توثيق السائقين' },
        { to: '/users/add-manager', icon: UserPlus, label: 'إضافة مدير' },
      ]
    },
    { to: '/shipments', icon: Package, label: 'إدارة الشحنات' },
    { to: '/operations', icon: Globe, label: 'إدارة المنصة' },
    { to: '/reports', icon: FileText, label: 'التقارير والإحصائيات' },
    { to: '/disputes', icon: MessageSquare, label: 'النزاعات والشكاوى' },
    { to: '/contracts', icon: LayoutGrid, label: 'العقود الرقمية' },
    { to: '/settings', icon: Settings, label: 'إعدادات النظام' },
  ];

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <Link to="/dashboard" className="mr-6 text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
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
              active={pathname.startsWith(item.to) || (item.subItems && item.subItems.some(sub => pathname === sub.to))}
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
          <Link to="/dashboard" className="text-lg font-bold text-gray-800 dark:text-gray-200">
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
