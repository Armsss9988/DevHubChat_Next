import axios from "@/configs/axiosConfig";

export const getMyNotifications = async () => {
  const res = await axios.get("/notifications/me");
  return res.data;
};

export const markRoomAsRead = async (roomId: string) => {
  const res = await axios.patch("/notifications/mark-room-read", { roomId });
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await axios.patch("/notifications/mark-all-read");
  return res.data;
};
