import { isAxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Try again.",
): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    return data?.error || data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
