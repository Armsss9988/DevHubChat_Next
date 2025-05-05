declare global {
  interface Message {
    id?: string;
    content: string;
    roomId?: string;
    userId?: string;
    createdAt?: Date;
    room?: Room;
    user?: User;
    media?: Media[];
  }
  interface Media {
    id: string;
    messageId: string;
    url: string;
    type: string;
    createdAt: string;
    message: Message;
  }
}
export {};
