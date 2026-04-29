import React, { useMemo, useState } from 'react';
import { 
  MessageSquare, AlertCircle, Phone, CheckCircle, 
  User, Truck, Package, ShieldAlert,
  ArrowRight, Search, Filter, MoreHorizontal,
  Mail, MessageCircle, DollarSign, ExternalLink,
  Clock
} from 'lucide-react';
import { 
  Button, IconButton, Chip, Divider, Avatar, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

// Mock Data for Disputes
const initialDisputes = [
  { id: 'DS-401', shipmentId: 'SH-1025', reporter: 'أحمد علي (عميل)', against: 'محمود كمال (سائق)', type: 'مشكلة تسليم', status: 'جديد', priority: 'عالية', date: '2024-04-16', desc: 'السائق لم يصل في الموعد وقام بإلغاء الرحلة بعد الانتظار.' },
  { id: 'DS-402', shipmentId: 'SH-1030', reporter: 'خالد يحيى (عميل)', against: 'إبراهيم سعيد (سائق)', type: 'بلاغ تلف', status: 'قيد المراجعة', priority: 'حرجة', date: '2024-04-15', desc: 'تم استلام الشحنة وبها كسر في الغلاف الخارجي وتلف داخلي.' },
  { id: 'DS-403', shipmentId: 'SH-1028', reporter: 'ياسر القحطاني (سائق)', against: 'محمود حسن (عميل)', type: 'مشكلة دفع', status: 'تم الحل', priority: 'متوسطة', date: '2024-04-12', desc: 'العميل يرفض دفع المبلغ الإضافي المتفق عليه مقابل التحميل.' },
  { id: 'DS-404', shipmentId: 'SH-1022', reporter: 'منى يوسف (عميل)', against: 'سامي علي (سائق)', type: 'شكوى سلوك', status: 'جديد', priority: 'منخفضة', date: '2024-04-16', desc: 'تعامل غير لائق من قبل السائق عند نقطة التسليم.' },
];

export const DisputeResolution = () => {
  const [data, setData] = useState(initialDisputes);
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeTab, setActiveTab] = useState('الكل');

  // Resolution Dialog State
  const [openResolveDialog, setOpenResolveDialog] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionText, setResolutionText] = useState('');
  const [reimbursementAmount, setReimbursementAmount] = useState('');

  const handleResolve = () => {
    setData(prev => prev.map(d => d.id === selectedDispute.id ? { ...d, status: 'تم الحل' } : d));
    setOpenResolveDialog(false);
    setResolutionText('');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'رقم النزاع',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${info.row.original.priority === 'حرجة' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-black text-gray-800 dark:text-white">{info.getValue()}</span>
          </div>
        )
      },
      {
        accessorKey: 'type',
        header: 'نوع المشكلة',
        cell: (info) => (
          <div className="space-y-1">
             <p className="text-xs font-black text-gray-800 dark:text-gray-200">{info.getValue()}</p>
             <p className="text-[10px] font-bold text-gray-400">شحنة #{info.row.original.shipmentId}</p>
          </div>
        )
      },
      {
        accessorKey: 'reporter',
        header: 'الأطراف المعنية',
        cell: (info) => (
          <div className="space-y-1">
             <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                المبلغ: {info.getValue()}
             </div>
             <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                المشتكى عليه: {info.row.original.against}
             </div>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            'جديد': 'bg-blue-50 text-blue-600',
            'قيد المراجعة': 'bg-orange-50 text-orange-600',
            'تم الحل': 'bg-emerald-50 text-emerald-600',
          };
          return <Chip label={status} size="small" className={`!font-black !text-[10px] ${colors[status]}`} />
        }
      },
      {
        accessorKey: 'date',
        header: 'التاريخ',
        cell: (info) => <span className="text-xs text-gray-400 font-bold">{info.getValue()}</span>
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
             <IconButton size="small" onClick={() => { setSelectedDispute(row.original); setOpenResolveDialog(true); }} className="hover:!bg-emerald-50 !text-emerald-600">
                <CheckCircle className="w-4 h-4" />
             </IconButton>
             <IconButton size="small" className="hover:!bg-blue-50 !text-blue-500">
                <MessageSquare className="w-4 h-4" />
             </IconButton>
             <IconButton size="small" className="hover:!bg-gray-50 !text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-3">
             <ShieldAlert className="w-8 h-8 text-rose-500" />
             مركز حل النزاعات والشكاوى
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">إدارة البلاغات وحل المشاكل بين العملاء والسائقين لضمان عدالة المنصة</p>
        </div>
      </div>

      {/* Dispute Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'بلاغات نشطة', value: '24', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'قيد المراجعة', value: '15', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
           { label: 'تم حلها (اليوم)', value: '42', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'إجمالي التعويضات', value: 'EGP 4.2K', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1.5">{stat.label}</p>
                 <h4 className={`text-xl font-black ${stat.color} leading-none transition-all group-hover:scale-105`}>{stat.value}</h4>
              </div>
           </div>
         ))}
      </div>

      {/* Main Dispute Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        {/* Filters and Tabs */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-6 lg:items-center justify-between bg-gray-50/20">
           <div className="flex bg-gray-100/50 dark:bg-gray-700/50 p-1.5 rounded-2xl self-start">
             {['الكل', 'بلاغات', 'مشاكل تسليم', 'سلوك'].map((tab) => (
               <Button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`!px-6 !py-2 !text-xs !font-bold !rounded-xl transition-all ${activeTab === tab ? '!bg-white dark:!bg-gray-700 !text-brand-primary shadow-md' : '!text-gray-400 hover:!text-brand-primary'}`}
               >
                 {tab}
               </Button>
             ))}
           </div>

           <div className="relative group w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث برقم النزاع أو اسم الطرف..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Table Content */}
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

      {/* Dispute Resolution Dialog */}
      <Dialog 
        open={openResolveDialog} 
        onClose={() => setOpenResolveDialog(false)}
        PaperProps={{ className: "!rounded-3xl !p-2 !shadow-2xl sm:!min-w-[500px]" }}
      >
        <DialogTitle className="!font-black !text-gray-800 !flex !items-center !gap-2">
           <ShieldAlert className="text-rose-500" /> معالجة النزاع #{selectedDispute?.id}
        </DialogTitle>
        <Divider />
        <DialogContent className="!py-6 space-y-6">
           {/* Dispute Summary Block */}
           <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 leading-none">تفاصيل البلاغ</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-bold italic leading-relaxed">"{selectedDispute?.desc}"</p>
           </div>

           <div className="flex gap-4">
              <Button fullWidth variant="outlined" className="!rounded-xl !py-3 !border-gray-100 !text-blue-600 !font-black !text-xs" startIcon={<Phone className="w-4 h-4 ml-1" />}>اتصال بالعميل</Button>
              <Button fullWidth variant="outlined" className="!rounded-xl !py-3 !border-gray-100 !text-brand-primary !font-black !text-xs" startIcon={<Phone className="w-4 h-4 ml-1" />}>اتصال بالسائق</Button>
           </div>

           <div>
              <p className="text-sm font-black text-gray-800 dark:text-white mb-3">قرار الإدارة والحل المطبق:</p>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder="اكتب تفاصيل الحل هنا..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                InputProps={{ className: "!rounded-2xl" }}
              />
           </div>

           <div>
              <p className="text-sm font-black text-gray-800 dark:text-white mb-3">تعويض مالي (اختياري):</p>
              <TextField
                fullWidth
                placeholder="المبلغ بالجنيه المصري..."
                type="number"
                value={reimbursementAmount}
                onChange={(e) => setReimbursementAmount(e.target.value)}
                InputProps={{ 
                  className: "!rounded-2xl",
                  startAdornment: <DollarSign className="w-4 h-4 text-gray-400 ml-2" />
                }}
              />
           </div>
        </DialogContent>
        <DialogActions className="!px-6 !pb-6 !gap-2">
           <Button onClick={() => setOpenResolveDialog(false)} className="!rounded-xl !font-bold !text-gray-400">إلغاء</Button>
           <Button onClick={handleResolve} variant="contained" className="!bg-emerald-500 !rounded-xl !px-6 !py-2.5 !font-black !shadow-lg">إغلاق النزاع وحفظ الحل</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
