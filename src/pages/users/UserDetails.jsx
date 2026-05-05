import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, XCircle, AlertCircle,
  User, Mail, Phone, MapPin, Calendar,
  Truck, ShieldCheck, FileText, ExternalLink,
  MessageSquare, History, Ban, UserCheck,
  CreditCard, Award, Zap, Camera, Star, Printer,
  Trash2, PowerOff
} from 'lucide-react';
import { Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, CircularProgress } from '@mui/material';
import { Edit } from 'lucide-react';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';
import { getStatusConfig } from '../../utils/userConstants';

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
    else if (openActionDialog === 'reject') targetStatus = 'rejected';
    else if (openActionDialog === 'disable') targetStatus = 'blocked';
    else if (openActionDialog === 'delete') targetStatus = 'deleted';

    if (!targetStatus) return;

    try {
      setIsLoading(true);

      if (openActionDialog === 'disable') {
        await userService.suspendUser(id);
        toast.success('تم تعطيل الحساب بنجاح');
      } else {
        await userService.updateUserStatus(id, targetStatus, actionReason);
        toast.success(
          targetStatus === 'approved' ? 'تم توثيق الحساب بنجاح' :
            targetStatus === 'deleted' ? 'تم حذف الحساب بنجاح' : 'تم رفض الحساب بنجاح'
        );
      }

      setOpenActionDialog(null);
      setActionReason('');

      // Refresh user data
      await fetchUser();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || 'حدث خطأ أثناء تنفيذ العملية');
    }
  };

  const calculateRemainingDays = (dateStr) => {
    if (!dateStr || dateStr === '—') return null;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(dateStr);
      expiry.setHours(0, 0, 0, 0);

      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  const renderExpiryValue = (dateStr) => {
    const days = calculateRemainingDays(dateStr);
    if (days === null) return dateStr;

    let statusText = '';
    let statusColor = '';

    if (days < 0) {
      statusText = `(منتهية منذ ${Math.abs(days)} يوم)`;
      statusColor = 'text-rose-600';
    } else if (days === 0) {
      statusText = '(تنتهي اليوم)';
      statusColor = 'text-amber-600';
    } else {
      statusText = `(متبقي ${days} يوم)`;
      statusColor = 'text-emerald-600';
    }

    return (
      <div className="flex items-center gap-2">
        <span>{dateStr}</span>
        <span className={`text-[10px] font-bold ${statusColor} whitespace-nowrap`}>{statusText}</span>
      </div>
    );
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-[1400px] mx-auto print-container">
      {/* 1. Main UI - Hidden during print */}
      <div className="space-y-8 no-print">
        {/* Top Navigation & Header - Navbar Style */}
        <div className="top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700 rounded-[2rem] p-4 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 top-navbar">
          <div className="flex items-center gap-4 px-2">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-gray-800 dark:text-white leading-tight">
                  {user.role === 'driver' ? 'ملف الكابتن' :
                    user.role === 'admin' ? 'ملف المدير' : 'ملف المستخدم'}
                </h2>
                {(() => {
                  const config = getStatusConfig(user.status);
                  const StatusIcon = config.icon;
                  return (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black ${config.color}`}>
                      <StatusIcon className={`w-3 h-3 ${config.iconColor}`} />
                      {config.label}
                    </div>
                  );
                })()}
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{user.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Print Button */}
            <Button
              size="small"
              onClick={() => window.print()}
              className="!text-gray-600 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 transition-all duration-300 !px-2 !min-w-0"
              startIcon={<Printer className="w-3.5 h-3.5" />}
            >
              طباعة
            </Button>

            {/* Edit Button - No Background */}
            <Button
              size="small"
              className="!text-blue-600 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 transition-all duration-300 !px-2 !min-w-0"
              startIcon={<Edit className="w-3.5 h-3.5" />}
            >
              تعديل
            </Button>

            <Button
              size="small"
              className="!text-emerald-600 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 !px-2 !min-w-0"
              onClick={() => setOpenActionDialog('approve')}
              disabled={user.status === 'active' || user.status === 'approved' || user.status === 'suspended'}
              startIcon={<UserCheck className="w-3.5 h-3.5" />}
            >
              توثيق
            </Button>

            <Button
              size="small"
              className="!text-orange-500 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 !px-2 !min-w-0"
              onClick={() => setOpenActionDialog('reject')}
              disabled={user.status === 'active' || user.status === 'approved' || user.status === 'rejected' || user.status === 'suspended'}
              startIcon={<AlertCircle className="w-3.5 h-3.5" />}
            >
              رفض
            </Button>

            <Button
              size="small"
              className="!text-amber-600 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 disabled:opacity-30 transition-all duration-300 !px-2 !min-w-0"
              onClick={() => setOpenActionDialog('disable')}
              disabled={user.status === 'suspended'}
              startIcon={<PowerOff className="w-3.5 h-3.5" />}
            >
              تعطيل
            </Button>

            <Button
              size="small"
              className="!text-rose-600 !font-black !text-[11px] !bg-transparent hover:!bg-transparent hover:opacity-75 transition-all duration-300 !px-2 !min-w-0"
              onClick={() => setOpenActionDialog('delete')}
              startIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              حذف
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* 1. Main Identity Card - Full Width Header */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-primary/5 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="p-1 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl">
                <div className="w-32 h-32 rounded-[1.8rem] bg-brand-primary/10 flex items-center justify-center text-4xl font-black text-brand-primary border-2 border-brand-primary/5 overflow-hidden">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 text-center md:text-right">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-400 font-bold">تاريخ الإنضمام : {user.joinedDate}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto md:mr-0">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">{user.role === 'driver' ? 'الرحلات' : 'الشحنات'}</p>
                    <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{user.vehicleInfo.tripsCount}</p>
                  </div>
                  {user.role === 'driver' && (
                    <>
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50">
                        <p className="text-[10px] font-black text-amber-600/60 uppercase mb-1 tracking-widest">التقييم</p>
                        <div className="flex items-center justify-center md:justify-start gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{user.vehicleInfo.rating}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-blue-600/60 uppercase mb-1 tracking-widest">عدد التقيمات</p>
                        <p className="text-xl font-black text-gray-800 dark:text-white leading-none">{user.vehicleInfo.reviewsCount}</p>
                      </div>

                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase mb-1 tracking-widest">الأرباح</p>
                        <p className="text-xl font-black text-gray-800 dark:text-white leading-none font-mono">{user.vehicleInfo.earnings}</p>
                      </div>

                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h4 className="font-black text-gray-800 dark:text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-brand-primary" />
              </div>
              مؤشرات الأداء {user.role === 'driver' ? 'للكابتن' : 'للمستخدم'}
            </h4>
            <div className="flex flex-col gap-8 max-w-4xl">
              <StatItem label="نسبة القبول" value="98%" progress={98} color="emerald" />
              <StatItem label="الالتزام بالمواعيد" value="92%" progress={92} color="brand" />
              <StatItem label="إلغاء الرحلات" value="2%" progress={2} color="rose" />
            </div>
          </div>

          {/* 3. Basic Information */}
          <SectionCard icon={User} title="البيانات الشخصية">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <InfoBox icon={User} label="الاسم الكامل" value={user.name} />
              <InfoBox icon={Mail} label="البريد الإلكتروني" value={user.email} />
              <InfoBox icon={Phone} label="رقم الجوال" value={user.phone} />
              <InfoBox icon={Calendar} label="تاريخ الميلاد" value={user.birthDate} />
              <InfoBox icon={CreditCard} label="رقم البطاقة الشخصية" value={user.idNumber} />
              <InfoBox
                icon={ShieldCheck}
                label="حالة الحساب"
                value={(() => {
                  const config = getStatusConfig(user.status);
                  const StatusIcon = config.icon;
                  return (
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${config.color}`}>
                      <StatusIcon className={`w-4 h-4 ${config.iconColor}`} />
                      {config.label}
                    </div>
                  );
                })()}
              />
              <InfoBox
                icon={MapPin}
                label="العنوان"
                value={`${user.governorate} - ${user.city} - ${user.address}`}
                fullWidth
              />
              {user.rejectReason && (
                <InfoBox
                  icon={AlertCircle}
                  label="سبب الرفض"
                  value={user.rejectReason}
                  highlight
                  fullWidth
                />
              )}
            </div>
          </SectionCard>

          {/* 4. Driver Specific Sections */}
          {user.role === 'driver' && (
            <>
              <SectionCard icon={Camera} title="مستندات الهوية (البطاقة)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ImagePreview label="وجه البطاقة" src={user.idDocs.front} />
                  <ImagePreview label="ظهر البطاقة" src={user.idDocs.back} />
                </div>
              </SectionCard>

              <SectionCard icon={Award} title="بيانات رخصة القيادة">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
                  <InfoBox icon={FileText} label="رقم الرخصة" value={user.licenseInfo.number} />
                  <InfoBox icon={Calendar} label="تاريخ انتهاء الرخصة" value={renderExpiryValue(user.licenseInfo.expiryDate)} highlight />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ImagePreview label="وجه الرخصة" src={user.licenseInfo.front} />
                  <ImagePreview label="ظهر الرخصة" src={user.licenseInfo.back} />
                </div>
              </SectionCard>

              <SectionCard icon={Truck} title="بيانات المركبة">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
                  <InfoBox icon={Truck} label="نوع المركبة" value={user.vehicleInfo.type} />
                  <InfoBox icon={Truck} label="الماركة والموديل" value={`${user.vehicleInfo.brand} - ${user.vehicleInfo.model}`} />
                  <InfoBox icon={ShieldCheck} label="رقم اللوحة" value={user.vehicleInfo.plateNumber} />
                  <InfoBox icon={Truck} label="اللون" value={user.vehicleInfo.color} />
                  <InfoBox icon={Calendar} label="تاريخ انتهاء رخصة المركبة" value={renderExpiryValue(user.vehicleInfo.expiryDate)} highlight />
                </div>
                <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                  <h5 className="text-[11px] font-black text-gray-400 uppercase mb-8 flex items-center gap-2 tracking-widest">
                    <FileText className="w-4 h-4" />
                    صور رخصة المركبة
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ImagePreview label="وجه رخصة المركبة" src={user.vehicleInfo.licenseFront} />
                    <ImagePreview label="ظهر رخصة المركبة" src={user.vehicleInfo.licenseBack} />
                  </div>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>

      {/* 2. Dedicated Printable Layout - Only visible in print */}
      <div className="hidden print:block font-serif text-black printable-content" dir="rtl">
        <style>
          {`
            @media print {
              /* Hide EVERYTHING first */
              body * {
                visibility: hidden !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              /* Show ONLY the printable content and its children */
              .printable-content, .printable-content * {
                visibility: visible !important;
              }
              
              /* Position the printable content at the very top of the page */
              .printable-content {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
              }

              /* Hide the main UI container and other non-print elements */
              .no-print, nav, aside, header, footer, button, .top-navbar, .sidebar, .navbar {
                display: none !important;
              }

              body { background: white !important; margin: 0 !important; }
              @page { margin: 0.5cm; size: A4; }
              
              .official-header { display: flex; align-items: center; justify-content: center; gap: 20px; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 10px; }
              .official-photo { width: 70px; height: 85px; border: 1px solid black; margin: 0; object-fit: cover; }
              .header-text { text-align: right; }
              .official-title { font-size: 16pt; font-weight: bold; margin: 0; }
              
              .stats-metrics-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
              
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid black; }
              .stat-box { border: 1px solid black; padding: 2px; text-align: center; }
              .stat-label { font-size: 8pt; font-weight: bold; border-bottom: 1px solid black; }
              .stat-value { font-size: 10pt; font-weight: bold; }
              
              .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
              .metric-box { border: 1px solid #ddd; padding: 4px; text-align: center; border-radius: 4px; }
              .metric-label { font-size: 8pt; font-weight: bold; }
              .metric-value { font-size: 11pt; font-weight: black; }
              
              .section-header { background: #f0f0f0; border: 1px solid black; padding: 2px 10px; font-weight: bold; font-size: 11pt; margin: 8px 0 4px; }
              .data-row { display: flex; border-bottom: 1px dotted #999; margin-bottom: 3px; padding-bottom: 1px; }
              .data-label { font-weight: bold; min-width: 130px; font-size: 9pt; }
              .data-value { flex: 1; font-size: 9pt; }
              
              .doc-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 5px; }
              .doc-img-container { border: 1px solid black; padding: 2px; break-inside: avoid; }
              .doc-img-label { font-size: 7pt; font-weight: bold; margin-bottom: 2px; text-align: center; }
              .doc-img { width: 100%; height: 90px; object-fit: contain; background: #fafafa; }
              
              .footer-print { margin-top: 15px; border-top: 1px solid black; padding-top: 5px; text-align: center; font-size: 7pt; font-style: italic; }
            }
          `}
        </style>

        {/* Header Section */}
        <div className="official-header">
          {user.avatar && <img src={user.avatar} alt="" className="official-photo" />}
          <div className="header-text">
            <div className="official-title">{user.name}</div>
            <div className="text-sm font-bold">إستمارة بيانات {user.role === 'driver' ? 'كابتن' : 'مستخدم'}</div>
            <div className="text-xs">تاريخ الإنضمام : {user.joinedDate} | الحالة: {getStatusConfig(user.status).label}</div>
          </div>
        </div>

        {/* Stats and Metrics Combined Row */}
        <div className="stats-metrics-container">
          <div className="stats-grid">
            <div className="stat-box"><div className="stat-label">الرحلات</div><div className="stat-value">{user.vehicleInfo.tripsCount}</div></div>
            <div className="stat-box"><div className="stat-label">التقييم</div><div className="stat-value">{user.vehicleInfo.rating || '0.00'}</div></div>
            <div className="stat-box"><div className="stat-label">التقييمات</div><div className="stat-value">{user.vehicleInfo.reviewsCount}</div></div>
            <div className="stat-box"><div className="stat-label">الأرباح</div><div className="stat-value">{user.vehicleInfo.earnings}</div></div>
          </div>
          <div className="metrics-grid">
            <div className="metric-box"><div className="metric-label">القبول</div><div className="metric-value">98%</div></div>
            <div className="metric-box"><div className="metric-label">الالتزام</div><div className="metric-value">92%</div></div>
            <div className="metric-box"><div className="metric-label">الإلغاء</div><div className="metric-value">2%</div></div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="section-header">البيانات الشخصية</div>
        <div className="grid grid-cols-1 gap-0">
          <div className="data-row"><div className="data-label">الاسم الكامل:</div><div className="data-value">{user.name}</div></div>
          <div className="data-row"><div className="data-label">البريد الإلكتروني:</div><div className="data-value">{user.email}</div></div>
          <div className="data-row"><div className="data-label">رقم الجوال:</div><div className="data-value">{user.phone}</div></div>
          <div className="data-row"><div className="data-label">تاريخ الميلاد:</div><div className="data-value">{user.birthDate}</div></div>
          <div className="data-row"><div className="data-label">رقم البطاقة الشخصية:</div><div className="data-value">{user.idNumber}</div></div>
          <div className="data-row"><div className="data-label">العنوان:</div><div className="data-value">{user.governorate} - {user.city} - {user.address}</div></div>
          {user.rejectReason && <div className="data-row"><div className="data-label text-red-600">سبب الرفض المسجل:</div><div className="data-value">{user.rejectReason}</div></div>}
        </div>

        {/* Driver Specific */}
        {user.role === 'driver' && (
          <>
            <div className="section-header">بيانات ومستندات الهوية</div>
            <div className="doc-images">
              <div className="doc-img-container"><div className="doc-img-label">وجه البطاقة الشخصية</div><img src={user.idDocs.front} className="doc-img" alt="" /></div>
              <div className="doc-img-container"><div className="doc-img-label">ظهر البطاقة الشخصية</div><img src={user.idDocs.back} className="doc-img" alt="" /></div>
            </div>

            <div className="section-header">بيانات رخصة القيادة</div>
            <div className="grid grid-cols-1 gap-1 mb-4">
              <div className="data-row"><div className="data-label">رقم الرخصة:</div><div className="data-value">{user.licenseInfo.number}</div></div>
              <div className="data-row"><div className="data-label">تاريخ الانتهاء:</div><div className="data-value">{user.licenseInfo.expiryDate}</div></div>
            </div>
            <div className="doc-images">
              <div className="doc-img-container"><div className="doc-img-label">وجه رخصة القيادة</div><img src={user.licenseInfo.front} className="doc-img" alt="" /></div>
              <div className="doc-img-container"><div className="doc-img-label">ظهر رخصة القيادة</div><img src={user.licenseInfo.back} className="doc-img" alt="" /></div>
            </div>

            <div className="section-header">بيانات وتراخيص المركبة</div>
            <div className="grid grid-cols-1 gap-1 mb-4">
              <div className="data-row"><div className="data-label">نوع وماركة المركبة:</div><div className="data-value">{user.vehicleInfo.type} - {user.vehicleInfo.brand} ({user.vehicleInfo.model})</div></div>
              <div className="data-row"><div className="data-label">رقم اللوحة واللون:</div><div className="data-value">{user.vehicleInfo.plateNumber} - {user.vehicleInfo.color}</div></div>
              <div className="data-row"><div className="data-label">انتهاء رخصة المركبة:</div><div className="data-value">{user.vehicleInfo.expiryDate}</div></div>
            </div>
            <div className="doc-images">
              <div className="doc-img-container"><div className="doc-img-label">وجه رخصة المركبة</div><img src={user.vehicleInfo.licenseFront} className="doc-img" alt="" /></div>
              <div className="doc-img-container"><div className="doc-img-label">ظهر رخصة المركبة</div><img src={user.vehicleInfo.licenseBack} className="doc-img" alt="" /></div>
            </div>
          </>
        )}

        {/* <div className="footer-print">
          هذا مستند رسمي مستخرج من منصة شحنتي بتاريخ {new Date().toLocaleDateString('ar-EG')} الساعة {new Date().toLocaleTimeString('ar-EG')}
        </div> */}
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
          {openActionDialog === 'disable' && <><div className="p-3 bg-amber-50 rounded-2xl"><PowerOff className="text-amber-600" /></div> تعطيل الحساب مؤقتاً</>}
          {openActionDialog === 'delete' && <><div className="p-3 bg-rose-50 rounded-2xl"><Trash2 className="text-rose-600" /></div> حذف الحساب نهائياً</>}
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
              openActionDialog === 'reject' ? '!bg-orange-500 !shadow-orange-500/20' :
                openActionDialog === 'disable' ? '!bg-amber-600 !shadow-amber-600/20' : '!bg-rose-600 !shadow-rose-600/20'
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
      <div className={`text-sm font-black tracking-tight ${highlight ? 'text-orange-600' : 'text-gray-800 dark:text-white'}`}>
        {React.isValidElement(value) ? value :
          (value && typeof value === 'object' ? (value.name_ar || value.name || JSON.stringify(value)) : (value || '—'))}
      </div>
    </div>
  </div>
);

const ImagePreview = ({ label, src }) => (
  <div className="space-y-3 group">
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{label}</p>
    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border-2 border-gray-100 dark:border-gray-700 shadow-sm bg-gray-100 dark:bg-gray-900 group-hover:border-brand-primary transition-all duration-300">
      <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
        <button
          onClick={() => window.open(src, '_blank')}
          className="p-3 bg-white rounded-2xl text-gray-800 font-black text-xs flex items-center gap-2 shadow-xl active:scale-95 transition-transform hover:bg-gray-50"
        >
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
