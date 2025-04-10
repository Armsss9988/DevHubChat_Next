import axiosConfig from "@/configs/axiosConfig";

export const createRoom = async (name: string, description: string) => {
  const response = await axiosConfig.post("/rooms", {
    name,
    description,
  });
  return response.data;
};

export const getRooms = async () => {
  const response = await axiosConfig.get("/rooms");
  return response.data;
};
export const filterRooms = async (name?: string, page = 1, pageSize = 10) => {
  const params = { page, pageSize, name };
  const response = await axiosConfig.get(`/rooms/filter`, { params });
  return response.data;
};

export const updateRoom = async (
  id: string,
  name: string,
  description: string
) => {
  const response = await axiosConfig.put(`/rooms/${id}`, {
    name,
    description,
  });
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await axiosConfig.delete(`/rooms/${id}`);
  return response.data;
};
