import axiosInstance from "@/configs/axiosConfig";

export const getChatHistory = async (
  roomId: string,
  lastMessageId?: string
) => {
  const response = await axiosInstance.get(`/rooms/messages/${roomId}`, {
    params: { lastMessageId },
  });
  return response.data;
};
