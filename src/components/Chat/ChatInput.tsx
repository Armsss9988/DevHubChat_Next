import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";

const ChatInput = ({ onSend }: { onSend: (content: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t px-4 py-2 bg-white flex items-center">
      <Input.TextArea
        autoSize={{ minRows: 1, maxRows: 3 }}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mr-2"
      />
      <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
    </div>
  );
};

export default ChatInput;