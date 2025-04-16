// services/api/subscribe.api.ts
import axiosInstance from "@/configs/axiosConfig";

export const subscribeToRoom = async (roomId: string) => {
  const res = await axiosInstance.post(`/subscribe/${roomId}`);
  return res.data;
};

export const unsubscribeFromRoom = async (roomId: string) => {
  const res = await axiosInstance.delete(`/subscribe/${roomId}`);
  return res.data;
};
export const isSubscribeFromRoom = async (roomId: string) => {
  const res = await axiosInstance.get(`/subscribe/${roomId}`);
  return res.data;
};
