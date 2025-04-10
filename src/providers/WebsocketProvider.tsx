"use client";
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/services/socket";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const WebsocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: user } = useCurrentUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true); // ✅ Đánh dấu đã client-side render
  }, []);
  useEffect(() => {
    const init = async () => {
      if (user) {
        const socket = connectSocket(user.id, user.username);

        socket.on("connect", () => {
          console.log("✅ Socket connected");
          setIsConnected(true);
        });

        socket.on("disconnect", () => {
          console.warn("⚠️ Socket disconnected");
          setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
          console.error("❌ Connect error:", err.message);
          setIsConnected(false);
        });
      }
    };

    init();

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, [user]);
  if (!isClient) return null;
  if (!isConnected) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        🔌 Đang kết nối đến server...
      </div>
    );
  }

  return <>{children}</>;
};
