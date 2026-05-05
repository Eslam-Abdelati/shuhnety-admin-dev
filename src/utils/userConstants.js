import { ShieldCheck, Truck, ShoppingCart, User, XCircle, Clock } from 'lucide-react';

export const USER_ROLES = {
  'client': {
    label: 'عميل',
    icon: ShoppingCart,
    color: 'text-orange-500 '
  },
  'driver': {
    label: 'كابتن',
    icon: Truck,
    color: 'text-emerald-500 '
  },
  'admin': {
    label: 'مدير',
    icon: ShieldCheck,
    color: 'text-purple-500 '
  }
};

export const USER_STATUSES = {
  'pending_review': {
    label: 'قيد المراجعة',
    color: 'text-amber-600 ',
    iconColor: 'text-amber-500',
    icon: Clock
  },
  'active': {
    label: 'نشط',
    color: 'text-emerald-600 ',
    iconColor: 'text-emerald-500',
    icon: ShieldCheck
  },
  'approved': {
    label: 'موثق',
    color: 'text-emerald-600',
    iconColor: 'text-emerald-500',
    icon: ShieldCheck
  },

  'rejected': {
    label: 'مرفوض',
    color: 'text-rose-600 bg-rose-50',
    iconColor: 'text-rose-500',
    icon: XCircle
  },
  'suspended': {
    label: 'معطل',
    color: 'text-rose-600',
    iconColor: 'text-rose-500',
    icon: XCircle
  },
  'banned': {
    label: 'موقوف نهائياً',
    color: 'text-gray-900 ',
    iconColor: 'text-gray-600',
    icon: XCircle
  }
};

export const getRoleConfig = (role) => {
  return USER_ROLES[role] || { label: role, icon: User, color: 'text-gray-500 bg-gray-50' };
};

export const getStatusConfig = (status) => {
  return USER_STATUSES[status] || {
    label: status || 'غير معروف',
    color: 'text-gray-500 bg-gray-50',
    iconColor: 'text-gray-400',
    icon: Clock
  };
};
