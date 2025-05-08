import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/services/utils";
import { Skeleton, Spin, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Lock, Unlock, MessageCircle } from "lucide-react";
import { useDeleteRoom, useFilterRooms, useUpdateRoom } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";
import { getSocket } from "@/services/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkRoomAsRead } from "@/hooks/useNotification";
import { useNotificationContext } from "@/providers/NotificationProvider";
import RoomModal from "../Room/RoomModal";
type Props = {
  currentRoomId: string | null;
  type: string;
};

export default function RoomSideList({ currentRoomId, type }: Props) {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: read } = useMarkRoomAsRead();
  const { mutate: deleteRoom, isPending: deleting } = useDeleteRoom();
  const { mutate: updateRoom, isPending: updating } = useUpdateRoom();
  const { requestConfirmation, handleCancel } = useNotificationContext();
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null);
  const {
    data: data,
    isLoading: loadingRooms,
    refetch,
  } = useFilterRooms(
    "",
    page,
    10,
    type === "myRoom" ? false : true,
    type === "myRoom" ? true : false
  );
  const handleSelectRoom = async (id: string) => {
    setLoadingRoomId(id);
    await read(id);
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
    router.push(`/room/${id}?tab=${type}`);
    setLoadingRoomId(null);
  };
  const handleNoti = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  }, [queryClient]);
  useEffect(() => {
    const socket = getSocket();
    socket?.on("notification", handleNoti);
    return () => {
      socket?.off("notification", handleNoti);
    };
  }, [handleNoti]);

  if (loadingRooms || !data)
    return (
      <div className=" p-4 w-full min-h-[40px] flex justify-center align-middle items-center">
        <Skeleton active />
      </div>
    );
  return (
    <div className="w-full space-y-1">
      {data &&
        Array.isArray(data.rooms) &&
        data.rooms.map((room: Room) => {
          const isActive = room.id === currentRoomId;

          // Xác định icon phù hợp
          let IconComponent = MessageCircle;
          if (room.hasPassword) {
            IconComponent = room.isJoined ? Unlock : Lock;
          }

          return (
            <div
              key={room.id}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 rounded-lg transition hover:bg-gray-100 hover:cursor-pointer",
                isActive && "bg-gray-200 font-semibold"
              )}
            >
              <div
                className="flex items-center space-x-2"
                onClick={() => handleSelectRoom(room.id)}
              >
                {loadingRoomId === room.id ? (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 16, color: "#111111" }}
                        spin
                      />
                    }
                  />
                ) : (
                  <IconComponent size={16} className="text-gray-500" />
                )}
                <Tooltip title={room.name} placement="topLeft">
                  <span className="truncate max-w-[150px]">{room.name}</span>
                </Tooltip>
              </div>
              {room.unreadCount! > 0 && (
                <div className="relative ml-2">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5">
                    {room.unreadCount}
                  </span>
                </div>
              )}
              {type === "myRoom" && (
                <div className="flex justify-end ">
                  <EditOutlined
                    onClick={() => {
                      setSelectedRoom(room);
                      setOpen(true);
                    }}
                  />

                  <DeleteOutlined
                    className="ml-2 !text-red-800"
                    onClick={() =>
                      requestConfirmation(
                        "Xóa phòng",
                        "Bạn có chắc chắn muốn xóa phòng này không?",
                        "warning",
                        () => {
                          deleteRoom(room.id, {
                            onSuccess: () => {
                              refetch();
                              handleCancel();
                            },
                          });
                        },
                        deleting
                      )
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      {/* Pagination control */}
      {data.total / 10 > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            className="px-2 py-1 text-xs text-gray-600 hover:underline disabled:opacity-30"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">
            {page}/{data.total / 10}
          </span>
          <button
            className="px-2 py-1 text-xs text-gray-600 hover:underline disabled:opacity-30"
            disabled={page === data.total / 10}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
      <RoomModal
        open={open}
        onCancel={() => setOpen(false)}
        onSubmit={(data) =>
          updateRoom(data as Room, { onSuccess: () => setOpen(false) })
        }
        loading={updating}
        room={selectedRoom}
      />
    </div>
  );
}
