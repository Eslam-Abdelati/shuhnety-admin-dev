import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, CircularProgress } from '@mui/material';
import {
  User, Mail, Phone, Lock, Shield,
  ArrowRight, Save, X, AlertCircle, Eye, EyeOff, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
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
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('جاري حفظ البيانات...');

    try {
      // Map data to expected API payload
      const payload = {
        full_name: data.name,
        email: data.email,
        phone_number: data.phone,
        role: data.role,
      };

      const result = await adminService.createAdmin(payload);

      toast.success('تم إضافة المدير بنجاح');
      navigate('/dashboard/admins'); 
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const inputClass = "block w-full mt-1 text-sm dark:text-gray-300 bg-white dark:bg-gray-700 border rounded-md py-2.5 px-3 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:outline-none transition-all";
  const labelClass = "block text-sm text-gray-700 dark:text-gray-400 font-semibold mb-2";

  return (
    <div className="container mx-auto grid" dir="rtl">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
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
            <span>الاسم بالكامل</span>
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

        {/* Form Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-end gap-4 border-t dark:border-gray-700 pt-6">
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={isLoading}
            sx={{
              minWidth: 120,
              color: 'text.secondary',
              borderColor: 'divider',
            }}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              minWidth: 160,
              fontWeight: 900,
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddManagerPage;
