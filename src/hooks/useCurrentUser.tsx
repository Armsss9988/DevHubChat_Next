import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/getCurrentUser";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  });
}
