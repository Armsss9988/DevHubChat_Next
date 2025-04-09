import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/getCurrentUser";

export function useCurrentUser() {
  return useQuery({ queryKey: ["currentUser"], queryFn: getCurrentUser });
}
