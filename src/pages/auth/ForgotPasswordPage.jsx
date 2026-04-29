import React, { useState } from 'react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

// Schema
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('بريد إلكتروني غير صالح'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري إرسال رمز التحقق...');

    try {
      await authService.forgotPassword(data.email);
      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');

      // Redirect to verification page
      navigate('/verify-code', { state: { email: data.email } });


    } catch (error) {
      console.error('Forgot Password Error:', error);
      toast.error(error.message || 'حدث خطأ أثناء إرسال الرمز');
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
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=800&q=80"
              alt="Reset Password"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block transform hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
              alt="Reset Password"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Form Section */}
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100 text-right">
                نسيت كلمة المرور
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور الخاصة بك.
              </p>

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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2.5 rounded-lg text-sm text-white bg-brand-primary border border-transparent active:bg-brand-primary hover:opacity-95 focus:ring focus:ring-brand-primary/30 w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
                  استعادة كلمة المرور
                </button>
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
                    className="text-sm font-bold text-brand-primary hover:underline flex items-center justify-center gap-2"
                    to="/login"
                  >
                    العودة إلي تسجيل الدخول
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-8">
                  جميع الحقوق محفوظة شحنتي.&{new Date().getFullYear()}  &copy;
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
