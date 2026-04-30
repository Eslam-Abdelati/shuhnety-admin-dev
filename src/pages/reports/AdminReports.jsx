import React, { useState } from 'react';
import {
   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
   LineChart, Line, ComposedChart, Area
} from 'recharts';
import {
   Download, Filter, Calendar, TrendingUp, Users,
   Truck, Banknote, Map as MapIcon, ChevronDown,
   FileText, ArrowDown, ArrowUp
} from 'lucide-react';
import { Button, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import { exportToExcel } from '../../utils/excelExport';
import toast from 'react-hot-toast';

// Mock Data for Reports
const revenueData = [
   { month: 'يناير', revenue: 45000, bookings: 320 },
   { month: 'فبراير', revenue: 52000, bookings: 380 },
   { month: 'مارس', revenue: 48000, bookings: 350 },
   { month: 'أبريل', revenue: 61000, bookings: 450 },
   { month: 'مايو', revenue: 55000, bookings: 410 },
   { month: 'يونيو', revenue: 72000, bookings: 530 },
];

const topDrivers = [
   { name: 'أحمد محمود', trips: 145, rating: 4.9, earnings: 'EGP 12,400' },
   { name: 'سيد إبراهيم', trips: 132, rating: 4.8, earnings: 'EGP 10,200' },
   { name: 'مصطفى كمال', trips: 110, rating: 4.7, earnings: 'EGP 8,500' },
   { name: 'محمد صبحي', trips: 98, rating: 4.6, earnings: 'EGP 7,100' },
];

const routeActivity = [
   { route: 'القاهرة - الإسكندرية', count: 450, growth: '+12%' },
   { route: 'الجيزة - المنصورة', count: 320, growth: '+8%' },
   { route: 'القاهرة - السويس', count: 280, growth: '-3%' },
   { route: 'الإسكندرية - طنطا', count: 190, growth: '+15%' },
];

export const AdminReports = () => {
   const [reportType, setReportType] = useState('monthly');

   const handleExportExcel = () => {
      const columns = [
         { key: 'month', header: 'الشهر' },
         { key: 'revenue', header: 'الإيرادات (EGP)' },
         { key: 'bookings', header: 'عدد الحجوزات' },
      ];

      exportToExcel(revenueData, `تقرير_أداء_المنصة`, columns);
      toast.success('تم تصدير الملف بنجاح');
   };

   return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
         {/* Header & Export Options */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">التقارير والإحصائيات</h2>
               <p className="text-sm text-gray-400 font-medium mt-1">نظرة عامة على أداء المنصة وتحليل البيانات المالية والتشغيلية</p>
            </div>
            <div className="flex gap-3">
               <Button
                  className="!rounded-xl !bg-white dark:!bg-gray-800 !border !border-gray-100 dark:!border-gray-700 !text-gray-500 !font-bold !px-5 !py-2.5 shadow-sm"
                  startIcon={<Download className="w-4 h-4 ml-1" />}
               >
                  تصدير PDF
               </Button>
               <Button
                  onClick={handleExportExcel}
                  className="!rounded-xl !bg-brand-primary !text-white !font-black !px-6 !py-2.5 shadow-lg shadow-brand-primary/20"
                  startIcon={<FileText className="w-4 h-4 ml-1" />}
               >
                  تقرير كامل Excel
               </Button>
            </div>
         </div>

         {/* Reports Filter Bar */}
         <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-wrap items-center gap-4">
            <FormControl size="small" className="min-w-[150px]">
               <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="!rounded-xl !font-bold !text-xs"
               >
                  <MenuItem value="daily" className="!text-xs !font-bold">تقرير يومي</MenuItem>
                  <MenuItem value="weekly" className="!text-xs !font-bold">تقرير أسبوعي</MenuItem>
                  <MenuItem value="monthly" className="!text-xs !font-bold">تقرير شهري</MenuItem>
                  <MenuItem value="yearly" className="!text-xs !font-bold">تقرير سنوي</MenuItem>
               </Select>
            </FormControl>
            <div className="h-6 w-px bg-gray-100 dark:bg-gray-700 hidden md:block" />
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs bg-gray-50 dark:bg-gray-900/50 px-4 py-2 rounded-xl">
               <Calendar className="w-4 h-4" />
               <span>الفترة: 01 يوليو 2024 - 31 يوليو 2024</span>
               <ChevronDown className="w-3 h-3" />
            </div>
         </div>

         {/* Key Metrics Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricBox label="إجمالي الإيرادات" value="EGP 125,400" growth="+15.4%" up icon={Banknote} color="text-emerald-500" bg="bg-emerald-50" />
            <MetricBox label="إجمالي العمولات" value="EGP 18,320" growth="+12.1%" up icon={TrendingUp} color="text-blue-500" bg="bg-blue-50" />
            <MetricBox label="الرحلات المكتملة" value="1,452" growth="+5.2%" up icon={Truck} color="text-brand-primary" bg="bg-orange-50" />
            <MetricBox label="معدل الإلغاء" value="4.2%" growth="-2.1%" down icon={XCircle} color="text-rose-500" bg="bg-rose-50" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Revenue Chart (2/3) */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-800 dark:text-white mb-8">نمو الإيرادات وحجم الحجوزات</h3>
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height={400} minWidth={0}>
                     <ComposedChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', direction: 'rtl' }}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        <Area type="monotone" dataKey="revenue" fill="#f59e0b" fillOpacity={0.05} stroke="#f59e0b" strokeWidth={3} name="الإيرادات (EGP)" />
                        <Bar dataKey="bookings" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} name="عدد الحجوزات" />
                     </ComposedChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Top Drivers Table (1/3) */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">الأفضل أداءً (كباتن)</h3>
               <div className="space-y-6">
                  {topDrivers.map((driver, i) => (
                     <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center font-black text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-all">
                              {i + 1}
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-800 dark:text-gray-200">{driver.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{driver.trips} رحلة مكتملة</p>
                           </div>
                        </div>
                        <div className="text-left">
                           <p className="text-xs font-black text-emerald-600">{driver.earnings}</p>
                           <p className="text-[10px] text-amber-500 font-bold">★ {driver.rating}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button fullWidth className="!mt-8 !rounded-xl !bg-gray-50 dark:!bg-gray-700 !text-gray-500 !font-bold !py-3">مشاهدة كافة الكباتن</Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Route Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">أكثر المسارات طلباً</h3>
               <div className="space-y-4">
                  {routeActivity.map((r, i) => (
                     <div key={i} className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <MapIcon className="w-4 h-4 text-brand-primary/50" />
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{r.route}</span>
                           </div>
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${r.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {r.growth}
                           </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden">
                           <div
                              className="h-full bg-brand-primary rounded-full"
                              style={{ width: `${(r.count / 500) * 100}%` }}
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* General Stats summary cards grid */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between">
                  <Users className="w-8 h-8 opacity-50" />
                  <div>
                     <h4 className="text-3xl font-black mb-1">2,850</h4>
                     <p className="text-xs font-bold opacity-70">عملاء جدد هذا الشهر</p>
                  </div>
               </div>
               <div className="bg-brand-primary p-8 rounded-3xl text-white shadow-xl shadow-brand-primary/20 flex flex-col justify-between">
                  <Truck className="w-8 h-8 opacity-50" />
                  <div>
                     <h4 className="text-3xl font-black mb-1">15.2k</h4>
                     <p className="text-xs font-bold opacity-70">إجمالي رحلات المنصة</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

// Internal Components
const MetricBox = ({ label, value, growth, up, icon: Icon, color, bg }) => (
   <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${bg} opacity-20 group-hover:scale-150 transition-transform duration-700`} />
      <div className="flex items-center justify-between mb-4">
         <div className={`p-3 rounded-2xl ${bg} ${color}`}>
            <Icon className="w-5 h-5" />
         </div>
         <div className={`flex items-center gap-1 text-[10px] font-black ${up ? 'text-emerald-500' : 'text-rose-500'}`}>
            {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {growth}
         </div>
      </div>
      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</h5>
      <h4 className="text-xl font-black text-gray-800 dark:text-white">{value}</h4>
   </div>
);

const XCircle = ({ className }) => (
   <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
   </svg>
)
