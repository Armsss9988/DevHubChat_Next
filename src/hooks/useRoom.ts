import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  filterRooms,
  getRoomById,
  joinRoom,
  checkExistJoin,
  findRoomByCode,
  getMyRooms,
  getSubscribedRooms,
} from "@/services/room";
import { message } from "antd";

export const useFilterRooms = (
  name: string,
  page: number,
  pageSize: number,
  isSub: boolean,
  owner: boolean
) => {
  return useQuery({
    queryKey: ["rooms", name, page, pageSize, isSub, owner],
    queryFn: () => filterRooms(name, page, pageSize, isSub, owner),
    refetchOnWindowFocus: false,
  });
};

export const useFindRoomByCode = () => {
  return useMutation({
    mutationFn: (code: string) => findRoomByCode(code),
    onSuccess: () => {
      console.log("Ta gọi được nha");
    },
    onError: (error: unknown) => {
      console.error("Failed to check room:", error);
      message.error("Failed to check room. Please try again.");
    },
  });
};

export const useCheckExistJoinRoom = () => {
  return useMutation({
    mutationFn: (roomId: string) => checkExistJoin(roomId),
    onSuccess: () => {
      console.log("Ta gọi được nha");
    },
    onError: (error: unknown) => {
      console.error("Failed to check room:", error);
      message.error("Failed to check room. Please try again.");
    },
  });
};

export const useJoinRoom = () => {
  return useMutation({
    mutationFn: ({ roomId, password }: { roomId: string; password: string }) =>
      joinRoom(roomId, password),
    onSuccess: () => {
      console.log("Ta gọi được nha");
    },
    onError: (error: unknown) => {
      console.error("Failed to join room:", error);
      message.error("Failed to join room. Please try again.");
    },
  });
};

export const useGetRoomById = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus: false,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Room) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      console.log("Ta gọi được nha");
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
export const useMyRooms = () =>
  useQuery({
    queryKey: ["myRooms"],
    queryFn: getMyRooms,
  });

// Danh sách các phòng user đã subscribe
export const useSubscribedRooms = () =>
  useQuery({
    queryKey: ["subscribedRooms"],
    queryFn: getSubscribedRooms,
  });
