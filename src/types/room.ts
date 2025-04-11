declare global {
  interface Room {
    id?: string;
    name: string;
    description: string;
    messages?: Message[];
    createdAt?: Date;
  }
}
export {};
