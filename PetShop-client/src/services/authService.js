import { authApi } from "../api/authApi";
import { setToken, removeToken } from "../utils/auth";

export const authService = {
    // 🔐 Login
    login: async (data) => {
        const res = await authApi.login(data);

        const token = res.data.accessToken;

        setToken(token);

        return token;
    },

    // 📝 Register
    register: async (data) => {
        return await authApi.register(data);
    },

    // 🚪 Logout
    logout: async () => {
        try {
            await authApi.logout();
        } finally {
            removeToken();
        }
    },

    // 🔄 Refresh token
    refresh: async () => {
        const res = await authApi.refresh();

        const newToken = res.data.accessToken;

        setToken(newToken);

        return newToken;
    },
};