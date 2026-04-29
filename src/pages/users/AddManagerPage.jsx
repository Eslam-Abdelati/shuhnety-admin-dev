import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User, Mail, Phone, Lock, Shield,
  ArrowRight, Save, X, AlertCircle, Eye, EyeOff, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

import { managerSchema } from '../../utils/zodSchemas';

const AddManagerPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(managerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      permissions: {
        manage_users: true,
        manage_shipments: true,
        view_reports: false,
        manage_settings: false,
      }
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري حفظ البيانات...');

    setTimeout(() => {
      setIsLoading(false);
      toast.dismiss(loadingToast);
      toast.success('تم إضافة المدير بنجاح');
      console.log('Submitted Data:', data);
      navigate('/dashboard');
    }, 1500);
  };

  const inputClass = "block w-full mt-1 text-sm dark:text-gray-300 bg-white dark:bg-gray-700 border rounded-md py-2.5 px-3 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none transition-all";
  const labelClass = "block text-sm text-gray-700 dark:text-gray-400 font-semibold mb-2";

  return (
    <div className="container mx-auto grid" dir="rtl">
      <h2 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        إضافة مدير جديد
      </h2>

      {/* Info Box */}
      <div className="flex items-center p-4 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 rounded-lg shadow-sm border border-blue-200">
        <div className="flex items-center ml-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <span>ملاحظة: سيصل بريد إلكتروني للمدير الجديد لتفعيل حسابه فور حفظ البيانات.</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Full Name */}
          <label className={labelClass}>
            <span>الاسم الكامل</span>
            <input
              {...register('name')}
              type="text"
              className={`${inputClass} ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="مثال: أحمد محمد"
            />
            {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
          </label>

          {/* Email */}
          <label className={labelClass}>
            <span>البريد الإلكتروني</span>
            <input
              {...register('email')}
              type="email"
              className={`${inputClass} ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="admin@shuhnety.com"
            />
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
          </label>

          {/* Phone */}
          <label className={labelClass}>
            <span>رقم الهاتف</span>
            <input
              {...register('phone')}
              type="tel"
              className={`${inputClass} ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="01xxxxxxxxx"
            />
            {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>}
          </label>


          {/* Role */}
          <label className={labelClass}>
            <span>الدور الوظيفي</span>
            <div className="relative">
              <select
                {...register('role')}
                className={`${inputClass} border-gray-300 dark:border-gray-600 appearance-none pl-10`}
              >
                <option value="admin">مدير نظام (Admin)</option>
                <option value="moderator">مشرف (Moderator)</option>
                <option value="support">دعم فني (Support)</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </label>

        </div>

        {/* Permissions Section */}
        <div className="mt-8 border-t dark:border-gray-700 pt-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            الصلاحيات الممنوحة
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Controller
              name="permissions.manage_users"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-transparent hover:border-brand-primary transition-all">
                  <input
                    type="checkbox"
                    className="text-brand-primary form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-brand-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-medium whitespace-nowrap">إدارة المستخدمين</span>
                </label>
              )}
            />

            <Controller
              name="permissions.manage_shipments"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-transparent hover:border-brand-primary transition-all">
                  <input
                    type="checkbox"
                    className="text-brand-primary form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-brand-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-medium whitespace-nowrap">إدارة الشحنات</span>
                </label>
              )}
            />

            <Controller
              name="permissions.view_reports"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-transparent hover:border-brand-primary transition-all">
                  <input
                    type="checkbox"
                    className="text-brand-primary form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-brand-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-medium whitespace-nowrap">عرض التقارير</span>
                </label>
              )}
            />

            <Controller
              name="permissions.manage_settings"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-transparent hover:border-brand-primary transition-all">
                  <input
                    type="checkbox"
                    className="text-brand-primary form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-brand-primary"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 font-medium whitespace-nowrap">إعدادات النظام</span>
                </label>
              )}
            />

          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-10 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-2.5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-brand-primary border border-transparent rounded-lg active:bg-brand-primary hover:bg-brand-primary/90 focus:outline-none disabled:opacity-50"
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddManagerPage;
