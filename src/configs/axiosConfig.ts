import axios from "axios";
axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refresh = await axiosInstance.post("/auth/refresh", {
          withCredentials: true,
        });
        if (refresh.status === 200 || refresh.status === 201) {
          // Retry original request
          error.config.headers[
            "Authorization"
          ] = `Bearer ${refresh.data.accessToken}`;
          return axiosInstance(error.config);
        }
        window.location.href = `/login?callbackUrl=${window.location.pathname}`;
      } catch {}
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
