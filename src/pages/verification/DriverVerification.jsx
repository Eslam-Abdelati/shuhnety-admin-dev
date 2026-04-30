import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Eye, Edit, Trash2, Star,
  MapPin, ShieldCheck, Truck, Clock,
  Calendar, MessageSquare, UserCheck, UserX, User
} from 'lucide-react';
import { Button, IconButton } from '@mui/material';

// Mock Data: Including Age
const pendingDriversData = [
  {
    id: 2,
    name: 'محمد صبحي',
    email: 'mohamed@example.com',
    phone: '01011223344',
    location: 'القاهرة',
    vehicleBrand: 'شيفروليه',
    vehicleType: 'نصف نقل',
    date: '2024-04-15',
    age: '39 سنة',

  },
  {
    id: 8,
    name: 'على إمام',
    email: 'ali@example.com',
    phone: '01223344556',
    location: 'السويس',
    vehicleBrand: 'تويوتا',
    vehicleType: 'ربع نقل',
    date: '2024-04-14',
    age: '32 سنة',

  },
  {
    id: 10,
    name: 'خالد يوسف',
    email: 'khaled@example.com',
    phone: '01111222333',
    location: 'الجيزة',
    vehicleBrand: 'مرسيدس',
    vehicleType: 'تريلا جامبو',
    date: '2024-04-16',
    age: '36 سنة',

  },
  {
    id: 11,
    name: 'هاني رمزي',
    email: 'hany@example.com',
    phone: '01511223344',
    location: 'المنصورة',
    vehicleBrand: 'هيونداي',
    vehicleType: 'ميكروباص نقل',
    date: '2024-04-15',
    age: '29 سنة',

  },
];

export const DriverVerification = () => {
  const [data] = useState(pendingDriversData);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-full overflow-x-hidden">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">توثيق السائقين</h2>
            <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20">
              {data.length} طلبات جديدة
            </span>
          </div>
          <p className="text-sm text-gray-400 font-medium mt-1">مراجعة وتأكيد حسابات الكباتن الجدد لضمان جودة الخدمة</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">طلبات اليوم</h5>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-brand-primary">12</span>
            <span className="p-1 px-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">+20%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">سائقين موثقين هذا الشهر</h5>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-emerald-600">850</span>
            <Truck className="w-6 h-6 text-emerald-100" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">متوسط وقت المراجعة</h5>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-blue-600">2.4 ساعة</span>
            <ShieldCheck className="w-6 h-6 text-blue-100" />
          </div>
        </div>
      </div>

      {/* Main Table Section (Simple Mapping) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 w-full max-w-full">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/20">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">أحدث طلبات التوثيق</h3>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="بحث عن سائق..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 pr-9 pl-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <table className="w-full text-right min-w-[700px] lg:min-w-full">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4">الكابتن</th>
                <th className="px-6 py-4">المركبة</th>
                <th className="px-6 py-4 text-center">المحافظة</th>
                <th className="px-6 py-4 text-center">السن</th>
                <th className="px-6 py-4">تاريخ الطلب</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">

                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{c.vehicleBrand}</p>
                        <p className="text-[11px] text-gray-400">{c.vehicleType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {c.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500">
                        {c.age}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-bold">{c.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          component={Link}
                          to={`/users/details/${c.id}`}
                          className="p-2 hover:!bg-brand-primary/10 rounded-lg text-gray-400 hover:!text-brand-primary transition-all"
                          title="مراجعة التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          className="p-2 hover:!bg-emerald-50 rounded-lg text-gray-400 hover:!text-emerald-600 transition-all"
                          title="توثيق"
                        >
                          <UserCheck className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          className="p-2 hover:!bg-rose-50 rounded-lg text-gray-400 hover:!text-rose-500 transition-all"
                          title="رفض"
                        >
                          <UserX className="w-4 h-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-bold italic">
                    لا توجد طلبات تطابق معايير البحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
