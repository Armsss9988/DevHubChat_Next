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
        <div className="text-sm break-words leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
