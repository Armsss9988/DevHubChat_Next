"use client";

import { format } from "date-fns";
import Image from "next/image";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";

const MessageBubble = ({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) => {
  const time = format(new Date(message.createdAt || ""), "HH:mm");

  const renderMedia = (
    file: { url: string; type: string; name?: string },
    index: number
  ) => {
    if (file.type.startsWith("image/")) {
      return (
        <div key={index} className="relative w-48 h-48">
          <Image
            src={file.url}
            alt={file.name || "image"}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      );
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div key={index} className="w-full">
          <audio controls src={file.url} className="mt-2 w-full" />
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div key={index} className="flex items-center gap-2 mt-2">
          <FilePdfOutlined style={{ fontSize: 48, color: "#3498db" }} />
          {file.name}
        </div>
      );
    }

    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div key={index} className="flex items-center gap-2 mt-2">
          <FileWordOutlined style={{ fontSize: 48, color: "#3498db" }} />
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-sm"
          >
            {file.name || "View Document"}
          </a>
        </div>
      );
    }

    // File không xác định
    return (
      <div key={index} className="flex items-center gap-2 mt-2">
        <FileUnknownOutlined style={{ fontSize: 48, color: "#7f8c8d" }} />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-sm"
        >
          {file.name || "Download File"}
        </a>
      </div>
    );
  };

  return (
    <div className={`mb-4 flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-3 rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300
        ${
          isMe
            ? "bg-[#2c3e50] text-white rounded-br-none"
            : "bg-[#ecf0f1] text-[#2c3e50] rounded-bl-none"
        }`}
      >
        <div className="mb-1 flex justify-between text-xs font-semibold gap-4">
          <span className={isMe ? "text-white" : "text-[#5d6d7e]"}>
            {message.user?.username || "Unknown"}
          </span>
          <span className={isMe ? "text-white/70" : "text-[#95a5a6]"}>
            {time}
          </span>
        </div>

        {/* Nội dung text */}
        {message.content && (
          <div className="text-sm break-words leading-relaxed">
            {message.content}
          </div>
        )}

        {/* Media files */}
        {message.media && message.media.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {message.media.map((file, index) => renderMedia(file, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
