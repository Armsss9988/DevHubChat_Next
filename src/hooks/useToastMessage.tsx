// hooks/useToastMessage.ts
import { useGlobalToast } from "@/providers/ToastProvider";
import { isAxiosError } from "axios";
import { useMemo } from "react";

export const useToastMessage = () => {
  const [messageApi] = useGlobalToast();

  const toastError = useMemo(() => {
    return (error: unknown) => {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Lỗi hệ thống từ server";
        messageApi.error(msg);
      } else if (error instanceof Error) {
        messageApi.error(error.message || "Đã xảy ra lỗi không xác định");
      } else {
        messageApi.error("Lỗi không rõ nguồn gốc");
      }
    };
  }, [messageApi]);

  const toastSuccess = useMemo(() => {
    return (msg: string) => messageApi.success(msg);
  }, [messageApi]);

  const toastInfo = useMemo(() => {
    return (msg: string) => messageApi.info(msg);
  }, [messageApi]);

  return {
    toastError,
    toastSuccess,
    toastInfo,
  };
};
