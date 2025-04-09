"use client";
import { useState } from "react";
import { Card, Typography, Tooltip } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

interface Room {
  id: string;
  name: string;
  description: string;
  usersOnline: number;
  lastActive: string;
}

interface RoomListProps {
  rooms: Room[];
  onClickRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onClickRoom }) => {
  const [roomData] = useState<Room[]>(rooms);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {roomData &&
        Array.isArray(roomData) &&
        roomData.map((room) => (
          <Card
            key={room.id}
            hoverable
            onClick={() => onClickRoom(room.id)}
            className="shadow-md border rounded-lg transition duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <Typography.Text strong>{room.name}</Typography.Text>
              <Tooltip title="Users Online">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <UserOutlined />
                  <span>{room.usersOnline} online</span>
                </div>
              </Tooltip>
            </div>
            <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
              {room.description}
            </Typography.Paragraph>
            <div className="flex items-center text-xs text-gray-400 mt-2">
              <ClockCircleOutlined className="mr-1" />
              Last active: {room.lastActive}
            </div>
          </Card>
        ))}
    </div>
  );
};

export default RoomList;
