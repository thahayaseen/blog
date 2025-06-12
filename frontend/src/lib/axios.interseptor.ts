import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { HelperLogout } from "../router/protected.route";

interface ApiResponse {
  ok: boolean;
}
console.log(import.meta.env.VITE_SERVER_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // const logout=getLogout()
    // if (error.response && error.response.status === 401) {
    //   try {
    //     console.log("Refreshing token...");
    //     const response = await api.post<ApiResponse>("/auth/refresh");
    //     if (!response.data.ok) {
    //       HelperLogout();
    //       return;
    //     }
    //     if (error.config) {
    //       return api.request(error.config);
    //     }
    //   } catch (refreshError) {
    //     HelperLogout();
    //   }
    // }
    // if (error.response && error.response.status === 429) {
    //   const retryAfter = error.response.headers["retry-after"];
    //   const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 900000;
    //   toast.warn(
    //     `Rate limit exceeded, retrying in ${waitTime / 1000} seconds...`
    //   );
    //   await new Promise((resolve) => setTimeout(resolve, waitTime));
    //   if (error.config) {
    //     return api.request(error.config);
    //   }
    // }
    return Promise.reject(error?.response?.data);
  }
);
export default api;
