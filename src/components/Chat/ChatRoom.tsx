"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useRef, useEffect, useState, useCallback } from "react";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { ChevronDown } from "lucide-react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useCheckExistJoinRoom, useGetRoomById } from "@/hooks/useRoom";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { message } from "antd";
import {
  useCheckSubscribeRoom,
  useSubscribeRoom,
  useUnsubscribeRoom,
} from "@/hooks/useSubscribe";
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
  const [openDropdown, setOpenDropdown] = useState(false);
  const { data: checkSub } = useCheckSubscribeRoom(roomId);
  const { mutateAsync: subscribe } = useSubscribeRoom();
  const { mutateAsync: unsubscribe } = useUnsubscribeRoom();
  const handleToggleSub = async () => {
    if (checkSub) {
      await unsubscribe(roomId);
    } else {
      await subscribe(roomId);
    }
  };
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };
  useEffect(() => {
    checkRoom(roomId, {
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
    });
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
          <div
            className={`flex items-center flex-row justify-between w-full  ${
              showUsers && "hidden md:block"
            }`}
          >
            <ChatHeader
              roomName={room?.name || ""}
              description={room?.description || ""}
            />

            {/* Desktop View */}
            <div className="hidden md:flex flex-row gap-3 items-center">
              <span
                className="bg-gradient-to-r from-[#f7e6d3] to-[#d2a679] 
                     text-[#4b2e13] font-semibold px-3 py-1 rounded-md 
                     shadow-sm shadow-[#b3875a] 
                     hover:shadow-md hover:shadow-[#8c5f3b] 
                     hover:brightness-105 transition duration-300"
              >
                {room?.roomCode}
              </span>
              <button
                onClick={handleToggleSub}
                className={`bg-gradient-to-br ${
                  checkSub
                    ? " from-[#c2f0c2] to-[#6de36d]"
                    : "from-[#cc5511] to-[#403d04]"
                }
                     text-[#165831] font-semibold py-1.5 px-4 rounded-xl 
                     shadow-lg shadow-[#3d7e3d] 
                     hover:from-[#a9e4a9] hover:to-[#57cc57] 
                     hover:shadow-xl hover:shadow-[#2e6b2e] 
                     transition-all duration-300 ease-in-out`}
              >
                {!checkSub ? "Unsubscribed" : "Subscribed"}
              </button>
            </div>

            {/* Mobile View Dropdown */}
            <div className={`relative md:hidden mt-3 w-full flex justify-end`}>
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
                  <div
                    className="bg-gradient-to-r from-[#f7e6d3] to-[#d2a679] 
                         text-[#4b2e13] font-semibold px-3 py-1 rounded-md 
                         shadow-sm shadow-[#b3875a]"
                  >
                    Room Code: {room?.roomCode}
                  </div>
                  <button
                    onClick={handleToggleSub}
                    className="bg-gradient-to-br from-[#c2f0c2] to-[#6de36d] 
                     text-[#165831] font-semibold py-1.5 px-4 rounded-xl 
                     shadow-lg shadow-[#3d7e3d] 
                     hover:from-[#a9e4a9] hover:to-[#57cc57] 
                     hover:shadow-xl hover:shadow-[#2e6b2e] 
                     transition-all duration-300 ease-in-out"
                  >
                    {!checkSub ? "Subscribe Room" : "UnSubscribe Room"}
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
        <div className="max-h-12">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
