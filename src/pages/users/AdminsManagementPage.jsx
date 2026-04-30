import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus, Search, Shield, Mail,
  Phone, MoreVertical, Edit2, Trash2,
  Filter, ChevronRight, Send,
  Clock, ShieldCheck, ShieldAlert
} from 'lucide-react';
import {
  IconButton, Menu, MenuItem,
  CircularProgress, Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const AdminsManagementPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuOpen = (event, admin) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdmin(null);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.phone_number?.includes(searchQuery)
  );

  const handleResendOTP = async () => {
    if (!selectedAdmin) return;

    const loadingToast = toast.loading('جاري إعادة إرسال الكود...');
    try {
      await userService.resendAdminOTP(selectedAdmin.id);
      toast.success('تم إعادة إرسال كود التفعيل بنجاح');
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToast);
      handleMenuClose();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12" dir="rtl">
      {/* Page Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            إدارة المديرين
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-1">إدارة صلاحيات وحسابات طاقم الإدارة والتحكم في المنصة</p>
        </div>

        <Button
          onClick={() => navigate('/users/add-manager')}
          className="!rounded-xl !px-8 !py-3 !bg-brand-primary !text-white !font-black hover:!opacity-90 shadow-lg shadow-brand-primary/20 transition-all text-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 ml-2" />
          إضافة مدير جديد
        </Button>
      </div>

      {/* Filters & Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/20">
          <div className="relative group w-full lg:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="البحث بالاسم، البريد أو رقم الهاتف..."
              className="w-full pr-11 pl-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all font-medium outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button
              size="small"
              className="!text-gray-600 !font-bold !bg-white dark:!bg-gray-900 !border !border-slate-100 dark:!border-gray-700 !rounded-xl !px-5 !py-2 shadow-sm hover:!bg-gray-50 !text-xs"
              startIcon={<Filter className="w-3.5 h-3.5 ml-1" />}
            >
              تصفية
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-none lg:overflow-visible">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">المدير</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">الصلاحية</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">بيانات التواصل</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">تاريخ الانضمام</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <CircularProgress size={30} className="text-brand-primary" />
                    <p className="mt-4 text-gray-500 font-bold">جاري تحميل قائمة المديرين...</p>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-black">لا يوجد مديرين يطابقون بحثك</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-5 border-b border-gray-50/50 dark:border-gray-800/50">
                      <div className="flex items-center gap-4">

                        <div>
                          <p className="text-sm font-black text-gray-800 dark:text-white leading-tight">{admin.full_name}</p>

                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-50/50 dark:border-gray-800/50">
                      <span className="px-2.5 py-1.5 text-blue-500  dark:text-blue-400 text-[10px] font-black rounded-lg  tracking-widest">
                        {admin.role === 'admin' ? 'مدير نظام (Admin)' :
                          admin.role === 'moderator' ? 'مشرف (Moderator)' :
                            admin.role === 'support' ? 'دعم فني (Support)' : admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-50/50 dark:border-gray-800/50">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5 opacity-60" />
                          <span className="text-[11px] font-bold">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Phone className="w-3.5 h-3.5 opacity-60" />
                          <span className="text-[11px] font-black tracking-tight">{admin.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-50/50 dark:border-gray-800/50 text-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                          {new Date(admin.createDateTime).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold mt-1">
                          {new Date(admin.createDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-50/50 dark:border-gray-800/50 text-center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, admin)}
                        className="hover:!bg-brand-primary/10 hover:!text-brand-primary transition-all"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/10">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">عرض {filteredAdmins.length} من أصل {admins.length} مدير</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="p-2 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 cursor-not-allowed hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          className: "!rounded-[1.25rem] !mt-2 !shadow-2xl !border !border-gray-50 dark:!border-gray-700 !min-w-[180px] dark:!bg-gray-800"
        }}
      >
        <MenuItem onClick={handleResendOTP} className="!text-xs !font-black !gap-3 !py-3 !text-emerald-600 hover:!bg-emerald-50/50 dark:hover:!bg-emerald-900/20">
          <Send className="w-4 h-4" /> إعادة إرسال كود التفعيل
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="!text-xs !font-black !gap-3 !py-3 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-50 dark:hover:!bg-gray-700">
          <Edit2 className="w-4 h-4 text-blue-500" /> تعديل الصلاحيات
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="!text-xs !font-black !gap-3 !py-3 !text-rose-600 hover:!bg-rose-50/50 dark:hover:!bg-rose-900/20">
          <Trash2 className="w-4 h-4" /> إيقاف الحساب
        </MenuItem>
      </Menu>
    </div>
  );
};

const StatCard = ({ index, icon: Icon, label, value, color }) => {
  const colorMap = {
    brand: "bg-brand-primary/10 text-brand-primary border-brand-primary/10",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-[2.25rem] p-7 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 relative overflow-hidden group"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300 ${colorMap[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{value}</p>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 dark:bg-gray-900/20 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
    </motion.div>
  );
};

export default AdminsManagementPage;
