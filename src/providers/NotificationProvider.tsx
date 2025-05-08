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
    onConfirm: () => Promise<void> | void,
    loading?: boolean
  ) => void;
  handleCancel: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  requestConfirmation: () => {},
  handleCancel: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification({ top: 70 });

  const { requestConfirmation, ConfirmationDialog, handleCancel } =
    useConfirmation();
  const notify = (
    type: "success" | "error" | "info" | "warning",
    message: string,
    description?: string
  ) => {
    api[type]({
      placement: "topRight",
      message,
      description,
    });
  };

  return (
    <NotificationContext.Provider
      value={{ notify, requestConfirmation, handleCancel }}
    >
      {contextHolder}
      <ConfirmationDialog />
      {children}
    </NotificationContext.Provider>
  );
};
