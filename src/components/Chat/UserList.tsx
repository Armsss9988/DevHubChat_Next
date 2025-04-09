import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserList = ({ users }: { users: { username: string; id: string }[] }) => {
  return (
    <div className="p-4 border-r h-full bg-white overflow-y-auto">
      <div className="font-semibold text-xs text-gray-500 mb-3">
        MEMBERS ({users?.length || "0"})
      </div>
      <div className="space-y-3">
        {users &&
          users.map((user, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Avatar size="small" icon={<UserOutlined />} />
              <Text className="text-sm text-gray-700">{user.username}</Text>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserList;
