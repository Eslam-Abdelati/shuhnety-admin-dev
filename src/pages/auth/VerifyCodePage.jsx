import React, { useState, useEffect } from 'react';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

// Schema
const verifyCodeSchema = z.object({
  code: z.string().length(4, 'الرمز يجب أن يتكون من 4 أرقام'),
});


const VerifyCodePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني أولاً');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend) return;

    const resendToast = toast.loading('جاري إعادة إرسال الرمز...');
    try {
      await authService.resendCode(email);
      toast.success('تم إعادة إرسال الرمز بنجاح');
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      toast.error(error.message || 'فشل إعادة إرسال الرمز');
    } finally {
      toast.dismiss(resendToast);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyCodeSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري التحقق من الرمز...');

    try {
      const response = await authService.verifyResetCode(email, data.code);
      toast.success('رمز التحقق صحيح');

      // Save userId from response and navigate to reset password
      const userId = response.data?.userId || response.userId || response.data?.id;

      navigate('/reset-password', {
        state: {
          email: email,
          userId: userId
        }
      });

    } catch (error) {
      console.error('Verify Code Error:', error);
      toast.error(error.message || 'رمز التحقق غير صحيح');
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
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
              alt="Verify"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Form Section */}
          <main className="flex items-center justify-center p-8 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100 text-right">
                التحقق من الرمز
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                أدخل الكود الذي أرسلناه إلى <span className="font-bold text-brand-primary">{email}</span>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Code Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-400"> رمز التحقق </label>
                  </div>
                  <div className="relative">
                    <input
                      {...register('code')}
                      className={`block w-full pr-10 pl-4 py-2.5 text-center text-xl font-bold tracking-[1.5rem] bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary focus:outline-none transition-all duration-200 dark:text-gray-100 ${errors.code ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                        }`}
                      placeholder="0000"
                      maxLength={4}
                      type="text"
                    />

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.code && (
                    <p className="text-xs text-red-500 mt-1 mr-1">{errors.code.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2.5 rounded-lg text-sm text-white bg-brand-primary border border-transparent active:bg-brand-primary hover:opacity-95 focus:ring focus:ring-brand-primary/30 w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
                  تأكيد الرمز
                </button>
              </form>

              {/* Resend Code Section */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  لم يصلك الرمز؟{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend}
                    className={`font-bold transition-colors ${canResend
                      ? 'text-brand-primary hover:underline'
                      : 'text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {canResend ? 'إعادة الإرسال' : `إعادة الإرسال خلال ${timer} ثانية`}
                  </button>
                </p>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="space-y-4 pt-4 text-center">
                <p>
                  <button
                    onClick={() => navigate('/forgot-password')}
                    className="text-sm font-bold text-brand-primary hover:underline flex items-center justify-center gap-2 w-full cursor-pointer"
                  >
                    تغيير البريد الإلكتروني
                  </button>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
