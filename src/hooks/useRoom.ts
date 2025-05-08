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
  });
};

export const useCheckExistJoinRoom = () => {
  return useMutation({
    mutationFn: (roomId: string) => checkExistJoin(roomId),
    onSuccess: () => {
      console.log("Ta gọi được nha");
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
  });
};

export const useGetRoomById = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 0,
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
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => await deleteRoom(id),
    onSuccess: (data: Room, id: string) => {
      console.log("Xoá thành công Room có ID:", id);
      const roomId = id;
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room", roomId] });
      message.success("Room deleted successfully!");
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
