import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, 
  Lock, Edit3, Camera, Save, 
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import Cookies from 'js-cookie';

// Profile Schema
const profileSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().regex(/^0[0-9]{10}$/, 'رقم هاتف غير صالح'),
});

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.full_name || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  useEffect(() => {
    const fetchFreshProfile = async () => {
      try {
        const freshData = await authService.getProfile();
        setUser(freshData);
        reset({
          name: freshData.full_name || freshData.name || '',
          email: freshData.email || '',
          phone: freshData.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchFreshProfile();
  }, [reset]);

  const onUpdateProfile = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري تحديث البيانات...');
    
    // Simulate API call for update (as we don't have the endpoint yet)
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      setUser(prev => ({ ...prev, ...data, full_name: data.name }));
      toast.dismiss(loadingToast);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    }, 1500);
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500" dir="rtl">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -mr-16 -mt-16"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-xl">
              {initials}
            </div>
            <button className="absolute bottom-0 left-0 p-2.5 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 text-brand-primary hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* User Basic Info */}
          <div className="text-center md:text-right flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {user?.full_name || user?.name || 'أدمن النظام'}
              </h1>
              <span className="inline-flex items-center px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/20">
                مدير النظام
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">حساب موثق</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">كامل الصلاحيات</span>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
             {!isEditing ? (
               <Button 
                onClick={() => setIsEditing(true)}
                className="!bg-brand-primary !py-3 !px-8 !rounded-xl !font-bold !shadow-lg !shadow-brand-primary/20 flex items-center gap-2"
               >
                 <Edit3 className="w-4 h-4 ml-2" />
                 تعديل الملف الشخصي
               </Button>
             ) : (
               <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit(onUpdateProfile)}
                    className="!bg-emerald-600 !py-3 !px-8 !rounded-xl !font-bold !shadow-lg !shadow-emerald-600/20"
                  >
                    حفظ
                  </Button>
                  <Button 
                    onClick={() => setIsEditing(false)}
                    variant="outlined"
                    className="!border-gray-200 !text-gray-500 !py-3 !px-8 !rounded-xl !font-bold hover:!bg-gray-50"
                  >
                    إلغاء
                  </Button>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              بيانات الحساب
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">الاسم الكامل</label>
                <input 
                  {...register('name')}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isEditing ? 'border-brand-primary focus:ring-4 focus:ring-brand-primary/10' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 cursor-not-allowed'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">البريد الإلكتروني</label>
                <input 
                  {...register('email')}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isEditing ? 'border-brand-primary focus:ring-4 focus:ring-brand-primary/10' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 cursor-not-allowed'}`}
                />
                 {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">رقم الهاتف</label>
                <input 
                  {...register('phone')}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${isEditing ? 'border-brand-primary focus:ring-4 focus:ring-brand-primary/10' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 cursor-not-allowed'}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">تاريخ الانضمام</label>
                <div className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-500 flex items-center gap-2">
                   <Clock className="w-4 h-4" />
                   14 سبتمبر 2023
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-2 text-rose-600">
              <Lock className="w-5 h-5" />
              تغيير كلمة المرور
            </h2>
            
            <p className="text-sm text-gray-500 mb-6">يفضل تغيير كلمة المرور بشكل دوري لضمان أعلى مستويات الأمان.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">كلمة المرور الحالية</label>
                <input type="password" placeholder="********" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-rose-500 focus:outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-400">كلمة المرور الجديدة</label>
                <input type="password" placeholder="********" className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-rose-500 focus:outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <Button className="!bg-rose-600 !py-3 !px-8 !rounded-xl !font-bold !shadow-lg !shadow-rose-600/20">تحديث كلمة المرور</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sessions & Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">جلسات العمل النشطة</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                   <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 font-bold shrink-0">
                      C
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">Chrome on Windows</p>
                      <p className="text-[10px] text-gray-400">القاهرة، مصر • الآن</p>
                   </div>
                   <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full">نشط</span>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-50 dark:border-gray-800 opacity-60">
                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 font-bold shrink-0">
                      S
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">Safari on iPhone</p>
                      <p className="text-[10px] text-gray-400">منذ يومين</p>
                   </div>
                </div>
             </div>
             <button className="w-full mt-6 py-2.5 text-rose-600 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors">
                تسجيل الخروج من جميع الأجهزة
             </button>
          </div>

          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
             <Shield className="w-12 h-12 mb-6 text-emerald-400" />
             <h3 className="text-xl font-bold mb-2">أمان حسابك ممتاز</h3>
             <p className="text-emerald-300 text-sm leading-relaxed">لقد قمت بتفعيل جميع إجراءات الأمان المقترحة للحفاظ على بياناتك وبيانات المنصة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Button Fallback if MUI not consistent
const Button = ({ children, className = '', variant = 'contained', onClick, disabled = false, type = 'button' }) => {
  const baseClasses = "transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    contained: `text-white ${className}`,
    outlined: `border bg-transparent ${className}`
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default ProfilePage;
