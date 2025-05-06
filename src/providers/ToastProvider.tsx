// components/providers/ToastProvider.tsx
"use client";

import React, { createContext, useContext } from "react";
import { message } from "antd";
import "@ant-design/v5-patch-for-react-19";
const ToastContext = createContext<ReturnType<typeof message.useMessage> | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <ToastContext.Provider value={[messageApi, contextHolder]}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useGlobalToast must be used within ToastProvider");
  return context;
};
