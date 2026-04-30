import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const userService = {
  /**
   * Get all users for the dashboard
   */
  getAllUsers: async (filters = {}) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.DASHBOARD.ALL_USERS, filters);
      console.log('API Response (All Users):', response.data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw new Error(error.response?.data?.message || 'فشل في جلب بيانات المستخدمين');
    }
  },

  /**
   * Get specific user details by ID
   */
  getUserDetails: async (id) => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.DASHBOARD.USER_DETAILS(id));
      console.log('API Response (User Details):', response.data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching user ${id} details:`, error);
      throw new Error(error.response?.data?.message || 'فشل في جلب تفاصيل المستخدم');
    }
  },

  /**
   * Update specific user status by ID
   */
  updateUserStatus: async (id, status, reason) => {
    try {
      const response = await axiosClient.patch(API_ENDPOINTS.DASHBOARD.UPDATE_USER_STATUS(id), { status, reason });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error updating user ${id} status:`, error);
      throw new Error(error.response?.data?.message || 'فشل في تحديث حالة المستخدم');
    }
  },

  /**
   * Get current admin profile
   */
  getAdminProfile: async () => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.ADMIN.PROFILE);
      console.log('API Response (Admin Profile):', response.data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      throw new Error(error.response?.data?.message || 'فشل في جلب بيانات الملف الشخصي للمدير');
    }
  },

  /**
   * Get all admins
   */
  getAllAdmins: async () => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.ADMIN.LIST);
      console.log('API Response (All Admins):', response.data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error(error.response?.data?.message || 'فشل في جلب قائمة المديرين');
    }
  },

  /**
   * Resend activation OTP to admin
   */
  resendAdminOTP: async (adminId) => {
    try {
      const response = await axiosClient.patch(API_ENDPOINTS.ADMIN.RESEND_OTP(adminId));
      return response.data;
    } catch (error) {
      console.error(`Error resending OTP for admin ${adminId}:`, error);
      throw new Error(error.response?.data?.message || 'فشل في إعادة إرسال رمز التفعيل');
    }
  }
};