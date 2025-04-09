import { format } from "date-fns";

const MessageBubble = ({
  message,
  isMe,
}: {
  message: Message;
  isMe: boolean;
}) => {
  const time = format(new Date(message.createdAt || ""), "HH:mm");

  return (
    <div className={`mb-4 flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-2xl shadow-md ${
          isMe
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        <div className="mb-1 flex flex-row gap-3 items-center justify-between text-xs font-semibold">
          <span className={isMe ? "text-white" : "text-gray-600"}>
            {message.user?.username || "Unknown"}
          </span>
          <span className={isMe ? "text-white/70" : "text-gray-400"}>
            {time}
          </span>
        </div>
        <div className="text-sm break-words">{message.content}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
