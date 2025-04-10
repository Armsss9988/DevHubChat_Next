"use client";
import { useState } from "react";
import { Button, message } from "antd";
import RoomModal from "@/components/Room/RoomModal";
import RoomList from "@/components/Room/RoomList";
import { useCreateRoom, useGetRooms } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";

const RoomsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null);
  const router = useRouter();

  const { data: rooms } = useGetRooms();
  const { mutate: create, isPending: isCreating } = useCreateRoom();

  const handleCreateRoom = (name: string, description: string) => {
    create(
      { name, description },
      {
        onSuccess: () => {
          message.success("Tạo phòng thành công 🎉");
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleRoomClick = (roomId: string) => {
    setLoadingRoomId(roomId); // hiển thị loading riêng cho room
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-[#395144] dark:text-[#F0EBCE]">
          Danh sách phòng chat
        </h1>

        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
        >
          + Tạo phòng mới
        </Button>
      </div>

      <RoomList
        rooms={rooms}
        onClickRoom={handleRoomClick}
        loadingRoomId={loadingRoomId || ""}
      />

      <RoomModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
        loading={isCreating}
      />
    </div>
  );
};

export default RoomsPage;
