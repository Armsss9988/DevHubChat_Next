"use client";
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/services/socket";
import { useAppSelector } from "@/redux/hook";

export const WebsocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAppSelector((state) => state.auth.user);
  // const [isConnected, setIsConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user?.id || !user.username) return;

    const socket = connectSocket(user.id, user.username);

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      // setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
      // setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connect error:", err.message);
      // setIsConnected(false);
    });

    return () => {
      disconnectSocket();
      // setIsConnected(false);
    };
  }, [user?.id, user?.username]);

  if (!isClient) return null;
  // if (!isConnected && user) {
  //   return (
  //     <div className="w-full h-screen flex items-center justify-center text-lg">
  //       🔌 Đang kết nối đến server...
  //     </div>
  //   );
  // }

  return <>{children}</>;
};
