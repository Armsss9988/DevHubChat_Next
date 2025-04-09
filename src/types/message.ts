declare global {
  interface Message {
    id?: string;
    content: string;
    roomId?: string;
    userId?: string;
    createdAt?: Date;
    room?: Room;
    user?: User;
  }
}
export {};
