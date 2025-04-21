import { QueryClient, QueryCache } from "@tanstack/react-query";
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
          notify("error", "Lỗi", handleApiError(error));
        }
      },
    }),
    defaultOptions: {
      mutations: {
        onError: (error) => {
          notify("error", "Lỗi", handleApiError(error));
        },
      },
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    },
  });
};
