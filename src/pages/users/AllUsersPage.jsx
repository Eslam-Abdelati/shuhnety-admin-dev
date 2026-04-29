import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Eye, Edit, Trash2,
  Download, Users, Truck, ShoppingCart, Building,
  MapPin, ShieldCheck, Phone, Clock, Filter as FilterIcon,
  ChevronRight, ChevronLeft, User
} from 'lucide-react';
import { Button, MenuItem, IconButton, CircularProgress, Select, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const AllUsersPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Unified Fetch Function with POST Body Filters
  const loadUsersData = async (filters = {}) => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUsers(filters);

      // Response is an array of users
      const usersList = response?.data || response || [];
      setData(usersList);

    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المستخدمين');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to trigger fetching when filters change
  useEffect(() => {
    const filtersBody = {};
    if (roleFilter !== 'all') filtersBody.userRole = roleFilter;
    if (searchTerm) filtersBody.full_name = searchTerm;

    const delayDebounceFn = setTimeout(() => {
      loadUsersData(filtersBody);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(delayDebounceFn);
  }, [roleFilter, searchTerm]);

  // Calculate Stats
  const stats = useMemo(() => {
    return {
      total: data.length,
      drivers: data.filter(u => u.role === 'driver').length,
      customers: data.filter(u => u.role === 'client' || u.role === 'customer').length,
      admins: data.filter(u => u.role === 'admin').length,
    };
  }, [data]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };

  const roleMap = {
    'client': { label: 'عميل', icon: ShoppingCart, color: 'text-orange-500 bg-orange-50' },
    'driver': { label: 'كابتن', icon: Truck, color: 'text-emerald-500 bg-emerald-50' },
    'admin': { label: 'مدير', icon: ShieldCheck, color: 'text-purple-500 bg-purple-50' }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">إدارة المستخدمين</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">نظرة شاملة وتحكم كامل في كافة حسابات المنصة</p>
        </div>
        <Button className="!rounded-xl !px-8 !py-3 !bg-brand-primary !text-white !font-black hover:!opacity-90 shadow-lg shadow-brand-primary/20 transition-all text-sm">
          إضافة مستخدم جديد
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard index={0} icon={Users} label="إجمالي المستخدمين" value={stats.total} color="brand" variants={cardVariants} />
        <StatCard index={1} icon={Truck} label="السائقين" value={stats.drivers} color="emerald" variants={cardVariants} />
        <StatCard index={2} icon={ShoppingCart} label="العملاء" value={stats.customers} color="orange" variants={cardVariants} />
      </div>

      {/* Simplified Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/20">
          <div className="relative group w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن مستخدم بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
              size="small"
              className="!rounded-xl !bg-white dark:!bg-gray-900 !text-xs !font-bold !min-w-[160px] !border-gray-200"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
              }}
            >
              <MenuItem value="all" className="!font-bold !text-xs">كافة المستخدمين</MenuItem>
              <MenuItem value="client" className="!font-bold !text-xs">العملاء</MenuItem>
              <MenuItem value="driver" className="!font-bold !text-xs">السائقين</MenuItem>
              <MenuItem value="admin" className="!font-bold !text-xs">المديرين</MenuItem>
            </Select>

            <Button 
              size="small" 
              className="!text-gray-600 !font-bold !bg-white dark:!bg-gray-900 !border !border-slate-100 dark:!border-gray-700 !rounded-xl !px-5 !py-2 shadow-sm hover:!bg-gray-50 !text-xs"
              startIcon={<Download className="w-3.5 h-3.5 ml-1" />}
            >
              تصدير
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto scrollbar-none lg:overflow-visible">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">المستخدم</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">النوع</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">رقم الهاتف</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">الحالة</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">تاريخ التسجيل</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">العمليات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-24 text-center">
                    <CircularProgress size={40} className="!text-brand-primary" />
                    <p className="text-sm text-gray-400 font-bold mt-4">جاري تحميل المستخدمين...</p>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((u) => {
                  const role = roleMap[u.role] || { label: u.role, icon: User, color: 'text-gray-500 bg-gray-50' };
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{u.full_name}</p>
                            <p className="text-[11px] text-gray-400 font-medium mt-1">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black ${role.color}`}>
                          {role.label}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500">
                          <span dir="ltr">{u.phone_number}</span>
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {u.isActive ? 'موثق' : 'موقوف'}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${u.isActive ? 'text-blue-600' : 'text-amber-600'}`}>
                          <ShieldCheck className={`w-4.5 h-4.5 ${u.isActive ? 'fill-blue-50' : ''}`} />
                          {u.isActive ? 'موثق' : 'قيد المراجعة'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-bold">
                        <div className="flex items-center gap-1.5">
                          {u.createDateTime ? new Date(u.createDateTime).toLocaleDateString('ar-EG') : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-1">
                          <IconButton component={Link} to={`/users/details/${u.id}`} size="small" className="hover:!text-brand-primary hover:!bg-brand-primary/10 transition-all p-2.5">
                            <Eye className="w-4 h-4" />
                          </IconButton>
                          <IconButton size="small" className="hover:!text-blue-600 hover:!bg-blue-50 transition-all p-2.5"><Edit className="w-4 h-4" /></IconButton>
                          <IconButton size="small" className="hover:!text-rose-600 hover:!bg-rose-50 transition-all p-2.5"><Trash2 className="w-4 h-4" /></IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-24 text-center text-gray-400 font-bold italic">لا توجد نتائج تطابق بحثك</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ index, icon: Icon, label, value, color, variants }) => {
  const colors = {
    brand: 'bg-brand-primary/10 text-brand-primary',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
      <div>
        <h4 className="text-3xl font-black text-gray-800 dark:text-white leading-none">{value.toLocaleString()}</h4>
      </div>
    </motion.div>
  );
};
