"use client";
import { Card, Typography, Tooltip, Spin } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { twMerge } from "tailwind-merge";

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
  loadingRoomId?: string;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  onClickRoom,
  loadingRoomId,
}) => {
  return (
    <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {rooms?.map((room) => {
        const isLoading = room.id === loadingRoomId;

        return (
          <div key={room.id} className="relative">
            <Card
              hoverable
              onClick={() => !isLoading && onClickRoom(room.id)}
              className={twMerge(
                "bg-[#F0EBCE] border-[#AA8B56] hover:border-[#4E6C50] text-[#395144] shadow-md border rounded-lg transition duration-200",
                isLoading && "pointer-events-none opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Typography.Text strong style={{ color: "#395144" }}>
                  {room.name}
                </Typography.Text>
                <Tooltip title="Users Online">
                  <div className="flex items-center space-x-1 text-[#4E6C50] text-sm">
                    {/* online status */}
                  </div>
                </Tooltip>
              </div>
              <Typography.Paragraph
                type="secondary"
                ellipsis={{ rows: 2 }}
                style={{ color: "#4E6C50" }}
              >
                {room.description}
              </Typography.Paragraph>
              <div className="flex items-center text-xs text-[#AA8B56] mt-2">
                <ClockCircleOutlined className="mr-1" />
                {/* {room.lastActive} */}
              </div>
            </Card>

            {isLoading && (
              <div className="absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <Spin />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoomList;
