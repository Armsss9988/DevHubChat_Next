// hooks/useChatSocket.ts
import { useEffect, useState } from "react";
import { getSocket, waitForSocketConnection } from "@/services/socket";
import { getChatHistory } from "@/services/message";

interface RoomUserCount {
  roomId: string;
  count: number;
}

export const useChatSocket = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [onlineUsers, setOnlineUsers] = useState<
    {
      id: string;
      username: string;
    }[]
  >();
  const [isConnected, setIsConnected] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
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
        socket.on("room_users_updated", ({ users, count }) => {
          setOnlineUsers(users);
          setUserCount(count);
        });
        socket.on("receive_message", handleMessage);
        socket.on("room_user_count_updated", handleUserCount);

        return () => {
          // socket.emit("leave_room", roomId);
          socket.off("room_users_updated", ({ users, count }) => {
            setOnlineUsers(users);
            setUserCount(count);
          });
          socket.off("receive_message", handleMessage);
          socket.off("room_user_count_updated", handleUserCount);
          setMessages([]);
          setHasMore(true);
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
  const loadMoreMessages = async (lastMessageId: string | undefined) => {
    try {
      const olderMessages = await getChatHistory(roomId, lastMessageId);
      if (olderMessages.length === 0) {
        setHasMore(false); // No more messages to load
      } else {
        setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    }
  };

  return {
    messages,
    userCount,
    sendMessage,
    loadMoreMessages,
    hasMore,
    onlineUsers,
  };
};
