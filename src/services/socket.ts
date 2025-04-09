// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (roomId: string): Socket => {
  const URL = process.env.NEXT_PUBLIC_API_URL ?? "ws://localhost:5000";

  if (!socket || !socket.connected) {
    if (socket) {
      socket.disconnect(); // Clean up any disconnected socket
    }

    socket = io(URL, {
      transports: ["websocket"],
      withCredentials: true,
      query: { roomId },
    });

    console.log("🧠 Initializing new socket for room:", roomId);

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    socket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
    });
  } else {
    console.log("🧠 Reusing existing socket, connected:", socket.connected);
  }

  return socket;
};

// Optional: Add a function to wait for connection
export const waitForSocketConnection = (socket: Socket, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (socket.connected) {
      resolve();
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error("Socket connection timed out"));
    }, timeout);

    socket.on("connect", () => {
      clearTimeout(timeoutId);
      resolve();
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
};