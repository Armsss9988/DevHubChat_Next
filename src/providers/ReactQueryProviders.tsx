"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { createQueryClient } from "@/services/reactQueryClient";
import { useNotificationContext } from "@/providers/NotificationProvider";

export const ReactQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotificationContext();

  const queryClient = useMemo(() => createQueryClient(notify), [notify]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
