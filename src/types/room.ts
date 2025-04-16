declare global {
  interface Creator {
    id: string;
    username: string;
  }
  interface RoomListProps {
    rooms: Room[];
    onClickRoom: (roomId: string) => void;
    loadingRoomId?: string;
  }
  interface Room {
    id: string;
    name: string;
    description: string;
    roomCode: string;
    createdAt?: string;
    updatedAt?: string;
    creatorId: string;
    creator: Creator;
    password?: string;
    hasPassword?: string;
    usersOnline?: number;
    isJoined?: boolean;
    isSub?: boolean;
    subCount?: number;
  }
}
export {};
