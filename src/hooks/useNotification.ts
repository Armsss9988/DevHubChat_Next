import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markRoomAsRead,
} from "@/services/notification";

export const useNotifications = (enable: boolean) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getMyNotifications(),
    refetchOnWindowFocus: false,
    enabled: enable,
  });
};
export const useMarkRoomAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => markRoomAsRead(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
