"use client";

import { Button, Form, Image, Input } from "antd";
import {
  PaperClipOutlined,
  SendOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type FileData = {
  buffer: number[];
  mimetype: string;
  originalname: string;
};

type Props = {
  onSend: (message: string, files: FileData[]) => void;
};

const ChatInput = ({ onSend }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm<{ message: string }>();

  const handleSend = async (values: { message: string }) => {
    const message = values?.message || "";
    if (!message?.trim() && files.length === 0) return;

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
    form.resetFields();
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
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file: File) => {
    const url = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      return (
        <Image
          src={url}
          alt={file.name}
          className="max-w-full max-h-full object-fill rounded"
        />
      );
    }
    if (file.type.startsWith("audio/")) {
      return <audio controls src={url} className="w-full" />;
    }
    if (file.type === "application/pdf") {
      return <FilePdfOutlined style={{ fontSize: 32, color: "#e74c3c" }} />;
    }
    if (file.type.includes("wordprocessingml")) {
      return <FileWordOutlined style={{ fontSize: 32, color: "#3498db" }} />;
    }
    return <FileUnknownOutlined style={{ fontSize: 32, color: "#7f8c8d" }} />;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };


  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = form.getFieldValue("message") || "";
    form.setFieldsValue({
      message: currentMessage + emojiData.emoji,
    });
    setShowEmojiPicker(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative border-t px-4 py-2 bg-white dark:bg-neutral-900"
    >
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative rounded p-2 w-30 h-30 flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center">
                {renderFilePreview(file)}
                <span className="h-[10px] text-[10px] text-ellipsis flex-nowrap">
                  {file.name}
                </span>
              </div>
              <CloseCircleOutlined
                className="absolute top-0.5 right-0.5 !text-gray-900 cursor-pointer"
                onClick={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}

      <Form form={form} onFinish={handleSend} className="flex gap-2 !pb-0 !mb-0">
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

        <Button
          icon={<SmileOutlined />}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />

        <Form.Item name="message" className="flex-1 m-0 !pb-0 !mb-0">
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Nhập tin nhắn hoặc kéo thả file vào đây..."
            onKeyDown={handleKeyDown}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="m-0 !pb-0 !mb-0">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            className="bg-green-500 hover:bg-green-600 border-none"
          />
        </Form.Item>
      </Form>

      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-16 left-2 z-10 bg-white dark:bg-neutral-800 rounded shadow-lg"
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
