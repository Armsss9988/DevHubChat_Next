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
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  UnlockTwoTone,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import {
  useDeleteRoom,
  useFindRoomByCode,
  useJoinRoom,
  useUpdateRoom,
} from "@/hooks/useRoom";
import { AutoScrollText } from "../UI/AutoScrollText";
import { useGlobalToast } from "../../providers/ToastProvider";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNotificationContext } from "@/providers/NotificationProvider";
import RoomModal from "./RoomModal";

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
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [messageApi] = useGlobalToast();
  const { toastError } = useToastMessage();
  const { mutate: joinRoom, isPending: isJoinning } = useJoinRoom();
  const { mutate: findByCode, isPending: isFinding } = useFindRoomByCode();
  const { mutate: deleteRoom, isPending: deleting } = useDeleteRoom();
  const { mutate: updateRoom, isPending: updating } = useUpdateRoom();
  const { requestConfirmation, handleCancel } = useNotificationContext();
  const userId = useSelector((state: RootState) => state?.auth?.user?.id);
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
          // onError: () => {
          //   messageApi.error("Password không đúng rồi");
          // },
        }
      );
    } catch {
      messageApi.error("Failed to join room");
    } finally {
      setPasswordLoading(false);
    }
  };
  if (!rooms) return;
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
              onError: toastError,
            });
          }}
        />
      </div>
      <div className="grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {rooms &&
          Array.isArray(rooms) &&
          rooms?.map((room) => {
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
                        <AutoScrollText text={room.name} />

                        {room.hasPassword &&
                          (!room.isJoined ? (
                            <LockOutlined className="ml-2 text-[#AA8B56]" />
                          ) : (
                            <UnlockTwoTone className="ml-2 text-[#066421]" />
                          ))}
                      </span>
                    </Typography.Text>
                    <div className="flex items-center gap-3">
                      {room.creator.id === userId && (
                        <div className="flex justify-end">
                          <EditOutlined
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn chặn sự kiện lan truyền lên Card
                              setSelectedRoom(room);
                              setOpen(true);
                            }}
                          />
                          <DeleteOutlined
                            className="ml-2 !text-red-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestConfirmation(
                                "Xóa phòng",
                                "Bạn có chắc chắn muốn xóa phòng này không?",
                                "warning",
                                () => {
                                  deleteRoom(room.id, {
                                    onSuccess: () => {
                                      handleCancel();
                                    },
                                  });
                                },
                                deleting
                              );
                            }}
                          />
                        </div>
                      )}
                      <Tooltip title="Users Online">
                        <div className="flex items-center space-x-1 text-[#4E6C50] text-sm">
                          <UserOutlined />
                          <span>{room.subCount ?? 0}</span>
                        </div>
                      </Tooltip>{" "}
                    </div>
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
      <RoomModal
        open={open}
        onCancel={() => setOpen(false)}
        onSubmit={(data) => {
          updateRoom(data as Room, { onSuccess: () => setOpen(false) });
        }}
        loading={updating}
        room={selectedRoom}
      />
    </>
  );
};

export default RoomList;
