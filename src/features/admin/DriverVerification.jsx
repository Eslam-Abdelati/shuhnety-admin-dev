import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  Search, Eye, CheckCircle, XCircle, 
  MapPin, ShieldCheck, Mail, Phone,
  Truck, ArrowRight, UserCheck, UserX,
  FileText, ExternalLink
} from 'lucide-react';
import { Button, IconButton, Chip } from '@mui/material';

// Mock Data: Only Drivers awaiting verification
const pendingDriversData = [
  { id: 2, name: 'محمد صبحي', email: 'mohamed@example.com', phone: '01011223344', location: 'القاهرة', vehicle: 'نصف نقل', date: '2024-04-15', docStatus: '3/3 مستندات' },
  { id: 8, name: 'على إمام', email: 'ali@example.com', phone: '01223344556', location: 'السويس', vehicle: 'عربة ربع نقل', date: '2024-04-14', docStatus: '3/3 مستندات' },
  { id: 10, name: 'خالد يوسف', email: 'khaled@example.com', phone: '01111222333', location: 'الجيزة', vehicle: 'تريلا مرسيدس', date: '2024-04-16', docStatus: '2/3 مستندات' },
  { id: 11, name: 'هاني رمزي', email: 'hany@example.com', phone: '01511223344', location: 'المنصورة', vehicle: 'ميكروباص نقل', date: '2024-04-15', docStatus: '3/3 مستندات' },
];

export const DriverVerification = () => {
  const [data, setData] = useState(pendingDriversData);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'السائق',
        cell: (info) => (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-brand-primary">
               {info.getValue().charAt(0)}
             </div>
             <div>
               <p className="font-bold text-gray-800 dark:text-gray-200">{info.getValue()}</p>
               <p className="text-[11px] text-gray-400 font-medium">{info.row.original.email}</p>
             </div>
          </div>
        )
      },
      {
        accessorKey: 'vehicle',
        header: 'نوع المركبة',
        cell: (info) => (
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
             <Truck className="w-4 h-4 text-brand-primary/60" />
             {info.getValue()}
          </div>
        )
      },
      {
        accessorKey: 'location',
        header: 'المحافظة',
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
             <MapPin className="w-3.5 h-3.5" />
             {info.getValue()}
          </div>
        )
      },
      {
        accessorKey: 'docStatus',
        header: 'المستندات',
        cell: (info) => (
           <Chip 
             label={info.getValue()} 
             size="small" 
             className={`!font-black !text-[10px] ${info.getValue().startsWith('3/3') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`} 
           />
        )
      },
      {
        accessorKey: 'date',
        header: 'تاريخ الطلب',
        cell: (info) => <span className="text-xs text-gray-400 font-bold">{info.getValue()}</span>
      },
      {
        id: 'actions',
        header: 'الإجراءات والتوثيق',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
             <Button 
               component={Link}
               to={`/admin/users/details/${row.original.id}`}
               variant="outlined" 
               size="small"
               className="!rounded-lg !border-gray-100 !text-gray-500 !font-bold !text-[10px] hover:!bg-gray-50"
               startIcon={<Eye className="w-3.5 h-3.5" />}
             >
               مراجعة البيانات
             </Button>
             <IconButton className="hover:!bg-emerald-50 !text-emerald-500">
                <UserCheck className="w-4 h-4" />
             </IconButton>
             <IconButton className="hover:!bg-rose-50 !text-rose-500">
                <UserX className="w-4 h-4" />
             </IconButton>
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">توثيق السائقين</h2>
             <span className="px-3 py-1 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20">
               {data.length} طلبات جديدة
             </span>
          </div>
          <p className="text-sm text-gray-400 font-medium mt-1">مراجعة وتأكيد حسابات الكباتن الجدد لضمان جودة الخدمة</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">طلبات اليوم</h5>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-black text-brand-primary">12</span>
               <span className="p-1 px-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg">+20%</span>
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">سائقين موثقين هذا الشهر</h5>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-black text-emerald-600">850</span>
               <Truck className="w-6 h-6 text-emerald-100" />
            </div>
         </div>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">متوسط وقت المراجعة</h5>
            <div className="flex items-center gap-3">
               <span className="text-3xl font-black text-blue-600">2.4 ساعة</span>
               <ShieldCheck className="w-6 h-6 text-blue-100" />
            </div>
         </div>
      </div>

      {/* Main Verification Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/20">
          <div className="relative group w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث عن سائق محدد..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
           <table className="w-full text-right border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-gray-50/50 dark:bg-gray-900/50">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                 {table.getRowModel().rows.map((row) => (
                   <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all group">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};
