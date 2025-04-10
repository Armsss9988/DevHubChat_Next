// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: string, username: string) => {
  const URL = process.env.NEXT_PUBLIC_API_URL ?? "ws://localhost:5000";

  if (!socket || !socket.connected) {
    socket = io(URL, {
      transports: ["websocket"],
      withCredentials: true,
      query: { userId, username },
      reconnection: true, // auto reconnect
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("🧹 Socket disconnected manually");
  }
};
