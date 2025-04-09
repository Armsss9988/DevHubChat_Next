declare global {
  interface User {
    id?: string;
    username?: string;
    email: string;
    password?: string;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
    messages?: Message[];
  }
  enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
  }
}
export {};
