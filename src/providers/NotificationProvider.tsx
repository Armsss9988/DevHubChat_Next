"use client";
import { createContext, useContext } from "react";
import { notification } from "antd";
import useConfirmation, { ConfirmationOptions } from "@/hooks/useConfirmation";

type NotificationContextType = {
  notify: (
    type: "success" | "error" | "info" | "warning",
    message: string,
    description?: string
  ) => void;
  requestConfirmation: (
    title: string,
    message: string,
    type: ConfirmationOptions["type"],
    onConfirm: () => Promise<void> | void
  ) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  requestConfirmation: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const { requestConfirmation, ConfirmationDialog } = useConfirmation();
  const notify = (
    type: "success" | "error" | "info" | "warning",
    message: string,
    description?: string
  ) => {
    api[type]({
      placement: "bottomRight",
      message,
      description,
    });
  };

  return (
    <NotificationContext.Provider value={{ notify, requestConfirmation }}>
      {contextHolder}
      <ConfirmationDialog />
      {children}
    </NotificationContext.Provider>
  );
};
