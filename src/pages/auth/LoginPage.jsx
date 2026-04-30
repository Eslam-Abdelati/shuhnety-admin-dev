import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import Cookies from 'js-cookie';

import { loginSchema } from '../../utils/zodSchemas';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري التحقق من البيانات...');

    try {
      const result = await authService.login(data);

      // Check for isVerified in different possible locations
      const isVerified = result.isVerified === false || result.data?.isVerified === false || result.user?.isVerified === false;

      if (!result.access_token && isVerified) {
        // Search in all possible locations for id, including the new 'adminId'
        const userId = result.adminId || result.data?.adminId || result.user?.adminId || result.id || result.user?.id || result.data?.id || result.data?.user?.id;

        if (!userId) {
          console.error('Could not find userId in:', result);
          toast.error('خطأ: لم يتم العثور على معرف المستخدم في الرد');
          return;
        }

        toast.success('يرجى إنشاء كلمة مرور جديدة لحسابك');
        navigate('/create-password', {
          state: {
            email: data.email,
            userId: userId
          },
          replace: true
        });
        return;
      }

      // 2. Case: Successful login with token
      if (result.access_token) {
        toast.success('تم تسجيل الدخول بنجاح');
        navigate('/dashboard', { replace: true });
        return;
      }

      // 3. Fallback: Success response but no token and not handled above
      toast.error('حدث خطأ في استلام صلاحيات الدخول، يرجى التواصل مع الدعم');

    } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
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
              className="object-cover w-full h-full dark:hidden transform hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block transform hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80"
              alt="Office"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Form Section */}
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100 text-right">
                تسجيل الدخول
              </h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Email Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400"> البريد الإلكتروني </label>
                  </div>
                  <div className="relative">
                    <input
                      {...register('email')}
                      className={`block w-full pr-10 pl-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="admin@shuhnety.com"
                      type="email"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Mail className={`w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 mr-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400">كلمة المرور</label>
                  </div>
                  <div className="relative">
                    <input
                      {...register('password')}
                      className={`block w-full pr-10 pl-12 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="***************"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Lock className={`w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1 mr-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 900,
                    mt: 2
                  }}
                >
                  {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="space-y-4 pt-4 text-center">
                <p>
                  <Link
                    className="text-sm font-medium text-brand-primary hover:underline"
                    to="/forgot-password"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-8">
                  جميع الحقوق محفوظة شحنتي {new Date().getFullYear()}  &copy;
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
