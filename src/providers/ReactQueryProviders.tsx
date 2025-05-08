"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { createQueryClient } from "@/services/reactQueryClient";


export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
