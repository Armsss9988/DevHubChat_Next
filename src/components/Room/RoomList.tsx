"use client";
import {
  Card,
  Typography,
  Tooltip,
  Spin,
  Modal,
  Input,
  Button,
  Form,
  message,
} from "antd";
import { UserOutlined, LockOutlined, UnlockTwoTone } from "@ant-design/icons";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useFindRoomByCode, useJoinRoom } from "@/hooks/useRoom";
import { AutoScrollText } from "../UI/AutoScrollText";

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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [passwordForm] = Form.useForm();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate: joinRoom, isPending: isJoinning } = useJoinRoom();
  const { mutate: findByCode, isPending: isFinding } = useFindRoomByCode();
  const handleRoomClick = (room: Room) => {
    if (!room.hasPassword || room.isJoined) {
      messageApi.success("Bạn đã đăng nhập vào room");
      onClickRoom(room.id || "");
      return;
    }

    const roomId = room.id || "";
    messageApi.warning("Bạn cần nhập mật khẩu");
    setSelectedRoomId(roomId);
    setPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async () => {
    if (!selectedRoomId) return;
    try {
      setPasswordLoading(true);
      const values = await passwordForm.validateFields();
      joinRoom(
        { roomId: selectedRoomId, password: values.password },
        {
          onSuccess: () => {
            setPasswordModalOpen(false);
            passwordForm.resetFields();
            setSelectedRoomId(null);
            onClickRoom(selectedRoomId);
          },
          onError: () => {
            messageApi.error("Password không đúng rồi");
          },
        }
      );
    } catch {
      messageApi.error("Failed to join room");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center mt-4">
        <Input.Search
          placeholder="Enter Room Code..."
          allowClear
          enterButton="Join"
          className="max-w-md"
          loading={isFinding}
          onSearch={(value) => {
            findByCode(value, {
              onSuccess: (data) => {
                messageApi.success("Vào đi nha");
                handleRoomClick(data);
              },
              onError: () => {
                messageApi.error("Không tìm thấy room với mã này");
              },
            });
          }}
        />
      </div>
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {contextHolder}
        {rooms?.map((room) => {
          const isLoading = room.id === loadingRoomId;

          return (
            <div key={room.id} className="relative">
              <Card
                hoverable
                onClick={() => !isLoading && handleRoomClick(room)}
                className={twMerge(
                  "bg-[#F0EBCE] border-[#AA8B56] hover:border-[#4E6C50] text-[#395144] shadow-md border rounded-lg transition duration-200",
                  isLoading && "pointer-events-none opacity-50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Typography.Text strong style={{ color: "#395144" }}>
                    <span className="flex items-center">
                      {room.name}
                      {room.hasPassword &&
                        (!room.isJoined ? (
                          <LockOutlined className="ml-2 text-[#AA8B56]" />
                        ) : (
                          <UnlockTwoTone className="ml-2 text-[#066421]" />
                        ))}
                    </span>
                  </Typography.Text>
                  <Tooltip title="Users Online">
                    <div className="flex items-center space-x-1 text-[#4E6C50] text-sm">
                      <UserOutlined />
                      <span>{room.subCount ?? 0}</span>
                    </div>
                  </Tooltip>
                </div>
                <AutoScrollText text={room.description} />
                <div className="flex items-center text-xs text-[#AA8B56] mt-2">
                  <UserOutlined className="mr-1" />
                  <span>Created by: {room.creator.username}</span>
                </div>
                <div className="flex items-center text-xs text-[#AA8B56] mt-1">
                  <span>Code: {room.roomCode}</span>
                </div>
                <div className="flex items-center text-xs text-[#AA8B56] mt-1">
                  {room.isSub ? "Subscribed" : "Unsubscribed"}
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

      <Modal
        open={passwordModalOpen}
        onOk={handlePasswordSubmit}
        title={<span className="text-[#395144]">Enter Room Password</span>}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
          setSelectedRoomId(null);
        }}
        footer={null}
        centered
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label={<span className="text-[#4E6C50]">Password</span>}
            rules={[{ required: true, message: "Please enter the password" }]}
          >
            <Input.Password placeholder="Enter room password" />
          </Form.Item>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                setPasswordModalOpen(false);
                passwordForm.resetFields();
                setSelectedRoomId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              onClick={handlePasswordSubmit}
              loading={passwordLoading || isJoinning}
              className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
            >
              Join Room
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default RoomList;
