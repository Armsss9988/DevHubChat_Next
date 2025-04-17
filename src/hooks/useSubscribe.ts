// hooks/useSubscribe.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  isSubscribeFromRoom,
  subscribeToRoom,
  unsubscribeFromRoom,
} from "@/services/subscribe";

export const useSubscribeRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => subscribeToRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isSubscribed"] });
    },
  });
};

export const useUnsubscribeRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => unsubscribeFromRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isSubscribed"] });
    },
  });
};
export const useCheckSubscribeRoom = (
  roomId: string
): UseQueryResult<boolean, Error> => {
  return useQuery<boolean, Error>({
    queryKey: ["isSubscribed", roomId],
    queryFn: () => isSubscribeFromRoom(roomId),
    enabled: !!roomId,
    refetchOnWindowFocus:false
  });
};
