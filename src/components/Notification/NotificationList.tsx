import { useRouter } from "next/navigation";
import { List, Typography, Avatar } from "antd";
import { NotificationPayload } from "@/types/notification";

const { Text } = Typography;

export const NotificationList = ({
  notifications,
}: {
  notifications: NotificationPayload[];
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
          onClick={() => handleClick(item.roomId)}
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
                {item.fromUsername ? item.fromUsername[0].toUpperCase() : ""}
              </Avatar>
            }
            title={
              <div className="flex items-center justify-between">
                <Text strong={!item.isRead}>{item.roomName}</Text>
              </div>
            }
            description={
              <Text>
                <Text strong={!item.isRead}>{item.fromUsername}</Text>:{" "}
                {item.message}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
};
