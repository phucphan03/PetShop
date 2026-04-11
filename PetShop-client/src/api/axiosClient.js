import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7047/api",
    withCredentials: true,
});

// Gắn accessToken
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Auto refresh
axiosClient.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axios.post(
                    "https://localhost:7047/api/authorizes/refresh",
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.accessToken;

                localStorage.setItem("accessToken", newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axiosClient(originalRequest);
            } catch {
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(err);
    }
);

export default axiosClient;