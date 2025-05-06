"use client";

import { format } from "date-fns";
// import Image from "next/image";
import { Image } from "antd";
import ReactAudioPlayer from "react-audio-player"; // Thư viện để xử lý file âm thanh
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver"; // Thư viện để tải file

// Các loại file (image, audio, pdf, word, unknown)
type MediaFile = {
  url: string;
  type: string;
  name?: string;
};
const MessageBubble = ({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) => {
  const time = format(new Date(message.createdAt || ""), "HH:mm");

  // Hàm render file media theo loại
  const renderMedia = (file: MediaFile, index: number) => {
    // Xử lý file image
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex flex-col items-center gap-2 mt-2" key={index}>
          <div className="relative w-30 h-30">
            <Image
              src={file.url}
              alt={file.name || "image"}
              // layout="fill"
              // objectFit="contain"
              className="bg-black rounded-md border-2 border-solid"
            />
          </div>
          <span
            className="text-[10px] hover:text-blue-500 cursor-pointer"
            onClick={() => saveAs(file.url, file.name || "image")}
          >
            {file.name || "Không có tên"}
          </span>
        </div>
      );
    }

    // Xử lý file audio
    if (file.type.startsWith("audio/")) {
      return (
        <div key={index} className="w-full mt-2">
          <ReactAudioPlayer src={file.url} controls className="w-full" />
          <span
            className="text-blue-500 text-sm underline mt-1 cursor-pointer hover:text-blue-700"
            onClick={() => saveAs(file.url, file.name || "audio")}
          >
            {file.name || "Không có tên"}
          </span>
        </div>
      );
    }

    // Xử lý file PDF
    if (file.type === "application/pdf") {
      return (
        <div key={index} className="flex items-center gap-2 mt-2">
          <FilePdfOutlined style={{ fontSize: 30, color: "#3498db" }} />
          <span
            className="text-[10px] hover:text-blue-500 cursor-pointer"
            onClick={() => saveAs(file.url, file.name || "document.pdf")}
          >
            {file.name || "Không có tên"}
          </span>
        </div>
      );
    }

    // Xử lý file Word (docx)
    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div key={index} className="flex items-center gap-2 mt-2">
          <FileWordOutlined style={{ fontSize: 30, color: "#3498db" }} />
          <span
            className="text-[10px] hover:text-blue-500 cursor-pointer"
            onClick={() => saveAs(file.url, file.name || "document.docx")}
          >
            {file.name || "Không có tên"}
          </span>
        </div>
      );
    }

    // File không xác định
    return (
      <div key={index} className="flex items-center gap-2 mt-2">
        <FileUnknownOutlined style={{ fontSize: 30, color: "#7f8c8d" }} />
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-sm"
        >
          <span className="text-[10px]">{file.name || "Không có tên"}</span>
        </a>
        <button
          className="text-blue-500 text-sm underline ml-2"
          onClick={() => saveAs(file.url, file.name || "unknown")}
        >
          Tải xuống
        </button>
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

        {/* Render các media files */}
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
