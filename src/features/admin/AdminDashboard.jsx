import React from 'react';
import { Users, CreditCard, ShoppingCart, MessageSquare, User } from 'lucide-react';

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

export const AdminDashboard = () => {
  const stats = [
    { icon: Users, label: 'إجمالي العملاء', value: '4,521', color: 'bg-orange-500' },
    { icon: CreditCard, label: 'رصيد المحفظة', value: 'EGP 12,450', color: 'bg-green-500' },
    { icon: ShoppingCart, label: 'الطلبات الجديدة', value: '150', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'رسائل الدعم', value: '35', color: 'bg-teal-500' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-bold tracking-wide text-right text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800/50">
                <th className="px-4 py-4">العميل</th>
                <th className="px-4 py-4">المبلغ</th>
                <th className="px-4 py-4">الحالة</th>
                <th className="px-4 py-4">التاريخ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm">
                      <div className="relative w-8 h-8 ml-3 rounded-full md:block bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold">أحمد محمد {i}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">عميل جديد</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">{i * 100} EGP</td>
                  <td className="px-4 py-4 text-xs">
                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${
                      i % 2 === 0 ? 'text-green-700 bg-green-100 dark:bg-green-700/20 dark:text-green-400' : 'text-orange-700 bg-orange-100 dark:bg-orange-700/20 dark:text-orange-400'
                    }`}>
                      {i % 2 === 0 ? 'مكتمل' : 'قيد التنفيذ'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">2026-04-{10+i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
          عرض 5 من أصل 50 نتيجة
        </div>
      </div>
    </div>
  );
};

