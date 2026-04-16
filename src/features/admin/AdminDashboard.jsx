import React from 'react';
import {
  Users, ShoppingCart, User, ChevronLeft, ChevronRight,
  Package, Truck, CheckCircle, XCircle, Banknote, Star,
  Eye, Edit, Trash2, TrendingUp, MoreHorizontal
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { Button } from '@mui/material';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 border dark:border-gray-700 transition-all hover:shadow-md">
    <div className={`p-3 ml-4 rounded-full ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const [timeFilter, setTimeFilter] = React.useState('اسبوعي');
  const totalResults = 50;

  const stats = [
    { icon: Users, label: 'إجمالي المستخدمين', value: '4,521', color: 'bg-blue-500' },
    { icon: Banknote, label: 'إجمالي الأرباح', value: 'EGP 12,450', color: 'bg-emerald-500' },
    { icon: Package, label: 'إجمالي الشحنات', value: '1,250', color: 'bg-indigo-500' },
    { icon: Truck, label: 'شحنات نشطة', value: '85', color: 'bg-amber-500' },
    { icon: CheckCircle, label: 'شحنات مكتملة', value: '1,100', color: 'bg-green-500' },
    { icon: XCircle, label: 'شحنات ملغية', value: '65', color: 'bg-rose-500' },
  ];

  const captains = [
    { id: 1, name: 'أحمد محمود', email: 'ahmed@shuhnety.com', vehicle: 'تريلا جامبو', status: 'موثق', rating: 4.8, date: '2024-03-20' },
    { id: 2, name: 'محمد صبحي', email: 'mohamed@shuhnety.com', vehicle: 'نصف نقل', status: 'قيد المراجعة', rating: 4.2, date: '2024-03-22' },
    { id: 3, name: 'سيد إبراهيم', email: 'sayed@shuhnety.com', vehicle: 'ميكروباص نقل', status: 'موثق', rating: 4.9, date: '2024-03-15' },
    { id: 4, name: 'ياسر القحطاني', email: 'yasser@shuhnety.com', vehicle: 'عربة ربع نقل', status: 'موقوف', rating: 3.5, date: '2024-03-10' },
    { id: 5, name: 'مصطفى كمال', email: 'mostafa@shuhnety.com', vehicle: 'تريلا مرسيدس', status: 'موثق', rating: 4.7, date: '2024-03-18' },
  ];

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">لوحة الإدارة الرئيسية</h2>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
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
          <div className="h-[220px] flex items-center justify-center relative">
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-gray-800 dark:text-white">75%</span>
              <span className="text-xs font-bold text-gray-400">إجمالي النمو</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">الأكثر شحناً حسب النوع</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium">حسب الفترة المختارة</p>
            </div>
            <div className="flex px-1 gap-1">
              {['يوم', 'اسبوع', 'شهر'].map((f) => (
                <Button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  size="small"
                  className={`min-w-0 !px-4 !py-2 !text-xs !font-bold !rounded-md transition-all ${timeFilter === f
                    ? '!bg-brand-primary/10 !text-brand-primary'
                    : '!text-gray-400 hover:!bg-brand-primary/5 hover:!text-brand-primary'
                    }`}
                  sx={{ textTransform: 'none' }}
                >
                  {f}
                </Button>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 dark:text-gray-200">أحدث السائقين المسجلين</h3>
          <Button
            size="small"
            className="!font-bold !text-brand-primary hover:!bg-brand-primary/5 !transition-all"
            sx={{ textTransform: 'none' }}
          >
            عرض الكل
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-xs font-bold text-gray-500 uppercase bg-gray-50/50 dark:bg-gray-800/50">
                <th className="px-6 py-4">الكابتن</th>
                <th className="px-6 py-4">المركبة</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">التقييم</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {captains.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{c.vehicle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.status === 'موثق' ? 'bg-green-100 text-green-700' :
                      c.status === 'موقوف' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-1 font-bold text-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {c.rating}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-medium">{c.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 hover:bg-brand-primary/10 rounded-lg text-gray-400 hover:text-brand-primary transition-all"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
