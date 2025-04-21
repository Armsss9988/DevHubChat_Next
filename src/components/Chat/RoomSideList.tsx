import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/services/utils";
import { Tooltip } from "antd";
import { Lock, Unlock, MessageCircle } from "lucide-react";
import { useFilterRooms } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";
import { getSocket } from "@/services/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkRoomAsRead } from "@/hooks/useNotification";
type Props = {
  currentRoomId: string | null;
  type: string;
};

export default function RoomSideList({ currentRoomId, type }: Props) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: read } = useMarkRoomAsRead();
  const { data: data, isLoading: loadingRooms } = useFilterRooms(
    "",
    page,
    10,
    type === "myRoom" ? false : true,
    type === "myRoom" ? true : false
  );
  const handleSelectRoom = async (id: string) => {
    await read(id);
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
    router.push(`/room/${id}?tab=${type}`);
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

  if (loadingRooms) return;
  return (
    <div className="w-full space-y-1">
      {data.rooms.map((room: Room) => {
        const isActive = room.id === currentRoomId;

        // Xác định icon phù hợp
        let IconComponent = MessageCircle;
        if (room.hasPassword) {
          IconComponent = room.isJoined ? Unlock : Lock;
        }

        return (
          <button
            key={room.id}
            onClick={() => handleSelectRoom(room.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-2 rounded-lg transition hover:bg-gray-100",
              isActive ? "bg-gray-200 font-semibold" : ""
            )}
          >
            <div className="flex items-center space-x-2">
              <IconComponent size={16} className="text-gray-500" />
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
          </button>
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
    </div>
  );
}
