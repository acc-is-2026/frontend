import { useState } from "react";
import type { LoginDTO } from "@/types/auth.type";
import { authService } from "@/services/auth.service";
import { useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { normalizeEmail } from "@/utils/validators.util";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      setError("Please fill all the required fields (*).");
      return;
    }

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      setError("Please use a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: LoginDTO = {
        email: normalizedEmail,
        password,
      };

      await authService.login(payload);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      const errorMessage = getErrorMessage(
        err,
        "Something went wrong with the login. Please try again.",
      );

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
