import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

// Schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirm_password: z.string().min(6, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirm_password, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirm_password"],
});

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      toast.error('جلسة استعادة كلمة المرور منتهية');
      navigate('/forgot-password');
    }
  }, [userId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري تعيين كلمة المرور الجديدة...');

    try {
      await authService.resetPassword({
        userId: userId,
        password: data.password,
        confirm_password: data.confirm_password
      });
      
      toast.success('تم تغيير كلمة المرور بنجاح');
      
      // Navigate to login after clear success
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('Reset Password Error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تعيين كلمة المرور');
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
          <div className="h-48 md:h-auto md:w-1/2 relative overflow-hidden">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80"
              alt="New Password"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Form Section */}
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100 text-right">
                كلمة مرور جديدة
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                قم بتعيين كلمة مرور قوية وجديدة لحسابك.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      className={`block w-full pr-10 pl-12 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="***************"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-brand-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 mr-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-400">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input
                      {...register('confirm_password')}
                      className={`block w-full pr-10 pl-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.confirm_password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="***************"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500 mt-1 mr-1">{errors.confirm_password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2.5 rounded-lg text-sm text-white bg-brand-primary border border-transparent active:bg-brand-primary hover:opacity-95 focus:ring focus:ring-brand-primary/30 w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
                  تحديث كلمة المرور
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
