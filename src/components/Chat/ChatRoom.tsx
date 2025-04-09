"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useState, useRef, useEffect } from "react";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ChatRoom = ({ roomId }: { roomId: string }) => {
  const {
    messages,
    userCount,
    sendMessage,
    loadMoreMessages,
    hasMore,
    onlineUsers,
  } = useChatSocket(roomId);
  const { data: you } = useCurrentUser();
  const didLoadRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // 🧠 Scroll xuống dưới cùng
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  // 🔁 Scroll khi load lần đầu
  useEffect(() => {
    if (messages.length > 0 && firstRender.current) {
      scrollToBottom();
      firstRender.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (!didLoadRef.current && messages.length === 0) {
      loadMoreMessages(undefined);
      didLoadRef.current = true;
    }
  }, [messages]);

  // 🌀 Infinite scroll để load thêm tin nhắn cũ
  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop === 0) {
      const prevScrollHeight = container.scrollHeight;

      const lastMessageId = messages[0]?.id;
      if (lastMessageId) {
        await loadMoreMessages(lastMessageId);
      }

      // ⚙️ Giữ nguyên vị trí scroll sau khi load thêm
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
      }, 0);
    }
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, [messages, hasMore]);

  const handleSendMessage = (content: string) => {
    sendMessage({
      content,
      userId: you?.id || "haha",
      roomId,
    });

    // 🧲 Auto scroll xuống cuối khi mình gửi tin nhắn
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 border-r">
        <UserList users={onlineUsers || []} />
      </div>

      <div className="flex flex-col w-4/5 min-h-0">
        <ChatHeader roomName="General Discussion" membersCount={userCount} />
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50 h-[calc(100vh-160px)]"
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.user?.id === you?.id}
            />
          ))}
        </div>
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
