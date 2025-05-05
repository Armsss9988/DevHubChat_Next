"use client";

import { Button, Input } from "antd";
import {
  PaperClipOutlined,
  SendOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
} from "@ant-design/icons";
import { useState, useRef } from "react";

type FileData = {
  buffer: number[]; // 👈 Vì bạn gửi buffer lên server
  mimetype: string;
  originalname: string;
};

type Props = {
  onSend: (message: string, files: FileData[]) => void;
};

const ChatInput = ({ onSend }: Props) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;
    const filesToSend = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
          buffer: Array.from(new Uint8Array(arrayBuffer)),
          mimetype: file.type,
          originalname: file.name,
        };
      })
    );
    onSend(message.trim(), filesToSend);
    setMessage("");
    setFiles([]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      e.target.value = ""; // clear input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file: File) => {
    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={url}
          alt={file.name}
          className="max-w-full max-h-full object-contain rounded"
        />
      );
    }

    if (file.type.startsWith("audio/")) {
      return <audio controls src={url} className="w-full" />;
    }

    if (file.type === "application/pdf") {
      return <FilePdfOutlined style={{ fontSize: 32, color: "#e74c3c" }} />;
    }

    if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <FileWordOutlined style={{ fontSize: 32, color: "#3498db" }} />;
    }

    return <FileUnknownOutlined style={{ fontSize: 32, color: "#7f8c8d" }} />;
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-t px-4 py-2 bg-white dark:bg-neutral-900"
    >
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative border rounded p-2 w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden"
            >
              {renderFilePreview(file)}
              <CloseCircleOutlined
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          icon={<PaperClipOutlined />}
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,audio/*,.txt"
        />

        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Nhập tin nhắn hoặc kéo thả file vào đây..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg"
        />

        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          className="bg-green-500 hover:bg-green-600 border-none"
        />
      </div>
    </div>
  );
};

export default ChatInput;
