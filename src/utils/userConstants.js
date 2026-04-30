import { ShieldCheck, Truck, ShoppingCart, User, XCircle, Clock } from 'lucide-react';

export const USER_ROLES = {
  'client': { 
    label: 'عميل', 
    icon: ShoppingCart, 
    color: 'text-orange-500 bg-orange-50' 
  },
  'driver': { 
    label: 'كابتن', 
    icon: Truck, 
    color: 'text-emerald-500 bg-emerald-50' 
  },
  'admin': { 
    label: 'مدير', 
    icon: ShieldCheck, 
    color: 'text-purple-500 bg-purple-50' 
  }
};

export const USER_STATUSES = {
  'approved': { 
    label: 'موثق', 
    color: 'text-emerald-600', 
    iconColor: 'fill-emerald-50', 
    icon: ShieldCheck 
  },
  'rejected': { 
    label: 'مرفوض', 
    color: 'text-rose-600', 
    iconColor: 'fill-rose-50', 
    icon: XCircle 
  },
  'pending': { 
    label: 'قيد المراجعة', 
    color: 'text-amber-600', 
    iconColor: 'fill-amber-50', 
    icon: Clock 
  },
  'banned': { 
    label: 'موقوف نهائياً', 
    color: 'text-gray-900', 
    iconColor: 'fill-gray-100', 
    icon: XCircle 
  }
};

export const getRoleConfig = (role) => {
  return USER_ROLES[role] || { label: role, icon: User, color: 'text-gray-500 bg-gray-50' };
};

export const getStatusConfig = (status) => {
  return USER_STATUSES[status] || USER_STATUSES['pending'];
};
