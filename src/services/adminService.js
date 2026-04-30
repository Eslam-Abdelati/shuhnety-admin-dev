import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const adminService = {
    /**
     * Create a new admin
     * @param {Object} adminData { full_name, email, phone_number, role }
     */
    createAdmin: async (adminData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.ADMIN.CREATE, adminData);
            return response.data;
        } catch (error) {
            console.error('Create admin error:', error);
            throw new Error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء حساب المدير');
        }
    },

    /**
     * Get all admins
     */
    getAllAdmins: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.ADMIN.LIST);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('Get all admins error:', error);
            throw new Error(error.response?.data?.message || 'فشل تحميل قائمة المديرين');
        }
    }
};
