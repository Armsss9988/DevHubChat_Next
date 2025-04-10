const ChatHeader = ({
  roomName,
  membersCount,
}: {
  roomName: string;
  membersCount: number;
}) => {
  return (
    <div className="border-b px-6 py-3 bg-[#9e892b88] flex items-center justify-between border-[#d4cbb4] shadow-[10px_10px_5px_rgba(0,0,0,0.3)] z-2">
      <div>
        <h2 className="text-base font-bold tracking-tight">{roomName}</h2>
        <p className="text-xs text-[#7f8c8d]">{membersCount} members</p>
      </div>
    </div>
  );
};

export default ChatHeader;
