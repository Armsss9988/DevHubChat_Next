"use client";
import { useState } from "react";
import { Button, message } from "antd";
import RoomModal from "@/components/Room/RoomModal";
import RoomList from "@/components/Room/RoomList";
import { useCreateRoom, useGetRooms } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";

const RoomsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: rooms } = useGetRooms();
  const { mutate: create, isPending: isCreating } = useCreateRoom();

  const handleCreateRoom = (name: string, description: string) => {
    create(
      { name, description },
      {
        onSuccess: () => {
          message.success("Create room susscessfully");
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleRoomClick = (roomId: string) => {
    router.push(`room/${roomId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Chat Rooms</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + New Room
        </Button>
      </div>

      <RoomList rooms={rooms} onClickRoom={handleRoomClick} />

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
