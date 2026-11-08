import { api } from "@/api/api";
import { useAuthStore } from "../store/useAuthStore";
import type {
  AuthResponse,
  LoginDTO,
  MessageResponse,
  RegisterDTO,
  ResetPasswordData,
} from "@/types/auth.type";

export const authService = {
  login: async (credentials: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    const { user, token } = response.data;
    useAuthStore.getState().login(user, token);

    return response.data;
  },

  register: async (credentials: RegisterDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/register",
      credentials,
    );
    const { user, token } = response.data;
    useAuthStore.getState().login(user, token);

    return response.data;
  },

  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  },
};
