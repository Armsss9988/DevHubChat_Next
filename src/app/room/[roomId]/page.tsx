"use client";

import ChatRoom from "@/components/Chat/ChatRoom";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, Drawer, Grid, Modal, Input, Button, Form } from "antd";
// import { useChatSocket } from "@/hooks/useChatSocket";
import { useEffect, useMemo, useCallback, useState } from "react";
import RoomSideList from "@/components/Chat/RoomSideList";
import UserList from "@/components/Chat/UserList";
import { MenuFoldOutlined } from "@ant-design/icons";
import { useCheckExistJoinRoom, useJoinRoom } from "@/hooks/useRoom";
import { useGlobalToast } from "@/providers/ToastProvider";
import { getSocket } from "@/services/socket";

export default function ChatPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "myRoom";

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = useMemo(() => !screens.md, [screens]);
  const [tabKey, setTabKey] = useState(currentTab);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isCanJoin, setIsCanJoin] = useState(true);
  const [passwordForm] = Form.useForm();
  const [messageApi] = useGlobalToast();
  const { mutate: checkRoom } = useCheckExistJoinRoom();
  const { mutate: joinRoom, isPending: isJoining } = useJoinRoom();
  const [userOnline, setUserOnline] =
    useState<{ id: string; username: string }[]>();

  const handleRoomUsersUpdated = ({
    users,
  }: {
    users: { id: string; username: string }[];
  }) => {
    setUserOnline(users);
  };
  useEffect(() => {
    const socket = getSocket();
    socket?.on("room_users_updated", handleRoomUsersUpdated);
  }, []);

  const handleChangeTab = useCallback(
    (key: string) => {
      setTabKey(key);
      router.replace(`/room/${roomId}?tab=${key}`);
    },
    [roomId, router]
  );

  const handleCheckRoom = useCallback(() => {
    checkRoom(roomId as string, {
      onSuccess: (data) => {
        if (data === false) {
          setIsCanJoin(false);
          setPasswordModalOpen(true);
        } else {
          setIsCanJoin(true);
        }
      },
    });
  }, [checkRoom, roomId]);

  useEffect(() => {
    handleCheckRoom();
  }, [handleCheckRoom]);

  const handlePasswordSubmit = async () => {
    try {
      setPasswordLoading(true);
      const values = await passwordForm.validateFields();
      joinRoom(
        { roomId: roomId as string, password: values.password },
        {
          onSuccess: () => {
            setPasswordModalOpen(false);
            setIsCanJoin(true);
            passwordForm.resetFields();
          },
        }
      );
    } catch {
      messageApi.error("Failed to join room");
    } finally {
      setPasswordLoading(false);
    }
  };

  const roomTabs = useMemo(
    () => (
      <Tabs
        activeKey={tabKey}
        className="custom-tabs"
        onChange={handleChangeTab}
        centered
        items={[
          {
            label: "My Room",
            key: "myRoom",
            children: (
              <RoomSideList currentRoomId={roomId as string} type="myRoom" />
            ),
          },
          {
            label: "Subscribed",
            key: "subscribed",
            children: (
              <RoomSideList
                currentRoomId={roomId as string}
                type="subscribed"
              />
            ),
          },
        ]}
      />
    ),
    [tabKey, handleChangeTab, roomId]
  );

  const sideContent = useMemo(
    () => (
      <div className="h-full flex flex-col">
        {roomTabs}
        <div className="flex-1 overflow-y-auto px-4">
          <UserList users={userOnline || []} />
        </div>
      </div>
    ),
    [roomTabs, userOnline]
  );

  return (
    <div className="flex flex-1 h-full pt-10 overflow-hidden">
      {isMobile && (
        <button
          title="Rooms"
          onClick={() => setDrawerOpen(true)}
          className="absolute top-50 left-4 z-50 bg-white shadow-md p-2 rounded-full"
        >
          <MenuFoldOutlined />
        </button>
      )}

      {!isMobile && (
        <div className="transition-all duration-300 bg-gradient-to-br from-[#e8d395] to-[#ebe9e3] backdrop-blur-lg shadow-[10px_10px_5px_rgba(0,0,0,0.3)] md:block h-full z-10 rounded-tr-3xl overflow-hidden mr-2 min-w-[250px] max-w-[280px]">
          {sideContent}
        </div>
      )}

      <Drawer
        placement="left"
        closable
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        {sideContent}
      </Drawer>

      {isCanJoin && (
        <div className="w-full h-full bg-transparent overflow-hidden">
          <ChatRoom roomId={roomId as string} />
        </div>
      )}

      <Modal
        open={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        title={<span className="text-[#395144]">Enter Room Password</span>}
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
              }}
            >
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              onClick={handlePasswordSubmit}
              loading={passwordLoading || isJoining}
              className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
            >
              Join Room
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
