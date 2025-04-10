"use client";
import ChatRoom from "@/components/Chat/ChatRoom";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const param = useParams();
  const { roomId } = param;
  return (
    <div className="min-w-screen h-full bg-transparent">
      <ChatRoom roomId={(roomId as string) || "1"} />
    </div>
  );
}
