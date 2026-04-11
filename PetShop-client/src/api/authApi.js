import axiosClient from "./axiosClient";

export const authApi = {
    login: (data) => axiosClient.post("/authorizes/login", data),
    register: (data) => axiosClient.post("/authorizes/register", data),
    logout: () => axiosClient.post("/authorizes/logout"),
    refresh: () => axiosClient.post("/authorizes/refresh"),
};