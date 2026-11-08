import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { normalizeEmail } from "@/utils/validators.util";
import { useState } from "react";

export const useForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Please fill all the required fields (*).");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Please use a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(normalizedEmail);
      setIsSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage = getErrorMessage(
        err,
        "Something went wrong. Please try again.",
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    isLoading,
    isSent,
    handleSubmit,
  };
};
