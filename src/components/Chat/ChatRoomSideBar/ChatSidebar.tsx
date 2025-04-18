import { Tabs } from "antd";
import RoomList from "./RoomListSidebar";

interface Props {
  onSelectRoom: (id: string) => void;
}

const ChatSidebar = ({ onSelectRoom }: Props) => {
  return (
    <div className="w-[280px] border-r border-gray-300 dark:border-gray-700 p-2">
      <Tabs
        defaultActiveKey="subscribed"
        items={[
          {
            key: "subscribed",
            label: "Subscribed",
            children: <RoomList type="subscribed" onSelect={onSelectRoom} />,
          },
          {
            key: "myRooms",
            label: "My Rooms",
            children: <RoomList type="myRooms" onSelect={onSelectRoom} />,
          },
        ]}
      />
    </div>
  );
};

export default ChatSidebar;
