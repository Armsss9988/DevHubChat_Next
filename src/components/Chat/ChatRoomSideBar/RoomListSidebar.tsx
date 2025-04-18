import { List, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getSubscribedRooms, getMyRooms } from "@/api/room";

const { Text } = Typography;

interface Props {
  type: "subscribed" | "myRooms";
  onSelect: (id: string) => void;
}

const RoomListSidebar = ({ type, onSelect }: Props) => {
  const queryFn = type === "subscribed" ? getSubscribedRooms : getMyRooms;
  const { data: rooms, isLoading } = useQuery({
    queryKey: [type],
    queryFn,
  });

  return (
    <List
      size="small"
      loading={isLoading}
      dataSource={rooms}
      renderItem={(room) => (
        <List.Item
          onClick={() => onSelect(room.id)}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded"
        >
          <Text>{room.name}</Text>
        </List.Item>
      )}
    />
  );
};

export default RoomListSidebar;
