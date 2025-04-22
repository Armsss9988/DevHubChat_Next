"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useRef, useEffect, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { ChevronDown } from "lucide-react";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useGetRoomById } from "@/hooks/useRoom";
import { useAppSelector } from "@/redux/hook";
import MessageBubble from "./MessageBubble";
import {
  useCheckSubscribeRoom,
  useSubscribeRoom,
  useUnsubscribeRoom,
} from "@/hooks/useSubscribe";

// CSS cho hiệu ứng tin nhắn mới
const messageStyles = `
  .message-enter {
    opacity: 0;
    transform: translateY(20px);
    will-change: opacity, transform;
  }
  .message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-out, transform 300ms ease-out;
  }
`;

const ChatRoom = ({ roomId }: { roomId: string }) => {
  const { messages, sendMessage, loadMoreMessages, hasMore } =
    useChatSocket(roomId);
  const { data: room } = useGetRoomById(roomId);
  const you = useAppSelector((state) => state.auth.user);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const firstRender = useRef(true);
  const didLoadRef = useRef(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { data: checkSub } = useCheckSubscribeRoom(roomId);
  const { mutateAsync: subscribe } = useSubscribeRoom();
  const { mutateAsync: unsubscribe } = useUnsubscribeRoom();

  // Xử lý đăng ký/hủy đăng ký phòng
  const handleToggleSub = async () => {
    if (checkSub) {
      await unsubscribe(roomId);
    } else {
      await subscribe(roomId);
    }
  };

  // Cuộn xuống cuối với hiệu ứng mượt
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // Tải thêm tin nhắn khi cuộn lên đầu
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || !chatContainerRef.current) return;

    const prevScrollHeight = chatContainerRef.current.scrollHeight;
    const lastMessageId = messages[0]?.id;
    if (lastMessageId) {
      await loadMoreMessages(lastMessageId);
      requestAnimationFrame(() => {
        const newScrollHeight = chatContainerRef.current?.scrollHeight || 0;
        if (chatContainerRef.current)
          chatContainerRef.current.scrollTop =
            newScrollHeight - prevScrollHeight;
      });
    }
  }, [hasMore, messages, loadMoreMessages]);

  // Theo dõi khi cuộn đến đầu bằng IntersectionObserver
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { root: container, threshold: 0.1 }
    );

    const firstMessage = container.querySelector(".message-enter");
    if (firstMessage) {
      observerRef.current.observe(firstMessage);
    }

    return () => observerRef.current?.disconnect();
  }, [handleLoadMore, hasMore]);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (!firstRender.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Cuộn lần đầu khi tải tin nhắn
  useEffect(() => {
    if (messages.length > 0 && firstRender.current) {
      scrollToBottom();
      firstRender.current = false;
    }
  }, [messages, scrollToBottom]);

  // Tải tin nhắn ban đầu
  useEffect(() => {
    if (!didLoadRef.current && messages.length === 0) {
      loadMoreMessages(undefined);
      didLoadRef.current = true;
    }
  }, [messages, loadMoreMessages]);

  // Gửi tin nhắn
  const handleSendMessage = (content: string) => {
    sendMessage({
      content,
      userId: you?.id || "haha",
      roomId,
    });
  };

  if (!room) return null;

  return (
    <div className="flex flex-col h-full flex-1 rounded-t-2xl overflow-hidden">
      <style>{messageStyles}</style>
      <div className="flex items-center justify-between p-3 border-b bg-gradient-to-br from-[#0e831d] to-[#576752] shadow-[10px_10px_5px_rgba(0,0,0,0.3)] z-10 gap-3">
        <div className="flex items-center flex-row justify-between w-full">
          <ChatHeader
            roomName={room?.name || ""}
            description={room?.description || ""}
          />
          <div className="hidden md:flex flex-row gap-3 items-center">
            <span className="bg-gradient-to-r from-[#f7e6d3] to-[#d2a679] text-[#4b2e13] font-semibold px-3 py-1 rounded-md shadow-sm shadow-[#b3875a] hover:shadow-md hover:shadow-[#8c5f3b] hover:brightness-105 transition duration-300">
              {room?.roomCode}
            </span>
            <button
              onClick={handleToggleSub}
              className={`bg-gradient-to-br ${
                checkSub
                  ? "from-[#c2f0c2] to-[#6de36d]"
                  : "from-[#cc5511] to-[#403d04]"
              } text-[#165831] font-semibold py-1.5 px-4 rounded-xl shadow-lg shadow-[#3d7e3d] hover:from-[#a9e4a9] hover:to-[#57cc57] hover:shadow-xl hover:shadow-[#2e6b2e] transition-all duration-300 ease-in-out`}
            >
              {checkSub ? "Đã đăng ký" : "Chưa đăng ký"}
            </button>
          </div>
          <div className="relative md:hidden mt-3 w-full flex justify-end">
            <span
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex flex-row items-center gap-2 px-3 py-1.5 bg-[#eee1d1] text-[#4b2e13] rounded-md font-medium shadow hover:brightness-105 transition"
            >
              <MenuFoldOutlined />
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openDropdown ? "rotate-180" : ""
                }`}
              />
            </span>
            {openDropdown && (
              <div className="absolute right-0 mt-10 w-56 bg-white border border-[#d4cbb4] rounded-md shadow-lg p-4 space-y-3 z-10">
                <div className="bg-gradient-to-r from-[#f7e6d3] to-[#d2a679] text-[#4b2e13] font-semibold px-3 py-1 rounded-md shadow-sm shadow-[#b3875a]">
                  Mã phòng: {room?.roomCode}
                </div>
                <button
                  onClick={handleToggleSub}
                  className="bg-gradient-to-br from-[#c2f0c2] to-[#6de36d] text-[#165831] font-semibold py-1.5 px-4 rounded-xl shadow-lg shadow-[#3d7e3d] hover:from-[#a9e4a9] hover:to-[#57cc57] hover:shadow-xl hover:shadow-[#2e6b2e] transition-all duration-300 ease-in-out"
                >
                  {checkSub ? "Hủy đăng ký" : "Đăng ký phòng"}
                </button>
              </div>
            )}
          </div>
        </div>
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
        <div ref={scrollAnchorRef} />
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;
