import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyNotifications,
  markAllNotificationsAsRead,
} from '@/services/notification';

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: ()=> getMyNotifications(),
    refetchOnWindowFocus:false
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // invalidate để reload lại danh sách mới
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
