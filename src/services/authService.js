import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/endpoints';
import Cookies from 'js-cookie';
export const authService = {
    /**
         * Login user
         * @param {Object} credentials 
         */
    login: async (credentials) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

            const dataRoot = response.data?.data || response.data;
            const token = dataRoot?.token || dataRoot?.accessToken || dataRoot?.access_token || response.data?.token;
            const user = dataRoot?.user || dataRoot;
            const role = dataRoot?.role || user?.role || response.data?.role;

            if (token) {
                Cookies.set('access_token', token, { expires: 7, path: '/' });
                if (role) {
                    Cookies.set('role', role, { expires: 7, path: '/' });
                }
            }

            return {
                ...response.data,
                access_token: token,
                user: user,
                role: role,
                full_name: (user?.full_name || response.data?.full_name || dataRoot?.full_name)
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى');
        }
    },

    /**
     * Send forgot password code
     * @param {string} email 
     */
    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw new Error(error.response?.data?.message || 'فشل إرسال رمز استعادة كلمة المرور');
        }
    },

    /**
     * Verify reset password code
     * @param {string} email 
     * @param {string|number} code 
     */
    verifyResetCode: async (email, code) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
                email,
                code: Number(code)
            });
            return response.data;
        } catch (error) {
            console.error('Verify reset code error:', error);
            throw new Error(error.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
        }
    },

    /**
 * Resend verification code
 * @param {string} email 
 */
    resendCode: async (email) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESEND_CODE, { email });
            return response.data;
        } catch (error) {
            console.error('Resend code error:', error);
            throw new Error(error.response?.data?.message || 'فشل إعادة إرسال الرمز');
        }
    },
    /**
     * Reset password
     * @param {Object} resetData { userId, password, confirm_password }
     */
    resetPassword: async (resetData) => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                userId: Number(resetData.userId),
                password: resetData.password,
                confirm_password: resetData.confirm_password
            });
            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            const errorMessage = error.response?.data?.message ||
                (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : 'فشل إعادة تعيين كلمة المرور');
            throw new Error(errorMessage);
        }
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        try {
            const response = await axiosClient.get(API_ENDPOINTS.USER.PROFILE);
            const user = response.data?.data || response.data;
            return user;
        } catch (error) {
            console.error('Get profile error:', error);
            throw new Error(error.response?.data?.message || 'فشل تحميل بيانات المستخدم');
        }
    },


    /**
     * Logout user
     */
    logout: async () => {
        try {
            await axiosClient.get(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove('access_token');
            Cookies.remove('role');
            window.location.href = '/login';
        }
    },
}