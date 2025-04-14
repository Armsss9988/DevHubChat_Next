import axiosInstance from "@/configs/axiosConfig";

export async function getCurrentUser() {
  const res = await axiosInstance.get("/auth/me", { withCredentials: true });
  return res.data;
}
