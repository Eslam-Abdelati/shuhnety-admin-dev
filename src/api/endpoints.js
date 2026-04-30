export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/admins/login',
        FORGOT_PASSWORD: '/admins/forgot-password',
        VERIFY_RESET_CODE: '/admins/verify-reset-code',
        RESEND_CODE: '/admins/resend-verification-code',
        RESET_PASSWORD: '/admins/reset-password',
        LOGOUT: '/admins/logout',
    },
    ADMIN: {
        PROFILE: '/admins/me',
        LIST: '/admins/all',
        CREATE: '/admins/create',
        RESEND_OTP: (id) => `/admins/resend-otp/${id}`,
        ACTIVATE: '/admins/activate',
    },
    DASHBOARD: {
        ALL_USERS: '/dashboard/users',
        USER_DETAILS: (id) => `/dashboard/${id}/user`,
        UPDATE_USER_STATUS: (id) => `/dashboard/${id}/user/status`,
    },
};
