// hooks/useChatSocket.ts
import { useEffect, useState } from "react";
import { getSocket } from "@/services/socket";
import { getChatHistory } from "@/services/message";

export const useChatSocket = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [onlineUsers, setOnlineUsers] = useState<
    { id: string; username: string }[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.warn("⚠️ No socket instance available.");
      return;
    }

    const handleReceiveMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRoomUsersUpdated = ({
      users,
      count,
    }: {
      users: { id: string; username: string }[];
      count: number;
    }) => {
      setOnlineUsers(users);
      setUserCount(count);
    };

    const handleConnect = () => {
      setIsConnected(true);
      console.log("🔌 Connected to socket.");
      socket.emit("join_room", { roomId });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.warn("❌ Disconnected from socket.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_users_updated", handleRoomUsersUpdated);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit("leave_room", { roomId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_users_updated", handleRoomUsersUpdated);
      setMessages([]);
      setHasMore(true);
      console.log("🧹 Left room:", roomId);
    };
  }, [roomId]);

  const sendMessage = (message: Message, files?: FileData[]) => {
    const socket = getSocket();
    if (isConnected && socket?.connected) {
      socket.emit("send_message", { ...message, files });
    } else {
      console.warn("⚠️ Cannot send message: Not connected");
    }
  };

  const loadMoreMessages = async (lastMessageId: string | undefined) => {
    try {
      const olderMessages = await getChatHistory(roomId, lastMessageId);
      if (olderMessages.length === 0) {
        setHasMore(false);
      } else {
        setMessages((prev) => [...olderMessages, ...prev]);
      }
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
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
