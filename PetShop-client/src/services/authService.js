import { authApi } from "../api/authApi";
import { setToken, removeToken } from "../utils/token";
const handleError = (error) => {

    return error?.response?.data?.errors || error?.response?.data || "Có lỗi xảy ra";
};
export const authService = {
    // Login
    login: async (data) => {
        const res = await authApi.login(data);

        const token = res.data.accessToken;

        setToken(token);

        return token;
    },
    //  Register
    register: async (data) => {
        return await authApi.register(data);
    },

    verifyOtp: async ({ email, otp }) => {
        try {
            const res = await authApi.verifyOtp({ email, otp });
            return res.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    // ================= RESEND OTP =================
    resendOtp: async ({ email }) => {
        try {
            const res = await authApi.resendOtp({ email });
            return res.data;
        } catch (error) {
            throw handleError(error);
        }
    },
    //  Logout
    logout: async () => {
        try {
            await authApi.logout();
        } finally {
            removeToken();
        }
    },

    refresh: async () => {
        const res = await authApi.refresh();

        const newToken = res.data.accessToken;

        setToken(newToken);

        return newToken;
    },
};