import { useChatStore } from "../store/useChatStore";

export const useChat = () => {
  const { messages, setMessages } = useChatStore();
  return { messages, setMessages };
};
