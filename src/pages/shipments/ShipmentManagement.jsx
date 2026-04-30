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
  Search, Eye, Edit, Trash2, MapPin, Calendar, 
  Package, Truck, CheckCircle, XCircle, 
  MoreHorizontal, Download, Filter, Navigation,
  ArrowUpRight, ArrowDownLeft, Clock, AlertTriangle
} from 'lucide-react';
import { 
  Button, Menu, MenuItem, IconButton, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Select, FormControl, InputLabel, Divider 
} from '@mui/material';

// Mock Data for Shipments
const initialShipments = [
  { id: 'SH-1025', sender: 'أحمد علي', recipient: 'محمد حسن', type: 'أثاث منزلي', status: 'نشط', price: 'EGP 450', from: 'القاهرة', to: 'الإسكندرية', date: '2024-04-15' },
  { id: 'SH-1026', sender: 'شركة الهدى', recipient: 'مخازن العبور', type: 'مواد غذائية', status: 'مكتمل', price: 'EGP 1,200', from: 'الجيزة', to: 'القليوبية', date: '2024-04-14' },
  { id: 'SH-1027', sender: 'سارة محمد', recipient: 'ليلى يوسف', type: 'ملابس', status: 'قيد الانتظار', price: 'EGP 200', from: 'المنصورة', to: 'طنطا', date: '2024-04-16' },
  { id: 'SH-1028', sender: 'محمود كمال', recipient: 'إبراهيم سعيد', type: 'إلكترونيات', status: 'ملغي', price: 'EGP 850', from: 'أسيوط', to: 'المنيا', date: '2024-04-12' },
  { id: 'SH-1029', sender: 'شركة النيل', recipient: 'مصنع الأمل', type: 'مواد بناء', status: 'نشط', price: 'EGP 3,500', from: 'السويس', to: 'بورسعيد', date: '2024-04-15' },
  { id: 'SH-1030', sender: 'منى أحمد', recipient: 'خالد يحيى', type: 'أدوات مكتبية', status: 'مكتمل', price: 'EGP 150', from: 'دمياط', to: 'الإسماعيلية', date: '2024-04-10' },
];

export const ShipmentManagement = () => {
  const [data, setData] = useState(initialShipments);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');

  // Status Change Dialog State
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleOpenStatusDialog = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setOpenStatusDialog(true);
  };

  const handleStatusUpdate = () => {
    if (selectedShipment) {
      setData(prev => prev.map(s => s.id === selectedShipment.id ? { ...s, status: newStatus } : s));
      setOpenStatusDialog(false);
    }
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'رقم الشحنة',
        cell: (info) => (
          <div className="whitespace-nowrap">
            <span className="font-black text-gray-800 dark:text-gray-200">{info.getValue()}</span>
          </div>
        )
      },
      {
        accessorKey: 'sender',
        header: 'الأطراف',
        cell: (info) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-800 dark:text-gray-200 text-xs">
              <ArrowUpRight className="w-3 h-3 text-emerald-500" />
              {info.getValue()}
            </div>
            <div className="flex items-center gap-1.5 font-bold text-gray-400 text-xs">
              <ArrowDownLeft className="w-3 h-3 text-rose-500" />
              {info.row.original.recipient}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'from',
        header: 'المسار',
        cell: (info) => (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
              {info.getValue()}
            </div>
            <div className="flex items-center gap-1.5 font-bold text-gray-400 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
              {info.row.original.to}
            </div>
          </div>
        )
      },
      {
        accessorKey: 'type',
        header: 'النوع والقيمة',
        cell: (info) => (
          <div>
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{info.getValue()}</p>
            <p className="text-[10px] text-emerald-600 font-extrabold mt-0.5">{info.row.original.price}</p>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: (info) => {
          const status = info.getValue();
          const configs = {
            'نشط': { color: 'bg-blue-500', text: 'نشط', icon: Navigation },
            'مكتمل': { color: 'bg-emerald-500', text: 'مكتمل', icon: CheckCircle },
            'قيد الانتظار': { color: 'bg-amber-500', text: 'قيد الانتظار', icon: Clock },
            'ملغي': { color: 'bg-rose-500', text: 'ملغي', icon: XCircle },
          };
          const config = configs[status] || { color: 'bg-gray-400', text: status, icon: Package };

          return (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
              <span className={`text-xs font-black ${status === 'ملغي' ? 'text-rose-600' : 'text-gray-700 dark:text-gray-300'}`}>
                {config.text}
              </span>
            </div>
          );
        }
      },
      {
        accessorKey: 'date',
        header: 'التاريخ',
        cell: (info) => (
          <div className="text-gray-400 font-bold text-xs">
            {info.getValue()}
          </div>
        )
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => <ShipmentActions shipment={row.original} onOpenStatusDialog={handleOpenStatusDialog} />,
      }
    ],
    [data] // Depend on data to re-render row actions if needed
  );

  // Filters logic
  const filteredData = useMemo(() => {
    let result = data;
    if (statusFilter !== 'الكل') {
      result = result.filter(s => s.status === statusFilter);
    }
    return result;
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">إدارة الشحنات</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">تتبع وإدارة كافة الشحنات الجارية والمنتهية في النظام</p>
        </div>
        <div className="flex gap-3">
           <Button className="!bg-white dark:!bg-gray-800 !border !border-gray-100 !rounded-xl !px-4 !py-2.5 !text-gray-500 !font-bold hover:!bg-gray-50 shadow-sm" startIcon={<Download className="w-4 h-4 ml-1" />}>تصدير البيانات</Button>
           <Button className="!bg-brand-primary !text-white !rounded-xl !px-6 !py-2.5 !font-black shadow-lg hover:opacity-90 transition-all">إضافة شحنة يدوياً</Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'نشطة حالياً', value: '42', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Navigation },
          { label: 'بانتظار سائق', value: '18', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock },
          { label: 'تم تسليمها', value: '1,120', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle },
          { label: 'ملغية', value: '24', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between transition-all hover:shadow-md group">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <h4 className={`text-xl font-black ${stat.color} leading-none`}>{stat.value}</h4>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 lg:items-center justify-between bg-gray-50/20">
          <div className="flex bg-gray-100/80 dark:bg-gray-700/50 p-1 rounded-xl self-start">
            {['الكل', 'قيد الانتظار', 'نشط', 'مكتمل', 'ملغي'].map((s) => (
              <Button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`min-w-0 !px-5 !py-2 !text-xs !font-bold !rounded-lg transition-all ${
                  statusFilter === s
                  ? '!bg-white dark:!bg-gray-700 !text-brand-primary shadow-sm'
                  : '!text-gray-400 hover:!text-brand-primary'
                }`}
                sx={{ textTransform: 'none' }}
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="relative group w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث برقم الشحنة، الأطراف، أو المدينة..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
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
                <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors group">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Card */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/10">
          <p className="text-xs text-gray-400 font-bold">عرض {table.getRowModel().rows.length} شحنات من أصل {filteredData.length}</p>
          <div className="flex gap-2">
            <Button size="small" className="!rounded-lg !border !border-gray-100 !text-gray-400 !font-bold">السابق</Button>
            <Button size="small" className="!rounded-lg !border !border-gray-100 !text-gray-400 !font-bold">التالي</Button>
          </div>
        </div>
      </div>

      {/* Global Status Change Dialog */}
      <Dialog 
        open={openStatusDialog} 
        onClose={() => setOpenStatusDialog(false)}
        PaperProps={{ className: "!rounded-3xl !p-2 !shadow-2xl sm:!min-w-[400px]" }}
      >
        <DialogTitle className="!font-black !text-gray-800 !flex !items-center !gap-2">
          <AlertTriangle className="text-orange-500" /> تعديل حالة الشحنة #{selectedShipment?.id}
        </DialogTitle>
        <Divider />
        <DialogContent className="!pt-6">
          <p className="text-sm text-gray-500 font-bold mb-6 italic">هذا تحديث إداري مباشر سيؤثر على تتبع العميل والسائق حالاً.</p>
          <FormControl fullWidth>
            <InputLabel id="status-update-label" className="!font-bold">الحالة الإدارية الجديدة</InputLabel>
            <Select
              labelId="status-update-label"
              value={newStatus}
              label="الحالة الإدارية الجديدة"
              onChange={(e) => setNewStatus(e.target.value)}
              className="!rounded-2xl"
              sx={{ '& .MuiSelect-select': { fontWeight: 800 } }}
            >
              <MenuItem value="قيد الانتظار" className="!font-bold">قيد الانتظار</MenuItem>
              <MenuItem value="نشط" className="!font-bold">نشط (في الطريق)</MenuItem>
              <MenuItem value="مكتمل" className="!font-bold">مكتمل (تم التسليم)</MenuItem>
              <MenuItem value="ملغي" className="!font-bold !text-rose-500">إلغاء قسري (Force Cancel)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="!px-6 !pb-6 !gap-2">
          <Button onClick={() => setOpenStatusDialog(false)} className="!rounded-xl !font-bold !text-gray-400">إلغاء</Button>
          <Button onClick={handleStatusUpdate} variant="contained" className="!bg-brand-primary !rounded-xl !px-6 !py-2.5 !font-black !shadow-none">تحديث الحالة</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Shipment Actions Sub-component
const ShipmentActions = ({ shipment, onOpenStatusDialog }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <div className="flex justify-center">
      <IconButton 
        onClick={(e) => setAnchorEl(e.currentTarget)} 
        size="small" 
        className="!bg-gray-50 dark:!bg-gray-700/50 hover:!bg-brand-primary/10 transition-all font-bold"
      >
        <MoreHorizontal className="w-4 h-4" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          className: "mt-2 !rounded-2xl !shadow-xl !border !border-gray-100 dark:!border-gray-700 p-2 min-w-[200px] !bg-white dark:!bg-gray-800"
        }}
      >
        <MenuItem 
          component={Link}
          to={`/shipments/details/${shipment.id}`}
          onClick={() => setAnchorEl(null)} 
          className="!flex !items-center !gap-3 !rounded-xl !py-2.5 !text-sm !font-black !text-gray-700 dark:!text-gray-200"
        >
          <Eye className="w-4 h-4" /> عرض التفاصيل
        </MenuItem>
        <MenuItem 
          component={Link}
          to={`/shipments/track/${shipment.id}`}
          onClick={() => setAnchorEl(null)} 
          className="!flex !items-center !gap-3 !rounded-xl !py-2.5 !text-sm !font-black !text-blue-600"
        >
          <Navigation className="w-4 h-4 text-blue-500" /> تتبع الشحنة
        </MenuItem>
        <div className="my-2 border-t border-gray-50 dark:border-gray-700 mx-2" />
        <MenuItem 
          onClick={() => {
            onOpenStatusDialog(shipment);
            setAnchorEl(null);
          }} 
          className="!flex !items-center !gap-3 !rounded-xl !py-2.5 !text-sm !font-black !text-orange-600"
        >
          <Edit className="w-4 h-4" /> تعديل الحالة (Admin)
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} className="!flex !items-center !gap-3 !rounded-xl !py-2.5 !text-sm !font-black !text-rose-600">
          <XCircle className="w-4 h-4" /> إلغاء الشحنة
        </MenuItem>
      </Menu>
    </div>
  );
};
