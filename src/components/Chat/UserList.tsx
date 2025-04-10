import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UserList = ({ users }: { users: { username: string; id: string }[] }) => {
  return (
    <div className="p-4 mt-1">
      <div className="text-xs font-bold text-[#7f8c8d] tracking-wide mb-3">
        MEMBERS ({users?.length || "0"})
      </div>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Avatar size="small" icon={<UserOutlined />} />
            <Text className="text-sm text-[#2c3e50] font-medium">
              {user.username}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
