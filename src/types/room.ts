declare global {
  interface Room {
    id?: string;
    name: string;
    messages?: Message[];
    createdAt?: Date;
  }
}
export {};
