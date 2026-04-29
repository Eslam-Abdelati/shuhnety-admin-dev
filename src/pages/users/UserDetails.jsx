import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, XCircle, AlertCircle,
  User, Mail, Phone, MapPin, Calendar,
  Truck, ShieldCheck, FileText, ExternalLink,
  MessageSquare, History, Ban, UserCheck,
  CreditCard, Award, Zap, Camera, Star
} from 'lucide-react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, CircularProgress } from '@mui/material';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionReason, setActionReason] = useState('');
  const [openActionDialog, setOpenActionDialog] = useState(null); // 'approve' | 'reject' | 'block'

  // Fetch real user details
  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUserDetails(id);

      // Ensure data exists
      const rawData = response?.data || response;

      if (!rawData) {
        toast.error('لم يتم العثور على بيانات المستخدم');
        navigate('/users');
        return;
      }

      // Extract nested objects for easier mapping
      const dDetails = rawData.driverDetails || {};
      const vDetails = (rawData.vehicleDetails && rawData.vehicleDetails.length > 0) ? rawData.vehicleDetails[0] : {};
      const wallet = rawData.wallet || {};

      // Map API data to the component's expected structure
      const mappedUser = {
        ...rawData,
        id: rawData.id,
        name: rawData.full_name || '—',
        email: rawData.email || '—',
        phone: rawData.phone_number || '—',
        birthDate: rawData.birth_date || '—',
        idNumber: dDetails.national_id || '—',
        governorate: (rawData.governorate && typeof rawData.governorate === 'object') ? (rawData.governorate.name_ar || rawData.governorate.name) : rawData.governorate || '—',
        city: (rawData.city && typeof rawData.city === 'object') ? (rawData.city.name_ar || rawData.city.name) : rawData.city || '—',
        address: rawData.address || '—',
        role: rawData.role || 'client',
        status: rawData.status || (rawData.isActive ? 'نشط' : 'موقوف'),
        joinedDate: rawData.createDateTime ? new Date(rawData.createDateTime).toLocaleDateString('ar-EG') : '—',
        avatar: rawData.profile_picture || null,

        // National ID Documents
        idDocs: {
          front: dDetails.forward_nationalId_doc || 'https://via.placeholder.com/600x400?text=ID+Front',
          back: dDetails.back_nationalId_doc || 'https://via.placeholder.com/600x400?text=ID+Back',
        },

        // License Info
        licenseInfo: {
          number: dDetails.license_number || '—',
          expiryDate: dDetails.license_expiry || '—',
          front: dDetails.forward_license_doc || 'https://via.placeholder.com/600x400?text=License+Front',
          back: dDetails.back_license_doc || 'https://via.placeholder.com/600x400?text=License+Back',
        },

        // Vehicle Info
        vehicleInfo: {
          type: vDetails.vehicle_type === 'Other' ? vDetails.other_vehicle_type : vDetails.vehicle_type || '—',
          brand: vDetails.vehicle_brand || '—',
          model: vDetails.model || '—',
          color: vDetails.color || '—',
          plateNumber: vDetails.vehicle_plate_number || '—',
          expiryDate: vDetails.vehicle_license_expiry || '—',
          licenseFront: vDetails.forward_vehicle_license_doc || 'https://via.placeholder.com/600x400?text=Vehicle+License+Front',
          licenseBack: vDetails.back_vehicle_license_doc || 'https://via.placeholder.com/600x400?text=Vehicle+License+Back',
          rating: rawData.averageRating || 0,
          tripsCount: rawData.tripsCount || 0,
          earnings: `${wallet.balance || 0} ${wallet.currency || 'EGP'}`,
          reviewsCount: rawData.reviewsCount || 0,
        }
      };

      setUser(mappedUser);
    } catch (error) {
      console.error('Fetch user details error:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
      navigate('/users');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) fetchUser();
  }, [id, fetchUser]);

  const handleAction = async () => {
    let targetStatus = '';
    if (openActionDialog === 'approve') targetStatus = 'approved';
    else if (openActionDialog === 'reject' || openActionDialog === 'block') targetStatus = 'rejected';
    
    if (!targetStatus) return;

    try {
      setIsLoading(true);
      await userService.updateUserStatus(id, targetStatus, actionReason);
      toast.success(targetStatus === 'approved' ? 'تم توثيق الحساب بنجاح' : 'تم رفض الحساب بنجاح');
      
      setOpenActionDialog(null);
      setActionReason('');
      
      // Refresh user data
      await fetchUser();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'حدث خطأ أثناء تنفيذ العملية');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center gap-4">
        <CircularProgress size={50} className="!text-brand-primary" />
        <p className="text-gray-400 font-bold animate-pulse">جاري جلب بيانات الملف الشخصي...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-[1400px] mx-auto">
      {/* Top Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">
              {user.role === 'driver' ? 'ملف الكابتن' : 
               user.role === 'admin' ? 'ملف المدير' : 'ملف المستخدم'}
            </h2>
            <div className="flex items-center gap-2.5 mt-1">
              <Chip
                label={user.status}
                size="small"
                className={`!font-black !text-[10px] !rounded-lg ${user.status === 'موثق' || user.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' :
                  user.status === 'قيد المراجعة' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                  }`}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">

          {user.role === 'driver' && (
            <Button
              variant="contained"
              className="!rounded-2xl !bg-brand-primary !text-white !font-black !px-8 !py-3 !text-sm hover:!opacity-90"
              onClick={() => setOpenActionDialog('approve')}
              startIcon={<UserCheck className="w-4 h-4 ml-2" />}
            >
              توثيق الحساب
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column - Fixed Side Card */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Identity Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-primary/5 to-transparent" />
            <div className="relative">
              <div className="inline-block p-1 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl mb-6">
                <div className="w-32 h-32 rounded-[1.8rem] bg-brand-primary/10 flex items-center justify-center text-4xl font-black text-brand-primary border-2 border-brand-primary/5 overflow-hidden">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">{user.name}</h3>
              <p className="text-xs text-gray-400 font-bold mb-6">عضو منذ {user.joinedDate}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">{user.role === 'driver' ? 'الرحلات' : 'الشحنات'}</p>
                  <p className="text-lg font-black text-gray-800 dark:text-white">{user.vehicleInfo.tripsCount}</p>
                </div>
                {user.role === 'driver' && (
                  <>
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-900/10 rounded-2xl">
                      <p className="text-[9px] font-black text-amber-600/60 uppercase mb-1">التقييم</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <p className="text-lg font-black text-gray-800 dark:text-white">{user.vehicleInfo.rating}</p>
                      </div>
                    </div>
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                      <p className="text-[9px] font-black text-emerald-600/60 uppercase mb-1">الأرباح</p>
                      <p className="text-lg font-black text-gray-800 dark:text-white">{user.vehicleInfo.earnings}</p>
                    </div>
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl">
                      <p className="text-[9px] font-black text-blue-600/60 uppercase mb-1">التقييمات</p>
                      <p className="text-lg font-black text-gray-800 dark:text-white">{user.vehicleInfo.reviewsCount}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-3">
              <Zap className="w-5 h-5 text-brand-primary" />
              أداء {user.role === 'driver' ? 'السائق' : 'المستخدم'}
            </h4>
            <div className="space-y-5">
              <StatItem label="نسبة القبول" value="98%" progress={98} color="emerald" />
              <StatItem label="الالتزام بالمواعيد" value="92%" progress={92} color="brand" />
              <StatItem label="إلغاء الرحلات" value="2%" progress={2} color="rose" />
            </div>
          </div>

          {/* Admin Actions Container */}
          <div className="bg-rose-50/50 dark:bg-rose-900/5 rounded-[2.5rem] border border-rose-100/50 dark:border-rose-900/20 p-8">
            <h4 className="font-black text-rose-600 mb-6 flex items-center gap-3">
              <Ban className="w-5 h-5" />
              منطقة الإدارة
            </h4>
            <div className="space-y-5">
              <Button
                fullWidth
                className="!py-3 !mb-2 !rounded-2xl !bg-white dark:!bg-gray-800 !text-orange-600 !font-black hover:!bg-orange-50 !border !border-orange-100 !shadow-none"
                onClick={() => setOpenActionDialog('reject')}
              >
                رفض/تعليق الحساب
              </Button>
              <Button
                fullWidth
                className="!py-3 !rounded-2xl !bg-rose-600 !text-white !font-black hover:!bg-rose-700 !shadow-lg shadow-rose-600/20"
                onClick={() => setOpenActionDialog('block')}
              >
                حظر الحساب نهائياً
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Main Data Sections */}
        <div className="lg:col-span-8 space-y-8">

          {/* 1. Basic Information */}
          <SectionCard icon={User} title="البيانات الشخصية">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoBox icon={User} label="الاسم الكامل" value={user.name} />
              <InfoBox icon={Mail} label="البريد الإلكتروني" value={user.email} />
              <InfoBox icon={Phone} label="رقم الجوال" value={user.phone} />
              <InfoBox icon={Calendar} label="تاريخ الميلاد" value={user.birthDate} />
              <InfoBox icon={CreditCard} label="رقم البطاقة الشخصية" value={user.idNumber} />
              <InfoBox
                icon={MapPin}
                label="العنوان"
                value={`${user.governorate} - ${user.city} - ${user.address}`}
                fullWidth
              />
            </div>
          </SectionCard>

          {/* 2. Identity Documents */}
          {user.role === 'driver' && (
            <>
              <SectionCard icon={Camera} title="مستندات الهوية (البطاقة)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ImagePreview label="وجه البطاقة" src={user.idDocs.front} />
                  <ImagePreview label="ظهر البطاقة" src={user.idDocs.back} />
                </div>
              </SectionCard>

              {/* 3. License Information */}
              <SectionCard icon={Award} title="بيانات رخصة القيادة">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <InfoBox icon={FileText} label="رقم الرخصة" value={user.licenseInfo.number} />
                  <InfoBox icon={Calendar} label="تاريخ انتهاء الرخصة" value={user.licenseInfo.expiryDate} highlight />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ImagePreview label="وجه الرخصة" src={user.licenseInfo.front} />
                  <ImagePreview label="ظهر الرخصة" src={user.licenseInfo.back} />
                </div>
              </SectionCard>

              {/* 4. Vehicle Information */}
              <SectionCard icon={Truck} title="بيانات المركبة">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <InfoBox icon={Truck} label="نوع المركبة" value={user.vehicleInfo.type} />
                  <InfoBox icon={Truck} label="الماركة" value={user.vehicleInfo.brand} />
                  <InfoBox icon={Truck} label="الموديل" value={user.vehicleInfo.model} />
                  <InfoBox icon={Truck} label="اللون" value={user.vehicleInfo.color} />
                  <InfoBox icon={ShieldCheck} label="رقم اللوحة" value={user.vehicleInfo.plateNumber} />
                  <InfoBox icon={Calendar} label="تاريخ انتهاء رخصة المركبة" value={user.vehicleInfo.expiryDate} highlight />
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                  <h5 className="text-xs font-black text-gray-400 uppercase mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    رخصة المركبة
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ImagePreview label="وجه رخصة المركبة" src={user.vehicleInfo.licenseFront} />
                    <ImagePreview label="ظهر رخصة المركبة" src={user.vehicleInfo.licenseBack} />
                  </div>
                </div>
              </SectionCard>
            </>
          )}

        </div>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={openActionDialog !== null}
        onClose={() => setOpenActionDialog(null)}
        PaperProps={{ className: "!rounded-[2.5rem] !p-4 !shadow-2xl sm:!min-w-[500px] !overflow-hidden" }}
      >
        <DialogTitle className="!font-black !text-gray-800 !flex !items-center !gap-3 !text-xl">
          {openActionDialog === 'approve' && <><div className="p-3 bg-emerald-50 rounded-2xl"><UserCheck className="text-emerald-500" /></div> توثيق واعتماد الحساب</>}
          {openActionDialog === 'reject' && <><div className="p-3 bg-orange-50 rounded-2xl"><XCircle className="text-orange-500" /></div> رفض المستندات المقدمة</>}
          {openActionDialog === 'block' && <><div className="p-3 bg-rose-50 rounded-2xl"><Ban className="text-rose-500" /></div> حظر الحساب بشكل نهائي</>}
        </DialogTitle>
        <Divider />
        <DialogContent className="!py-8">
          <p className="text-sm text-gray-500 font-bold mb-4">يرجى كتابة ملاحظاتك للمستخدم (سيتم إرسال تنبيه فوري له):</p>
          <TextField
            autoFocus
            multiline
            rows={5}
            fullWidth
            placeholder={
              openActionDialog === 'approve' ? 'مبارك لك، تم تفعيل حسابك في منصة شحنتي. يمكنك البدء في استخدام كافة ميزات المنصة الآن.' :
                openActionDialog === 'reject' ? 'يرجى مراجعة البيانات المدخلة وإعادة المحاولة.' :
                  'تم حظر الحساب بسبب مخالفة سياسات المنصة.'
            }
            variant="outlined"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "1.5rem",
                "& fieldset": { borderColor: "#f1f5f9" },
                "&:hover fieldset": { borderColor: "#e2e8f0" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              }
            }}
          />
        </DialogContent>
        <DialogActions className="!px-8 !pb-8 !gap-4">
          <Button onClick={() => setOpenActionDialog(null)} className="!rounded-2xl !font-black !text-gray-400 !px-6">تراجع</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            className={`!rounded-2xl !px-10 !py-3.5 !font-black !shadow-lg ${openActionDialog === 'approve' ? '!bg-emerald-500 !shadow-emerald-500/20' :
              openActionDialog === 'reject' ? '!bg-orange-500 !shadow-orange-500/20' : '!bg-rose-600 !shadow-rose-600/20'
              }`}
          >
            تأكيد العملية
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// UI Components
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/20 flex items-center gap-3">
      <div className="p-2 bg-brand-primary/10 rounded-lg">
        <Icon className="w-4 h-4 text-brand-primary" />
      </div>
      <h4 className="font-black text-lg text-gray-800 dark:text-white tracking-tight">{title}</h4>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const InfoBox = ({ icon: Icon, label, value, highlight, fullWidth }) => (
  <div className={`flex items-start gap-4 ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-sm ${highlight ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-gray-50 dark:bg-gray-900/50 text-gray-400 border border-gray-100 dark:border-gray-700'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black tracking-tight ${highlight ? 'text-orange-600' : 'text-gray-800 dark:text-white'}`}>
        {value && typeof value === 'object' ? (value.name_ar || value.name || JSON.stringify(value)) : (value || '—')}
      </p>
    </div>
  </div>
);

const ImagePreview = ({ label, src }) => (
  <div className="space-y-3 group">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{label}</p>
    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-900 group-hover:border-brand-primary transition-all duration-300">
      <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
        <button className="p-3 bg-white rounded-2xl text-gray-800 font-black text-xs flex items-center gap-2 shadow-xl active:scale-95 transition-transform">
          <ExternalLink className="w-4 h-4" /> عرض بحجم كامل
        </button>
      </div>
    </div>
  </div>
);

const StatItem = ({ label, value, progress, color }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-end">
      <p className="text-xs font-black text-gray-400 uppercase">{label}</p>
      <p className={`text-sm font-black text-${color}-600`}>{value}</p>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 bg-${color === 'brand' ? 'brand-primary' : color + '-500'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
