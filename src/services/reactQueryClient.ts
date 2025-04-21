import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { handleApiError } from "./handleApiError";

export const createQueryClient = (
  notify: (
    type: "error" | "success" | "info" | "warning",
    message: string,
    description: string
  ) => void
) => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.fetchFailureCount === 3) {
          notify("error", "Error", handleApiError(error));
        }
      },
    }),
    mutationCache: new MutationCache({
      // Mutation không có fetchFailureCount, ta dùng context
      onError: (error, _variables, context, mutation) => {
        if (mutation.state.failureCount === 3) {
          notify("error", "Mutation Error", handleApiError(error));
        }
      },
    }),
    defaultOptions: {
      mutations: {},
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    },
  });
};
