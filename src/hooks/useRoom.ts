import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  getRooms,
  updateRoom,
  deleteRoom,
  filterRooms,
  getRoomById,
} from "@/services/room";
import { message } from "antd";

export const useGetRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });
};
export const useFilterRooms = (
  name: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["filterRooms", name, page, pageSize],
    queryFn: () => filterRooms(name, page, pageSize),
  });
};
export const useGetRoomById = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId, // Chỉ chạy query nếu roomId tồn tại
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => createRoom(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      console.log("Tao gọi được nha");
    },
    onError: (error: unknown) => {
      console.error("Failed to create room:", error);
      message.error("Failed to create room. Please try again.");
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description: string;
    }) => await updateRoom(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      message.success("Room updated successfully!");
    },
    onError: (error: unknown) => {
      console.error("Failed to update room:", error);
      message.error("Failed to update room. Please try again.");
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      message.success("Room deleted successfully!");
    },
    onError: (error: unknown) => {
      console.error("Failed to delete room:", error);
      message.error("Failed to delete room. Please try again.");
    },
  });
};
