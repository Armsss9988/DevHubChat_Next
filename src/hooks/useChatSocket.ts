// hooks/useChatSocket.ts
import { useEffect, useState } from "react";
import { getSocket, waitForSocketConnection } from "@/services/socket";

interface RoomUserCount {
  roomId: string;
  count: number;
}

export const useChatSocket = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket(roomId);

    const setupSocket = async () => {
      try {
        await waitForSocketConnection(socket);
        setIsConnected(true);

        socket.emit("join_room", { roomId });
        console.log("✅ Joined room:", roomId);

        const handleMessage = (message: Message) => {
          setMessages((prev) => [...prev, message]);
        };

        const handleUserCount = (data: RoomUserCount) => {
          if (data.roomId === roomId) {
            setUserCount(data.count);
          }
        };

        socket.on("receive_message", handleMessage);
        socket.on("room_user_count_updated", handleUserCount);

        return () => {
          socket.emit("leave_room", roomId);
          socket.off("receive_message", handleMessage);
          socket.off("room_user_count_updated", handleUserCount);
          console.log("🧹 Cleanup for room:", roomId);
        };
      } catch (err) {
        console.error("Failed to connect to socket:", err);
      }
    };

    let cleanup: (() => void) | undefined;

    setupSocket().then((result) => {
      cleanup = result;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [roomId]);

  const sendMessage = (message: Message) => {
    const socket = getSocket(roomId);
    if (isConnected && socket.connected) {
      socket.emit("send_message", message);
    } else {
      console.warn("⚠️ Cannot send message: Socket not connected");
    }
  };

  return {
    messages,
    userCount,
    sendMessage,
  };
};
