import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Package, MapPin, Calendar, 
  User, Truck, CreditCard, Clock, 
  Map as MapIcon, ShieldCheck, Info,
  CheckCircle, XCircle, AlertTriangle, Edit
} from 'lucide-react';
import { Button, Divider, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

// Mock Data for a single Shipment
const mockShipmentDetails = {
  id: 'SH-1025',
  status: 'نشط',
  price: 'EGP 450',
  date: '2024-04-15',
  type: 'أثاث منزلي',
  description: 'طقم صالون مكون من 5 قطع (كنبة و 4 كراسي) مغلف بعناية.',
  weight: '150 كجم',
  dimensions: '200x150x80 سم',
  sender: {
    name: 'أحمد علي',
    phone: '01011223344',
    address: 'القاهرة، المعادي - شارع 9 - الدور الثالث',
    governorate: 'القاهرة'
  },
  recipient: {
    name: 'محمد حسن',
    phone: '01223344556',
    address: 'الإسكندرية، سموحة - حي الزهور - برج الياسمين',
    governorate: 'الإسكندرية'
  },
  driver: {
    name: 'محمود كمال',
    phone: '01012345678',
    vehicle: 'تريلا جامبو - أ ب ج 1234',
    rating: 4.8
  },
  paymentStatus: 'مدفوع',
  paymentMethod: 'كارد أونلاين',
};

export const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(mockShipmentDetails);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(shipment.status);

  const handleStatusChange = () => {
    setShipment({ ...shipment, status: newStatus });
    setOpenStatusDialog(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
          >
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">تفاصيل الشحنة</h2>
              <Chip 
                label={shipment.id} 
                className="!bg-brand-primary/10 !text-brand-primary !font-black" 
                size="small" 
              />
            </div>
            <p className="text-sm text-gray-400 font-medium mt-1">عرض ومراجعة كافة بيانات العمليات والتحكم بها</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button 
             variant="outlined" 
             onClick={() => setOpenStatusDialog(true)}
             className="!rounded-xl !border-gray-200 !text-gray-500 hover:!bg-gray-50 !font-bold"
             startIcon={<Edit className="w-4 h-4 ml-1" />}
           >
             تغيير الحالة (Admin)
           </Button>
           <Button 
             component={Link}
             to={`/shipments/track/${shipment.id}`}
             className="!bg-brand-primary !text-white !rounded-xl !px-6 !py-2.5 !font-black shadow-lg"
             startIcon={<MapIcon className="w-4 h-4 ml-1" />}
           >
             تتبع الشحنة الآن
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-primary" />
                  <h4 className="font-black text-gray-800 dark:text-white">معلومات الشحنة العامة</h4>
               </div>
               <Chip 
                 label={shipment.status} 
                 className={`!font-black ${
                   shipment.status === 'مكتمل' ? 'bg-emerald-50 text-emerald-600' :
                   shipment.status === 'نشط' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                 }`}
               />
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
               <DataPoint label="تاريخ الطلب" value={shipment.date} icon={Calendar} />
               <DataPoint label="نوع الشحنة" value={shipment.type} icon={Info} />
               <DataPoint label="سعر الرحلة" value={shipment.price} icon={CreditCard} />
               <DataPoint label="الوزن الإجمالي" value={shipment.weight} icon={ShieldCheck} />
            </div>
            <Divider />
            <div className="p-6 bg-gray-50/30 dark:bg-gray-800/20">
               <p className="text-[10px] font-black text-gray-400 uppercase mb-2">وصف الشحنة</p>
               <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{shipment.description}</p>
            </div>
          </div>

          {/* Sender & Recipient Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <LocationCard title="بيانات المرسل" data={shipment.sender} type="sender" />
             <LocationCard title="بيانات المستلم" data={shipment.recipient} type="recipient" />
          </div>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-6">
          {/* Driver Assigned Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 overflow-hidden relative">
            <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-primary" />
              السائق المعين
            </h4>
            <div className="flex items-center gap-4 mb-6">
               <Avatar className="!w-14 !h-14 !bg-orange-100 !text-brand-primary !font-black !text-xl">
                 {shipment.driver.name.charAt(0)}
               </Avatar>
               <div>
                  <h5 className="font-black text-gray-800 dark:text-white leading-tight">{shipment.driver.name}</h5>
                  <p className="text-xs text-gray-400 font-bold mt-1.5">{shipment.driver.vehicle}</p>
                  <p className="text-[10px] text-amber-500 font-black mt-1">★ {shipment.driver.rating}</p>
               </div>
            </div>
            <Button 
               fullWidth 
               variant="outlined"
               className="!rounded-xl !border-gray-100 !text-gray-600 !font-bold !py-2.5 hover:!bg-gray-50"
            >
               عرض ملف السائق
            </Button>
          </div>

          {/* Logistics Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-primary" />
              الجدول الزمني
            </h4>
            <div className="space-y-4">
               <TimeStep label="تم إنشاء الطلب" time="09:12 ص" completed />
               <TimeStep label="تم قبول العرض من السائق" time="10:05 ص" completed />
               <TimeStep label="بدء الرحلة (Live)" time="11:30 ص" active />
               <TimeStep label="الوصول والتسليم" time="--:--" />
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 p-6">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-emerald-600 uppercase">حالة الدفع</p>
                   <h5 className="text-lg font-black text-emerald-800 dark:text-emerald-400">{shipment.paymentStatus}</h5>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                   <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
             </div>
             <p className="text-[11px] text-emerald-700/60 dark:text-emerald-500/60 font-bold mt-3">تم الدفع بواسطة {shipment.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Admin Status Change Dialog */}
      <Dialog 
        open={openStatusDialog} 
        onClose={() => setOpenStatusDialog(false)}
        PaperProps={{ className: "!rounded-3xl !p-2 !shadow-2xl sm:!min-w-[400px]" }}
      >
        <DialogTitle className="!font-black !text-gray-800 !flex !items-center !gap-2">
          <AlertTriangle className="text-orange-500" /> تغيير حالة الشحنة المباشرة
        </DialogTitle>
        <DialogContent className="!pt-4">
          <p className="text-sm text-gray-500 font-bold mb-6">هذا الإجراء يتخطى القيود التلقائية (Admin Override). يرجى التأكد من الحقيقية قبل التنفيذ.</p>
          <FormControl fullWidth>
            <InputLabel id="status-label" className="!font-bold">الحالة الجديدة</InputLabel>
            <Select
              labelId="status-label"
              value={newStatus}
              label="الحالة الجديدة"
              onChange={(e) => setNewStatus(e.target.value)}
              className="!rounded-2xl"
              sx={{ '& .MuiSelect-select': { fontWeight: 800 } }}
            >
              <MenuItem value="قيد الانتظار" className="!font-bold">قيد الانتظار</MenuItem>
              <MenuItem value="نشط" className="!font-bold">نشط (في الطريق)</MenuItem>
              <MenuItem value="مكتمل" className="!font-bold">مكتمل</MenuItem>
              <MenuItem value="ملغي" className="!font-bold !text-rose-500">ملغي (Force Cancel)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="!px-6 !pb-6 !gap-2">
          <Button onClick={() => setOpenStatusDialog(false)} className="!rounded-xl !font-bold !text-gray-400">إلغاء</Button>
          <Button onClick={handleStatusChange} variant="contained" className="!bg-brand-primary !rounded-xl !px-6 !py-2.5 !font-black !shadow-none">حفظ التغيير</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Internal Components
const DataPoint = ({ label, value, icon: Icon }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
       <Icon className="w-3 h-3" />
       {label}
    </div>
    <p className="text-sm font-black text-gray-800 dark:text-white">{value}</p>
  </div>
);

const LocationCard = ({ title, data, type }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
    <div className="flex items-center gap-2 mb-6">
      <div className={`p-2 rounded-lg ${type === 'sender' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
        <User className="w-4 h-4" />
      </div>
      <h4 className="font-black text-gray-800 dark:text-white">{title}</h4>
    </div>
    <div className="space-y-4">
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">الاسم الكامل</p>
          <p className="text-sm font-black text-gray-800 dark:text-white">{data.name}</p>
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">رقم التواصل</p>
          <p className="text-sm font-black text-gray-800 dark:text-white leading-none">{data.phone}</p>
       </div>
       <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">العنوان بالتفصيل</p>
          <div className="flex gap-2 items-start mt-1.5">
             <MapPin className="w-4 h-4 text-gray-300 mt-0.5" />
             <p className="text-xs text-gray-500 font-bold leading-relaxed">{data.address}</p>
          </div>
       </div>
    </div>
  </div>
);

const TimeStep = ({ label, time, completed, active }) => (
  <div className="flex items-center gap-3 relative">
    <div className={`w-2.5 h-2.5 rounded-full z-10 ${
      completed ? 'bg-emerald-500' : 
      active ? 'bg-brand-primary' : 'bg-gray-100 dark:bg-gray-700'
    }`} />
    <div className="flex-1 flex items-center justify-between">
       <span className={`text-xs font-black ${
         completed ? 'text-gray-400' : 
         active ? 'text-brand-primary underline' : 'text-gray-300'
       }`}>{label}</span>
       <span className="text-[10px] font-bold text-gray-400">{time}</span>
    </div>
  </div>
);
