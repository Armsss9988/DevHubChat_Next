"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useState } from "react";
import UserList from "./UserList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ChatRoom = ({ roomId }: { roomId: string }) => {
  const { messages, userCount, sendMessage } = useChatSocket(roomId);
  const { data: you } = useCurrentUser();
  const [users] = useState([
    { name: you.username || "" },
    { name: "John Doe" },
    { name: "Alice Smith" },
  ]);

  const handleSendMessage = (content: string) => {
    sendMessage({
      content,
      userId: you?.id || "haha",
      roomId,
    });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/5 border-r">
        <UserList users={users} />
      </div>

      <div className="flex flex-col w-4/5">
        <ChatHeader roomName="General Discussion" membersCount={userCount} />
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} isMe={msg.user?.id === you?.id} />
          ))}
        </div>
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatRoom;
