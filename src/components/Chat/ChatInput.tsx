"use client";

import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";

const ChatInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed) {
      onSend(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // chặn xuống dòng
      handleSend();
    }
  };

  return (
    <div className="border-t h-12 px-4 py-2 bg-white dark:bg-neutral-900 flex items-end">
      <Input.TextArea
        ref={textAreaRef}
        autoSize={{ minRows: 1, maxRows: 4 }}
        placeholder="Nhập tin nhắn..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="mr-2 rounded-lg"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        className="bg-green-500 hover:bg-green-600 border-none"
      />
    </div>
  );
};

export default ChatInput;
