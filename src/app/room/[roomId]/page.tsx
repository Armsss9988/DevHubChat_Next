"use client";
import ChatRoom from "@/components/Chat/ChatRoom";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const param = useParams();
  const { roomId } = param;
  return (
    <div className="min-w-full h-full bg-transparent overflow-hidden">
      <ChatRoom roomId={(roomId as string) || "1"} />
    </div>
  );
}
