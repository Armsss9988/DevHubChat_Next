import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  setMessages: (messages: any[]) => set({ messages }),
}));
