import React, { useState, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

// Schema التحقق من البيانات بشكل متقدم
const createPasswordSchema = z.object({
  password: z.string()
    .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل'),
  confirm_password: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
}).refine((data) => data.password === data.confirm_password, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirm_password"],
});

const CreatePasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email;
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.warn('CreatePasswordPage: Missing userId');
      setDataError(true);
    }
  }, [userId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري حفظ كلمة المرور الجديدة...');

    try {
      await authService.activateAdmin({
        email: email,
        password: data.password,
        confirm_password: data.confirm_password
      });

      toast.success('تم تفعيل الحساب وإنشاء كلمة المرور بنجاح');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء إنشاء كلمة المرور');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900 font-cairo" dir="rtl">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-2xl shadow-xl dark:bg-gray-800 border dark:border-gray-700">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* Side Image Section */}
          <div className="h-48 md:h-auto md:w-1/2 relative overflow-hidden bg-brand-primary/5 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
              <ShieldCheck className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">أهلاً بك في فريق شحنتي</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">بصفتك مديراً جديداً، يرجى تعيين كلمة مرور قوية لحماية حسابك والوصول إلى لوحة التحكم.</p>
            <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply -z-10"></div>
          </div>

          {/* Form Section */}
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full">
              {dataError ? (
                <div className="text-center space-y-6 py-8">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-gray-800 mb-2">بيانات الجلسة مفقودة</h1>
                    <p className="text-sm text-gray-500 leading-relaxed">لم نتمكن من العثور على بيانات المستخدم المطلوبة. يرجى محاولة تسجيل الدخول مرة أخرى.</p>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200 text-right">
                    إنشاء كلمة مرور جديدة
                  </h1>


                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-400">كلمة المرور الجديدة</label>
                      <div className="relative">
                        <input
                          {...register('password')}
                          className={`block w-full pr-10 pl-12 py-3 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'}`}
                          placeholder="كلمة المرور الجديدة"
                          type={showPassword ? 'text' : 'password'}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <Lock className="w-5 h-5" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-brand-primary transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-400">تأكيد كلمة المرور</label>
                      <div className="relative">
                        <input
                          {...register('confirm_password')}
                          className={`block w-full pr-10 pl-12 py-3 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.confirm_password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'}`}
                          placeholder="أعد كتابة كلمة المرور"
                          type={showConfirmPassword ? 'text' : 'password'}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-brand-primary transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirm_password && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.confirm_password.message}</p>}
                    </div>


                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 900,
                        mt: 4,
                        minHeight: '52px',
                        backgroundColor: '#eb6a1d',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#d55d1a',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#eb6a1d',
                          color: 'white',
                        }
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'إنشاء وحفظ كلمة المرور'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordPage;
