import * as z from 'zod';

/**
 * Reusable Zod validation rules
 */

export const emailSchema = z.string()
  .trim()
  .min(1, 'البريد الإلكتروني مطلوب')
  .email('بريد إلكتروني غير صالح');

export const passwordSchema = (min = 8) => z.string()
  .min(min, `كلمة المرور يجب أن تكون ${min} أحرف على الأقل`)
  .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
  .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
  .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي على علامة خاصة واحدة على الأقل (مثل @#$%)');

export const phoneSchema = z.string()
  .regex(/^01[0125][0-9]{8}$/, 'رقم هاتف غير صالح (يجب أن يكون 11 رقم)');

export const fullNameSchema = z.string()
  .min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل');

/**
 * Full page schemas
 */

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export const managerSchema = z.object({
  name: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.string(),
  permissions: z.object({
    manage_users: z.boolean(),
    manage_shipments: z.boolean(),
    view_reports: z.boolean(),
    manage_settings: z.boolean(),
  })
});
