import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, XCircle, AlertCircle, 
  User, Mail, Phone, MapPin, Calendar, 
  Truck, ShieldCheck, FileText, ExternalLink,
  MessageSquare, History, Ban, UserCheck
} from 'lucide-react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider } from '@mui/material';

// Mock Data for a single Driver
const mockUserDetails = {
  id: 2,
  name: 'أحمد محمود',
  email: 'ahmed@shuhnety.com',
  phone: '01012345678',
  role: 'driver',
  status: 'قيد المراجعة',
  location: 'القاهرة، مصر',
  joinedDate: '2024-03-20',
  avatar: null,
  driverInfo: {
    vehicleType: 'تريلا جامبو',
    vehicleNumber: 'أ ب ج 1234',
    licenseNumber: 'L-987654321',
    rating: 4.8,
    tripsCount: 156,
  },
  documents: [
    { id: 1, name: 'رخصة القيادة', status: 'تم الرفع', type: 'image' },
    { id: 2, name: 'البطاقة الشخصية', status: 'تم الرفع', type: 'image' },
    { id: 3, name: 'فحص المركبة', status: 'منتهي', type: 'pdf' },
  ]
};

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUserDetails);
  const [actionReason, setActionReason] = useState('');
  const [openActionDialog, setOpenActionDialog] = useState(null); // 'approve' | 'reject' | 'block'

  const handleAction = () => {
    // Logic to update status and record reason
    console.log(`Action: ${openActionDialog}, Reason: ${actionReason}`);
    setOpenActionDialog(null);
    setActionReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
          >
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">تفاصيل الحساب</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400 font-bold">معرف المستخدم: #{id}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <Chip 
                label={user.status} 
                size="small" 
                className={`!font-bold !text-[10px] ${
                  user.status === 'موثق' ? 'bg-emerald-50 text-emerald-600' : 
                  user.status === 'قيد المراجعة' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outlined" 
            className="!rounded-xl !border-gray-200 !text-gray-500 hover:!bg-gray-50 !font-bold"
            startIcon={<MessageSquare className="w-4 h-4 ml-1" />}
          >
            إرسال رسالة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info & Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-3xl font-black text-brand-primary border-4 border-white dark:border-gray-800 shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full p-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white leading-tight">{user.name}</h3>
            <p className="text-sm text-brand-primary font-bold mt-1 uppercase tracking-wider">{user.role === 'driver' ? 'سائق محترف' : 'عميل شحنتي'}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-50 dark:border-gray-700">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">الرحلات</p>
                <p className="text-lg font-black text-gray-800 dark:text-white">{user.driverInfo.tripsCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">التقييم</p>
                <p className="text-lg font-black text-gray-800 dark:text-white">★{user.driverInfo.rating}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-primary" />
              إجراءات الإدارة
            </h4>
            <div className="space-y-3">
              <Button 
                fullWidth 
                className="!py-3 !rounded-xl !bg-emerald-500 !text-white !font-bold hover:!bg-emerald-600 shadow-md"
                onClick={() => setOpenActionDialog('approve')}
                startIcon={<UserCheck className="w-5 h-5 ml-2" />}
              >
                تفعيل وتوثيق الحساب
              </Button>
              <Button 
                fullWidth 
                className="!py-3 !rounded-xl !bg-orange-50 !text-orange-600 !font-bold hover:!bg-orange-100"
                onClick={() => setOpenActionDialog('reject')}
                startIcon={<XCircle className="w-5 h-5 ml-2" />}
              >
                رفض البيانات (طلب تعديل)
              </Button>
              <Button 
                fullWidth 
                className="!py-3 !rounded-xl !bg-rose-50 !text-rose-600 !font-bold hover:!bg-rose-100"
                onClick={() => setOpenActionDialog('block')}
                startIcon={<Ban className="w-5 h-5 ml-2" />}
              >
                حظر المستخدم نهائياً
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Sections */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <h4 className="font-black text-gray-800 dark:text-white">المعلومات الأساسية</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoRow icon={Mail} label="البريد الإلكتروني" value={user.email} />
              <InfoRow icon={Phone} label="رقم الجوال" value={user.phone} />
              <InfoRow icon={MapPin} label="الموقع" value={user.location} />
              <InfoRow icon={Calendar} label="تاريخ الانضمام" value={user.joinedDate} />
              {user.role === 'driver' && (
                <>
                  <InfoRow icon={Truck} label="نوع المركبة" value={user.driverInfo.vehicleType} />
                  <InfoRow icon={ShieldCheck} label="رقم اللوحة" value={user.driverInfo.vehicleNumber} />
                </>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-400" />
                <h4 className="font-black text-gray-800 dark:text-white">مراجعة المستندات</h4>
              </div>
              <span className="text-xs font-bold text-gray-400">تحتاج إلى مراجعة: 3</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between group hover:border-brand-primary transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-gray-400 group-hover:text-brand-primary transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase leading-none">{doc.status}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-brand-primary transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog 
        open={openActionDialog !== null} 
        onClose={() => setOpenActionDialog(null)}
        PaperProps={{ className: "!rounded-3xl !p-2 !shadow-2xl sm:!min-w-[450px]" }}
      >
        <DialogTitle className="!font-black !text-gray-800 !flex !items-center !gap-2">
          {openActionDialog === 'approve' && <><UserCheck className="text-emerald-500" /> تفعيل الحساب</>}
          {openActionDialog === 'reject' && <><XCircle className="text-orange-500" /> رفض البيانات</>}
          {openActionDialog === 'block' && <><Ban className="text-rose-500" /> حظر المستخدم</>}
        </DialogTitle>
        <Divider />
        <DialogContent className="!py-6">
          <p className="text-sm text-gray-500 font-bold mb-4">يرجى توضيح سبب هذا الإجراء (سيتم إرساله للمستخدم):</p>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder={
              openActionDialog === 'approve' ? 'أهلاً بك في شحنتي، تم تفعيل حسابك بنجاح...' :
              openActionDialog === 'reject' ? 'لم تكن صورة الرخصة واضحة، يرجى إعادة الرفع...' :
              'مخالفة شروط الاستخدام أو بلاغات متكررة...'
            }
            variant="outlined"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            InputProps={{ className: "!rounded-2xl" }}
          />
        </DialogContent>
        <DialogActions className="!px-6 !pb-6 !gap-2">
          <Button onClick={() => setOpenActionDialog(null)} className="!rounded-xl !font-bold !text-gray-400">إلغاء</Button>
          <Button 
            onClick={handleAction} 
            variant="contained" 
            className={`!rounded-xl !px-6 !py-2.5 !font-bold !shadow-none ${
              openActionDialog === 'approve' ? '!bg-emerald-500' :
              openActionDialog === 'reject' ? '!bg-orange-500' : '!bg-rose-500'
            }`}
          >
            تأكيد الإجراء
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">{label}</p>
      <p className="text-sm font-black text-gray-800 dark:text-white mt-1.5 leading-none">{value}</p>
    </div>
  </div>
);
