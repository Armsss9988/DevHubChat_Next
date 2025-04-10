const ChatHeader = ({
  roomName,
  membersCount,
}: {
  roomName: string;
  membersCount: number;
}) => {
  return (
    <div className="border-b px-6 py-3 flex items-center justify-between bg-[#fcf7ed] border-[#d4cbb4] shadow-sm">
      <div>
        <h2 className="text-base font-bold tracking-tight">{roomName}</h2>
        <p className="text-xs text-[#7f8c8d]">{membersCount} members</p>
      </div>
    </div>
  );
};

export default ChatHeader;
