import axiosInstance from "@/configs/axiosConfig";

export const createRoom = async (data: Room) => {
  const response = await axiosInstance.post("/rooms", data);
  return response.data;
};

export const getRooms = async () => {
  const response = await axiosInstance.get("/rooms");
  return response.data;
};
export const findRoomByCode = async (code: string) => {
  const { data } = await axiosInstance.get(`/rooms/code/${code}`);
  return data;
};

export const checkExistJoin = async (roomId: string) => {
  const response = await axiosInstance.post(`/rooms/check`, { roomId });
  return response.data;
};
export const joinRoom = async (id: string, password: string) => {
  const response = await axiosInstance.post(`/rooms/${id}/join`, { password });
  return response.data;
};
export const filterRooms = async (
  name?: string,
  page = 1,
  pageSize = 10,
  isSub?: boolean,
  owner?: boolean
) => {
  const params = { page, pageSize, name, isSub, owner };
  const response = await axiosInstance.get(`/rooms/filter`, { params });
  return response.data;
};
export const getRoomById = async (roomId: string): Promise<Room> => {
  const response = await axiosInstance.get(`/rooms/${roomId}`);
  return response.data;
};

export const updateRoom = async (
  id: string,
  name: string,
  description: string
) => {
  const response = await axiosInstance.patch(`/rooms/${id}`, {
    name,
    description,
  });
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await axiosInstance.delete(`/rooms/${id}`);
  return response.data;
};
export const getSubscribedRooms = async () => {
  const res = await axiosInstance.get("/rooms/subscribed");
  return res.data;
};

export const getMyRooms = async () => {
  const res = await axiosInstance.get("/rooms/my");
  return res.data;
};
