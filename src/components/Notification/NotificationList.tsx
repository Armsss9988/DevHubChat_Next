import { useRouter } from "next/navigation";
import { List, Typography, Avatar } from "antd";
import { Notification } from "@/types/notification";

const { Text } = Typography;

const NotificationList = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  const router = useRouter();

  const handleClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          onClick={() => handleClick(item.room?.id || "")}
          style={{
            cursor: "pointer",
            padding: "12px 16px",
            borderRadius: 8,
            transition: "all 0.2s",
            backgroundColor: item.isRead ? "transparent" : "#e6f7ff",
          }}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <List.Item.Meta
            avatar={
              <Avatar>
                {item.message.user?.username
                  ? item.message.user?.username[0].toUpperCase()
                  : ""}
              </Avatar>
            }
            title={
              <div className="flex items-center justify-between">
                <Text strong={!item.isRead}>{item.room.name}</Text>
              </div>
            }
            description={
              <Text>
                <Text strong={!item.isRead}>{item.message.user?.username}</Text>
                : {item.message.content}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
};
export default NotificationList;
