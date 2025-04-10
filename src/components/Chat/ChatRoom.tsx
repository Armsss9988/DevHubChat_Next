"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useRef, useEffect, useState } from "react";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

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
  const [showUsers, setShowUsers] = useState(false);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

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

  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container || !hasMore) return;

    if (container.scrollTop === 0) {
      const prevScrollHeight = container.scrollHeight;
      const lastMessageId = messages[0]?.id;
      if (lastMessageId) {
        await loadMoreMessages(lastMessageId);
      }
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
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-green-100">
      <div
        className={`transition-all duration-300 bg-white border-r md:block h-full z-10 absolute md:static ${
          showUsers ? "w-4/5 md:w-1/5" : "w-0 md:w-1/5 hidden"
        }`}
      >
        <UserList users={onlineUsers || []} />
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between p-3 border-b bg-[#165831] shadow-md">
          <button
            className="md:hidden text-green-800"
            onClick={() => setShowUsers(!showUsers)}
          >
            {showUsers ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
          <ChatHeader roomName="General Discussion" membersCount={userCount} />
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-2 bg-[#b3cbb3]"
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