"use client";
import { useState, useEffect } from "react";
import { Button, Input, Select, Pagination, Spin } from "antd";
import RoomModal, { RoomData } from "@/components/Room/RoomModal";
import RoomList from "@/components/Room/RoomList";
import { useCreateRoom, useFilterRooms } from "@/hooks/useRoom";
import { useRouter } from "next/navigation";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useGlobalToast } from "@/providers/ToastProvider";

const pageSizeOptions = [4, 12, 18, 24];

const RoomsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRoomId, setLoadingRoomId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isOwner, setIsOwner] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [messageApi] = useGlobalToast();
  const { toastError } = useToastMessage();
  const router = useRouter();

  const { data, isLoading } = useFilterRooms(
    debouncedSearch,
    currentPage,
    pageSize,
    isOwner,
    isSub
  );
  const { mutate: create, isPending: isCreating } = useCreateRoom();

  const handleCreateRoom = (data: RoomData) => {
    create(data as Room, {
      onSuccess: () => {
        messageApi.success("Tạo phòng thành công 🎉");
        setIsModalOpen(false);
      },
      onError: toastError,
    });
  };

  const handleRoomClick = (roomId: string) => {
    setLoadingRoomId(roomId);
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div className="p-6 h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4 sticky top-0 z-5">
        <div className="flex flex-row gap-4">
          <h1 className="text-xl font-semibold text-[#395144] dark:text-[#F0EBCE]">
            Danh sách phòng chat
          </h1>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={data?.total || 0}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <Input
            placeholder="Tìm phòng theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />

          <Button
            type={isOwner ? "primary" : "default"}
            onClick={() => {
              setIsOwner(!isOwner);
              setCurrentPage(1);
            }}
            className={isOwner ? "bg-green-600 text-white border-none" : ""}
          >
            {isOwner ? "✓" : ""} Phòng tôi tạo
          </Button>

          <Button
            type={isSub ? "primary" : "default"}
            onClick={() => {
              setIsSub(!isSub);
              setCurrentPage(1);
            }}
            className={isSub ? "bg-green-600 text-white border-none" : ""}
          >
            {isSub ? "✓" : ""} Đã theo dõi
          </Button>

          <Select
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            options={pageSizeOptions.map((s) => ({
              value: s,
              label: `${s}/trang`,
            }))}
            style={{ width: 120 }}
          />

          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
          >
            + Tạo phòng mới
          </Button>

          {/* <Select
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            options={pageSizeOptions.map((s) => ({
              value: s,
              label: `${s}/trang`,
            }))}
            style={{ width: 120 }}
          />

          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#395144] hover:bg-[#4E6C50] border-none text-white"
          >
            + Tạo phòng mới
          </Button> */}
        </div>
      </div>
      <div className="h-[570px] md:h-[500px] overflow-y-auto p-4 pr-6 rounded-sm shadow-xl border-solid border-2 border-[#1b4b2688] scrollbar-green">
        {isLoading ? (
          <Spin />
        ) : (
          <RoomList
            rooms={data.rooms}
            onClickRoom={handleRoomClick}
            loadingRoomId={loadingRoomId || ""}
          />
        )}
      </div>
      <RoomModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateRoom}
        loading={isCreating}
      />
    </div>
  );
};

export default RoomsPage;
