import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  Search, Eye, Edit, Trash2, UserX, UserCheck, 
  MapPin, Shield, Calendar, Mail, 
  MoreHorizontal, Download, Filter,
  Users, User, Truck, Building, Star,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button, Menu, MenuItem, IconButton } from '@mui/material';

// Mock Data with specific fields for Drivers
const initialUsers = [
  { id: 1, name: 'أحمد علي', email: 'ahmed@example.com', role: 'customer', status: 'نشط', joinedDate: '2024-01-15', location: 'القاهرة' },
  { id: 2, name: 'أحمد محمود', email: 'ahmed@shuhnety.com', role: 'driver', status: 'موثق', joinedDate: '2024-03-20', location: 'القاهرة', vehicle: 'تريلا جامبو', rating: 4.8 },
  { id: 4, name: 'سارة محمد', email: 'sara@example.com', role: 'driver', status: 'موثق', joinedDate: '2024-02-10', location: 'الإسكندرية', vehicle: 'نصف نقل', rating: 4.2 },
  { id: 3, name: 'شركة النيل للنقل', email: 'nile@example.com', role: 'company', status: 'نشط', joinedDate: '2023-11-20', location: 'الجيزة' },
  { id: 5, name: 'محمود حسن', email: 'mahmoud@example.com', role: 'customer', status: 'محظور', joinedDate: '2024-03-01', location: 'المنصورة' },
  { id: 6, name: 'إبراهيم سعيد', email: 'ibrahim@example.com', role: 'driver', status: 'موثق', joinedDate: '2024-01-05', location: 'طنطا', vehicle: 'ميكروباص نقل', rating: 4.9 },
  { id: 7, name: 'شركة البركة اللوجستية', email: 'baraka@example.com', role: 'company', status: 'نشط', joinedDate: '2023-12-15', location: 'أسيوط' },
  { id: 8, name: 'على إمام', email: 'ali@example.com', role: 'driver', status: 'قيد المراجعة', joinedDate: '2024-03-10', location: 'السويس', vehicle: 'عربة ربع نقل', rating: 3.5 },
];

export const UserManagement = ({ forcedRole }) => {
  const { role: routeRole } = useParams();
  const activeRole = forcedRole || routeRole || 'all';
  
  const [data, setData] = useState(initialUsers);
  const [globalFilter, setGlobalFilter] = useState('');

  // Labels for UI
  const roleLabels = {
    'all': 'إدارة كافة المستخدمين',
    'customer': 'إدارة العملاء',
    'driver': 'إدارة السائقين',
    'company': 'إدارة شركات النقل',
  };

  // Table Columns
  const columns = useMemo(
    () => {
      const baseColumns = [
        {
          accessorKey: 'name',
          header: activeRole === 'driver' ? 'الكابتن' : 'المستخدم',
          cell: (info) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary text-sm shadow-sm">
                {info.getValue().charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{info.getValue()}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{info.row.original.email}</p>
              </div>
            </div>
          ),
        },
      ];

      if (activeRole === 'driver') {
        baseColumns.push(
          {
            accessorKey: 'vehicle',
            header: 'المركبة',
            cell: (info) => <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{info.getValue() || 'غير محدد'}</span>,
          },
          {
            accessorKey: 'rating',
            header: 'التقييم',
            cell: (info) => (
              <div className="flex items-center gap-1.5 font-black text-sm text-gray-700 dark:text-gray-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {info.getValue() || '0.0'}
              </div>
            ),
          }
        );
      } else {
        baseColumns.push(
          {
            accessorKey: 'role',
            header: 'نوع الحساب',
            cell: (info) => {
              const role = info.getValue();
              const roleMap = { 'customer': 'عميل', 'driver': 'سائق', 'company': 'شركة' };
              return (
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {roleMap[role] || role}
                </span>
              );
            },
          }
        );
      }

      baseColumns.push(
        {
          accessorKey: 'status',
          header: 'الحالة',
          cell: (info) => {
            const status = info.getValue();
            const colors = {
              'نشط': 'bg-emerald-50 text-emerald-600',
              'موثق': 'bg-emerald-50 text-emerald-600 px-3',
              'محظور': 'bg-rose-50 text-rose-600',
              'موقوف': 'bg-rose-50 text-rose-600',
              'قيد المراجعة': 'bg-orange-50 text-orange-600',
            };
            return (
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${colors[status] || 'bg-gray-100 text-gray-500'}`}>
                {status}
              </span>
            );
          },
        },
        {
          accessorKey: 'joinedDate',
          header: 'التاريخ',
          cell: (info) => <span className="text-xs text-gray-400 font-bold">{info.getValue()}</span>,
        },
        {
          id: 'actions',
          header: 'الإجراءات',
          cell: ({ row }) => <UserActions user={row.original} />,
        }
      );

      return baseColumns;
    },
    [activeRole]
  );

  // Filters logic
  const filteredData = useMemo(() => {
    let result = data;
    if (activeRole !== 'all') {
      result = result.filter(u => u.role === activeRole);
    }
    return result;
  }, [data, activeRole]);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{roleLabels[activeRole]}</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">إدارة شاملة لكافة {roleLabels[activeRole]} المسجلين</p>
        </div>
        <Button className="!rounded-xl !px-6 !py-2.5 !bg-brand-primary !text-white !font-bold hover:!opacity-90 shadow-sm transition-all">
          إضافة {activeRole === 'driver' ? 'سائق' : activeRole === 'company' ? 'شركة' : 'عميل'}
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/20 dark:bg-gray-800/20">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="ابحث هنا..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-11 pl-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            <Button size="small" className="!text-gray-500 !font-bold" startIcon={<Download className="w-4 h-4" />}>تصدير CSV</Button>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50/50 dark:bg-gray-900/30">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="px-6 py-20 text-center text-gray-400 font-bold">
                    لا توجد بيانات متاحة حالياً حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/10">
          <p className="text-xs text-gray-400 font-bold">عرض {table.getRowModel().rows.length} من أصل {filteredData.length}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="!min-w-0 !p-2 !rounded-lg !border !border-gray-200 dark:!border-gray-700 !text-gray-400 hover:!text-brand-primary transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="!min-w-0 !p-2 !rounded-lg !border !border-gray-200 dark:!border-gray-700 !text-gray-400 hover:!text-brand-primary transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserActions = ({ user }) => (
  <div className="flex justify-center gap-1">
    <IconButton 
      component={Link}
      to={`/admin/users/details/${user.id}`}
      size="small" 
      className="hover:!text-brand-primary hover:!bg-brand-primary/10 transition-all font-bold"
    >
      <Eye className="w-4 h-4" />
    </IconButton>
    <IconButton size="small" className="hover:!text-blue-600 hover:!bg-blue-50 transition-all"><Edit className="w-4 h-4" /></IconButton>
    <IconButton size="small" className="hover:!text-rose-600 hover:!bg-rose-50 transition-all"><Trash2 className="w-4 h-4" /></IconButton>
  </div>
);
