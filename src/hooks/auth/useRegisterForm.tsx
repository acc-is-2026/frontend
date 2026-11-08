import { useState } from "react";
import { normalizeEmail, normalizeName } from "@/utils/validators.util";
import type { RegisterDTO } from "@/types/auth.type";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { IconCheck } from "@tabler/icons-react";

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedFirstName = normalizeName(firstName);
    const normalizedLastName = normalizeName(lastName);
    const normalizedEmail = normalizeEmail(email);

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all the required fields (*).");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Please use a valid email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must have at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password don't match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: RegisterDTO = {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        password,
      };

      await authService.register(payload);
      notifications.show({
        title: "Success",
        message: "Account created",
        color: "green",
        icon: <IconCheck size={18} />,
        autoClose: 5000,
      });
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);

      const errorMessage = getErrorMessage(
        err,
        "Something went wrong. Try again.",
      );

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
