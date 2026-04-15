import { Users, CreditCard, ShoppingCart, MessageSquare, User, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = React.useState(1);
  const resultsPerPage = 10;
  const totalResults = 100;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const stats = [
    { icon: Users, label: 'إجمالي العملاء', value: '4,521', color: 'bg-orange-500' },
    { icon: CreditCard, label: 'رصيد المحفظة', value: 'EGP 12,450', color: 'bg-green-500' },
    { icon: ShoppingCart, label: 'الطلبات الجديدة', value: '150', color: 'bg-blue-500' },
    { icon: MessageSquare, label: 'رسائل الدعم', value: '35', color: 'bg-teal-500' },
  ];

  // Generate fake data for the current page
  const tableData = Array.from({ length: resultsPerPage }, (_, i) => {
    const id = (currentPage - 1) * resultsPerPage + i + 1;
    return {
      id,
      name: `أحمد محمد ${id}`,
      role: id % 3 === 0 ? 'تاجر' : 'عميل عادي',
      amount: id * 120,
      status: id % 2 === 0 ? 'مكتمل' : 'قيد المراجعة',
      date: `2024-04-${(id % 30) + 1}`
    };
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      {/* Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
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
              {tableData.map((client) => (
                <tr key={client.id} className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm">
                      <div className="relative w-9 h-9 ml-3 rounded-full md:block bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{client.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{client.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold">{client.amount.toLocaleString()} EGP</td>
                  <td className="px-4 py-4 text-xs">
                    <span className={`px-3 py-1 font-bold leading-tight rounded-full ${
                      client.status === 'مكتمل' 
                        ? 'text-green-700 bg-green-100 dark:bg-green-700/20 dark:text-green-400' 
                        : 'text-orange-700 bg-orange-100 dark:bg-orange-700/20 dark:text-orange-400'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 font-medium">{client.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination inspired by Windmill Dashboard */}
        <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col justify-between text-xs sm:flex-row text-gray-600 dark:text-gray-400">
            <span className="flex items-center font-bold tracking-wide uppercase">
              عرض {(currentPage - 1) * resultsPerPage + 1}-{Math.min(currentPage * resultsPerPage, totalResults)} من أصل {totalResults}
            </span>
            <div className="flex mt-2 sm:mt-0">
              <nav aria-label="Table navigation">
                <ul className="inline-flex items-center gap-1">
                  <li>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-2 py-2 rounded-md focus:outline-none focus:shadow-outline-purple hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                      aria-label="Previous"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </li>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <li key={pageNumber}>
                        <button 
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple transition-all font-bold ${
                            currentPage === pageNumber 
                              ? 'text-white bg-purple-600 shadow-lg shadow-purple-500/30' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  {totalPages > 5 && <li><span className="px-2">...</span></li>}
                  <li>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-2 rounded-md focus:outline-none focus:shadow-outline-purple hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                      aria-label="Next"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


