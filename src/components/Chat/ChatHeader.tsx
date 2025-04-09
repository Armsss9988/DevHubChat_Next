const ChatHeader = ({ roomName, membersCount }: { roomName: string; membersCount: number }) => {
    return (
      <div className="border-b px-6 py-3 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-sm font-semibold">{roomName}</h2>
          <p className="text-xs text-gray-500">{membersCount} members</p>
        </div>
      </div>
    );
  };
  
  export default ChatHeader;
  