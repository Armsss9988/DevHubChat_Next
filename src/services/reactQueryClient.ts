import { QueryClient, QueryCache } from "@tanstack/react-query";
import { handleApiError } from "./handleApiError";
import { message } from "antd";
export const createQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.fetchFailureCount === 3) {
          message.error(handleApiError(error));
        }
      },
    }),
    defaultOptions: {
      mutations: {
        onError: (error) => {
          message.error(handleApiError(error));
        },
        retry: 0,
      },
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
      },
    },
  });
};
