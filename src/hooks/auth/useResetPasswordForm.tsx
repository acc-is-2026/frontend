import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill all the required fields (*).");
      return;
    }

    if (password.length < 8) {
      setError("Password must have at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!token) {
      setError("The reset link is invalid or expired. Please get a new one.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        token: token,
        newPassword: password,
      };

      await authService.resetPassword(payload);

      notifications.show({
        title: "Success",
        message: "Password was reset successfully.",
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Reset password error:", err);

      const errorMessage = getErrorMessage(
        err,
        "Something went wrong. Please try again.",
      );

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
