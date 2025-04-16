"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useRef, useEffect, useState, useCallback } from "react";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useCheckExistJoinRoom, useGetRoomById } from "@/hooks/useRoom";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { message } from "antd";
const ChatRoom = ({ roomId }: { roomId: string }) => {
  const { messages, sendMessage, loadMoreMessages, hasMore, onlineUsers } =
    useChatSocket(roomId);
  const { data: room } = useGetRoomById(roomId);
  const you = useAppSelector((state) => state.auth.user);
  const { mutate: checkRoom } = useCheckExistJoinRoom();
  const didLoadRef = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const [showUsers, setShowUsers] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  useEffect(() => {
    checkRoom(
      { roomId },
      {
        onSuccess: (data) => {
          if (data) {
            messageApi.success("Chào mừng bạn vào room");
          } else {
            router.push("/rooms");
          }
        },
        onError: () => {
          router.push("/rooms");
        },
      }
    );
  }, [checkRoom, messageApi, roomId, router]);
  useEffect(() => {
    if (!firstRender.current) {
      scrollToBottom();
    }
  }, [messages]);
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
  }, [messages, loadMoreMessages]);

  const handleScroll = useCallback(async () => {
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
  }, [hasMore, messages, loadMoreMessages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSendMessage = (content: string) => {
    sendMessage({
      content,
      userId: you?.id || "haha",
      roomId,
    });
  };

  return (
    <div className="flex flex-1 h-full pt-10 bg-transparent overflow-hidden">
      {contextHolder}
      <div
        className={`transition-all duration-300 bg-[#c5b395] md:block h-full z-10 shadow-[10px_10px_5px_rgba(0,0,0,0.3)] rounded-tr-3xl ${
          showUsers ? "w-3/5 md:w-1/5" : "w-0 md:w-1/5 hidden overflow-hidden"
        }`}
      >
        <UserList users={onlineUsers || []} />
      </div>

      <div className="flex flex-col h-full flex-1 rounded-t-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b bg-[#165831] shadow-[10px_10px_5px_rgba(0,0,0,0.3)] z-1 gap-3">
          <button
            className="md:hidden text-[#c5ecd2] text-3xl"
            onClick={() => setShowUsers(!showUsers)}
          >
            {showUsers ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
          <ChatHeader
            roomName={room?.name || ""}
            description={room?.description || ""}
          />
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
          <div ref={scrollAnchorRef} /> {/* 🔻 Đây là anchor ở cuối */}
        </div>
        <div className="h-12">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
