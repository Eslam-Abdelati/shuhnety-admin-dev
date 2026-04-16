import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Navigation, Phone, MessageSquare, 
  MapPin, Clock, ShieldCheck, Truck, Package,
  MoreHorizontal, RotateCw, Map as MapIcon,
  ChevronDown, ChevronUp, CheckCircle2, Circle
} from 'lucide-react';
import { Button, IconButton, Chip, Divider, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

// Mock Shipment Data
const mockShipmentDetail = {
  id: 'SH-1025',
  status: 'في الطريق',
  sender: 'أحمد علي',
  senderLocation: 'القاهرة، المعادي - شارع 9',
  recipient: 'محمد حسن',
  recipientLocation: 'الإسكندرية، سموحة - حي الزهور',
  type: 'أثاث منزلي (طقم صالون)',
  price: 'EGP 450',
  weight: '120 كجم',
  driver: {
    name: 'محمود كمال',
    phone: '01012345678',
    rating: 4.9,
    vehicle: 'تريلا جامبو - أ ب ج 1234',
    location: { lat: 30.0444, lng: 31.2357 }, // Cairo coords for mock
  },
  timeline: [
    { title: 'تم طلب الشحنة', time: '10:00 ص', date: '2024-04-15', status: 'completed' },
    { title: 'تم تعيين السائق', time: '10:30 ص', date: '2024-04-15', status: 'completed' },
    { title: 'جاري التحميل', time: '11:15 ص', date: '2024-04-15', status: 'completed' },
    { title: 'في الطريق بالمسار', time: '12:00 م', date: '2024-04-15', status: 'active' },
    { title: 'الوصول المتوقع', time: '04:30 م', date: '2024-04-15', status: 'pending' },
  ]
};

export const ShipmentTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment] = useState(mockShipmentDetail);

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
              <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">تتبع الشحنة</h2>
              <Chip 
                label={shipment.id} 
                className="!bg-brand-primary !text-white !font-black !px-2" 
                size="small" 
              />
            </div>
            <p className="text-sm text-gray-400 font-medium mt-1">تحديث مباشر لمسار وحالة الشحنة حالياً</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button className="!bg-white dark:!bg-gray-800 !border !border-gray-100 !rounded-xl !px-4 !py-2.5 !text-gray-500 !font-bold hover:!bg-gray-50 shadow-sm" startIcon={<RotateCw className="w-4 h-4 ml-1" />}>تحديث الخريطة</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Shipment & Driver Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          {/* Status Progress Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden">
            <h4 className="font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2 underline decoration-brand-primary/30 decoration-4 underline-offset-4">
              <Package className="w-4 h-4 text-brand-primary" />
              حالة الشحنة
            </h4>
            <div className="space-y-6">
              {shipment.timeline.map((item, index) => (
                <div key={index} className="flex gap-4 relative">
                  {index !== shipment.timeline.length - 1 && (
                    <div className={`absolute right-[7px] top-6 w-0.5 h-10 ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-700'}`} />
                  )}
                  <div className="z-10">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 bg-white dark:bg-gray-800 grow" />
                    ) : item.status === 'active' ? (
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-4 h-4 bg-brand-primary rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-200 dark:text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h5 className={`text-sm font-black ${item.status === 'active' ? 'text-brand-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">{item.date} | {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-gray-800 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-primary" />
                معلومات الكابتن
              </h4>
              <Chip label="★ 4.9" size="small" className="!bg-amber-50 !text-amber-600 !font-black !text-[10px]" />
            </div>
            <div className="flex items-center gap-4 mb-6">
               <Avatar className="!w-12 !h-12 !bg-blue-100 !text-blue-600 !font-black text-xl">
                 {shipment.driver.name.charAt(0)}
               </Avatar>
               <div>
                  <h5 className="font-black text-gray-800 dark:text-white leading-none">{shipment.driver.name}</h5>
                  <p className="text-xs text-gray-400 font-bold mt-1.5">{shipment.driver.vehicle}</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <Button 
                 fullWidth 
                 className="!rounded-xl !bg-emerald-50 !text-emerald-600 !font-bold !text-xs !py-3 hover:!bg-emerald-100"
                 startIcon={<Phone className="w-4 h-4 ml-1" />}
               >
                 اتصال
               </Button>
               <Button 
                 fullWidth 
                 className="!rounded-xl !bg-blue-50 !text-blue-600 !font-bold !text-xs !py-3 hover:!bg-blue-100"
                 startIcon={<MessageSquare className="w-4 h-4 ml-1" />}
               >
                 دردشة
               </Button>
            </div>
          </div>

          {/* Location Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="flex flex-col items-center">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-100 dark:bg-gray-700 my-1 border-dashed border-l-2" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">نقطة الانطلاق</p>
                      <p className="text-sm font-black text-gray-800 dark:text-white">{shipment.senderLocation}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">{shipment.sender}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg self-start">
                     <MapPin className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">وجهة الوصول</p>
                      <p className="text-sm font-black text-gray-800 dark:text-white">{shipment.recipientLocation}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">{shipment.recipient}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Active Map Mock (8 cols) */}
        <div className="lg:col-span-8 order-1 lg:order-2 h-[500px] lg:h-auto min-h-[600px] relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl bg-gray-50">
          {/* Map Mock Content */}
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 group">
             {/* Styled SVG Map Overlay */}
             <svg className="w-full h-full opacity-30 pointer-events-none" viewBox="0 0 800 600">
                <path d="M 0 0 L 800 600 M 0 600 L 800 0" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
                <circle cx="200" cy="150" r="100" fill="currentColor" opacity="0.1" />
                <circle cx="600" cy="450" r="150" fill="currentColor" opacity="0.1" />
                {/* Random Grid Lines */}
                {[...Array(10)].map((_, i) => (
                   <React.Fragment key={i}>
                      <line x1={i * 80} y1="0" x2={i * 80} y2="600" stroke="currentColor" strokeWidth="0.2" />
                      <line x1="0" y1={i * 60} x2="800" y2={i * 60} stroke="currentColor" strokeWidth="0.2" />
                   </React.Fragment>
                ))}
             </svg>

             {/* Animated Route Path */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path 
                   d="M 200 450 Q 400 300 600 150" 
                   fill="none" 
                   stroke="#f59e0b" 
                   strokeWidth="4" 
                   strokeDasharray="10 10"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                />
             </svg>

             {/* Origin Marker */}
             <div className="absolute left-[180px] bottom-[130px] flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-emerald-500 mb-2 whitespace-nowrap">
                   <p className="text-[10px] font-black text-gray-800 dark:text-white">نقطة الاستلام</p>
                </div>
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
             </div>

             {/* Destination Marker */}
             <div className="absolute right-[180px] top-[130px] flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-rose-500 mb-2 whitespace-nowrap">
                   <p className="text-[10px] font-black text-gray-800 dark:text-white">نقطة التسليم</p>
                </div>
                <div className="w-4 h-4 bg-rose-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
             </div>

             {/* Driver Marker (Animated) */}
             <motion.div 
               className="absolute z-20"
               initial={{ left: "200px", bottom: "150px" }}
               animate={{ left: "400px", bottom: "300px" }}
               transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
             >
                <div className="relative">
                   {/* Pulse Effect */}
                   <motion.div 
                     className="absolute -inset-4 bg-brand-primary/40 rounded-full blur-xl"
                     animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                     transition={{ duration: 2, repeat: Infinity }}
                   />
                   <div className="bg-brand-primary p-3 rounded-2xl shadow-2xl relative border-2 border-white dark:border-gray-800">
                      <Truck className="w-6 h-6 text-white" />
                   </div>
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap shadow-xl">
                      الكابتن في الطريق حالياً
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                   </div>
                </div>
             </motion.div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
             <IconButton className="!bg-white dark:!bg-gray-800 !shadow-xl !rounded-xl !p-3">
               <Navigation className="w-5 h-5 text-brand-primary" />
             </IconButton>
          </div>

          <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
             {[
               { label: 'المسافة المتبقية', value: '45 كم', icon: MapIcon },
               { label: 'الوقت المقدر', value: '55 دقيقة', icon: Clock },
               { label: 'السرعة الحالية', value: '80 كم/س', icon: Navigation },
               { label: 'حالة الطريق', value: 'جيدة جداً', icon: ShieldCheck },
             ].map((m, i) => (
                <div key={i} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
                   <div className="flex items-center gap-2 mb-1">
                      <m.icon className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-[10px] font-black text-gray-400 uppercase leading-none">{m.label}</span>
                   </div>
                   <p className="text-sm font-black text-gray-800 dark:text-white leading-none">{m.value}</p>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
