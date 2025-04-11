const ChatHeader = ({
  roomName,
  description,
}: {
  roomName: string;
  description: string;
}) => {
  return (
    <div className="border-b px-6 py-3 bg-[#e9e5d4d5] flex items-center justify-between border-[#d4cbb4] rounded-2xl shadow-[10px_10px_5px_rgba(0,0,0,0.3)] z-2">
      <div>
        <h2 className="text-base font-bold tracking-tight">{roomName}</h2>
        <p className="text-xs text-[#684b03] text-ellipsis">{description}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
