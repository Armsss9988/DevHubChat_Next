import { AxiosError } from "axios";

type ErrorResponseData = {
  message?: string | string[];
  statusCode?: number;
};

export function handleApiError(error: unknown): string {
  if (isAxiosErrorWithCustomData(error)) {
    const data = error.response?.data;

    // if (data?.statusCode === 401) {
    //   return "Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.";
    // }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (Array.isArray(data?.message)) {
      return data.message.join(" | ");
    }

    return error.message ?? "Có lỗi xảy ra!";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Có lỗi xảy ra!";
}

function isAxiosErrorWithCustomData(
  error: unknown
): error is AxiosError<ErrorResponseData> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
