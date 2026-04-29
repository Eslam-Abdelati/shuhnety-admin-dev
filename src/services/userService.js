import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const userService = {
  /**
   * Get all users for the dashboard
   */
  getAllUsers: async (filters = {}) => {
    try {
      const response = await axiosClient.post(API_ENDPOINTS.DASHBOARD.ALL_USERS, filters);
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
  }
};