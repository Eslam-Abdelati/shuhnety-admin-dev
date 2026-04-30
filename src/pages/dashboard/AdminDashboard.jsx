import React, { useState, useEffect } from 'react';
import {
  Users, ShoppingCart, User, ChevronLeft, ChevronRight,
  Package, Truck, CheckCircle, XCircle, Banknote, Star,
  Eye, Edit, Trash2, TrendingUp, MoreHorizontal, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 border dark:border-gray-700 transition-all hover:shadow-md min-w-0">
    <div className={`flex-shrink-0 p-2 sm:p-3 ml-2 sm:ml-4 rounded-full ${color}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="mb-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-normal leading-tight">
        {label}
      </p>
      <p className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-200 truncate">
        {value}
      </p>
    </div>
  </div>
);

// Mock Data for Charts
const salesData = [
  { name: 'السبت', sales: 40, orders: 25 },
  { name: 'الأحد', sales: 30, orders: 55 },
  { name: 'الاثنين', sales: 20, orders: 40 },
  { name: 'الثلاثاء', sales: 27, orders: 39 },
  { name: 'الأربعاء', sales: 18, orders: 48 },
  { name: 'الخميس', sales: 23, orders: 38 },
  { name: 'الجمعة', sales: 34, orders: 70 },
];

const shipmentTypeData = [
  { type: 'بضائع عامة', count: 450, color: 'bg-blue-500' },
  { type: 'مواد بناء', count: 320, color: 'bg-amber-500' },
  { type: 'أثاث ومنزليات', count: 280, color: 'bg-emerald-500' },
  { type: 'مواد غذائية', count: 190, color: 'bg-rose-500' },
  { type: 'أجهزة إلكترونية', count: 120, color: 'bg-indigo-500' },
];

const growthData = [
  { name: 'مكتملة', value: 75, color: '#10b981' },
  { name: 'قيد التنفيذ', value: 15, color: '#f59e0b' },
  { name: 'ملغية', value: 10, color: '#ef4444' },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [timeFilter, setTimeFilter] = React.useState('اسبوعي');
  const [captains, setCaptains] = useState([]);
  const [isLoadingCaptains, setIsLoadingCaptains] = useState(true);

  // Fetch Drivers from API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setIsLoadingCaptains(true);
        const response = await userService.getAllUsers({ userRole: 'driver' });
        console.log(response

        );

        // Take only the first 5 for the dashboard table
        const driversList = (response?.data || response || []).slice(0, 5);
        setCaptains(driversList);
      } catch (error) {
        console.error('Error fetching dashboard drivers:', error);
      } finally {
        setIsLoadingCaptains(false);
      }
    };
    fetchDrivers();
  }, []);

  const stats = [
    { icon: Users, label: 'إجمالي المستخدمين', value: '4,521', color: 'bg-blue-500' },
    { icon: Banknote, label: 'إجمالي الأرباح', value: 'EGP 12,450', color: 'bg-emerald-500' },
    { icon: Package, label: 'إجمالي الشحنات', value: '1,250', color: 'bg-indigo-500' },
    { icon: Truck, label: 'شحنات نشطة', value: '85', color: 'bg-amber-500' },
    { icon: CheckCircle, label: 'شحنات مكتملة', value: '1,100', color: 'bg-green-500' },
    { icon: XCircle, label: 'شحنات ملغية', value: '65', color: 'bg-rose-500' },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة الإدارة الرئيسية</h2>
        <Button
          variant="contained"
          onClick={() => navigate('/users/add-manager')}
          className="!bg-brand-primary !rounded-xl !py-2.5 !px-6 !font-bold !shadow-sm transition-all duration-300 hover:!bg-brand-primary/90 hover:shadow-md !text-sm whitespace-nowrap"
          sx={{ textTransform: 'none' }}
        >
          إضافة مدير
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">تقرير المبيعات والشحنات</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">إحصائيات الأداء الأسبوعي للمنصة</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 justify-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500">الطلبات</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">1000 طلب</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-gray-100 dark:bg-gray-700"></div>

            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500">المبيعات</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">2057 جنيه</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full mt-4 relative">
          <ResponsiveContainer width="100%" height={350} minWidth={0}>
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value}K`}
                width={50}
              />
              <Tooltip
                labelFormatter={(value) => `اليوم: ${value}`}
                formatter={(value, name) => [`${value}K`, name === 'orders' ? 'الطلبات' : 'المبيعات']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                  textAlign: 'right',
                  direction: 'rtl'
                }}
                cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={0}
                name="orders"
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0ea5e9"
                strokeWidth={3}
                fillOpacity={0}
                name="sales"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Growth */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">نمو المبيعات</h3>
            <button className="text-gray-400"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="h-[220px] w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <span className="text-3xl font-black text-gray-800 dark:text-white">75%</span>
              <span className="text-xs font-bold text-gray-400">إجمالي النمو</span>
            </div>
            <ResponsiveContainer width="100%" height={220} minWidth={0}>
              <PieChart>
                <Pie data={growthData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {growthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {growthData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-800 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Shipment Types */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">الأكثر شحناً حسب النوع</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">حسب الفترة المختارة</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg">
              {['يوم', 'شهر', 'سنة'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeFilter === f
                    ? 'bg-white dark:bg-gray-800 text-brand-primary shadow-sm'
                    : 'text-gray-400 hover:text-brand-primary'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {shipmentTypeData.map((item) => {
              const percentage = (item.count / 500) * 100;
              return (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{item.type}</span>
                    <span className="text-sm font-black text-gray-800 dark:text-white">{item.count} شحنة</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-8 py-3 text-sm font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-all">
            عرض تقرير الأنواع المفصل
          </button>
        </div>
      </div>

      {/* Tables Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 w-full max-w-full">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">أحدث الكباتن المسجلين</h3>
          <Button
            size="small"
            onClick={() => navigate('/users')}
            className="!font-bold !text-brand-primary hover:!bg-brand-primary/5 !transition-all"
            sx={{ textTransform: 'none' }}
          >
            عرض الكل
          </Button>
        </div>
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 min-h-[300px] flex flex-col">
          {isLoadingCaptains ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
              <CircularProgress size={35} className="!text-brand-primary" />
              <p className="text-gray-400 text-xs font-bold animate-pulse">جاري تحميل قائمة الكباتن...</p>
            </div>
          ) : captains.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-gray-400 font-bold">
              لا يوجد كباتن مسجلين حالياً
            </div>
          ) : (
            <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="text-xs font-bold text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-right">الكابتن</th>
                  <th className="px-6 py-4 text-right">المركبة</th>
                  <th className="px-6 py-4 text-right">الحالة</th>
                  <th className="px-6 py-4 text-right">التقييم</th>
                  <th className="px-6 py-4 text-right">التاريخ</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {captains.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                        {c.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{c.full_name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {c.role === 'driver' ? 'نقل ثقيل' : 'عميل'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.status === 'موثق' || (c.isActive && !c.status) ? 'bg-emerald-100 text-emerald-700' :
                        c.status === 'موقوف' || (!c.isActive && !c.status) ? 'bg-rose-100 text-rose-700' :
                          c.status === 'قيد المراجعة' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {c.status || (c.isActive ? 'موثق' : 'موقوف')}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1 font-bold text-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {c.rating || '0.0'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                      {c.createDateTime ? new Date(c.createDateTime).toLocaleDateString('ar-EG') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/users/details/${c.id}`)}
                          className="p-2 hover:bg-brand-primary/10 rounded-lg text-gray-400 hover:text-brand-primary transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
