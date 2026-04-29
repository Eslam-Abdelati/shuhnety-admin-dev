export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/admins/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_RESET_CODE: '/auth/verify-reset-code',
        RESEND_CODE: '/auth/resend-verification-code',
        RESET_PASSWORD: '/auth/reset-password',
        LOGOUT: '/auth/logout',
    },
    USER: {
        PROFILE: '/users/me',
        // In case update profile is needed, often same as /users/me with PUT/PATCH
        UPDATE_PROFILE: '/users/me',
    },
    DASHBOARD: {
        ALL_USERS: '/dashboard/users',
        USER_DETAILS: (id) => `/dashboard/${id}/user`,
        UPDATE_USER_STATUS: (id) => `/dashboard/${id}/user/status`,
    },
};


