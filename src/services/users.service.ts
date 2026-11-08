import { api } from "@/api/api";
import type { MessageResponse, User } from "@/types/auth.type";
import type {
  UpdateProfileDTO,
  UpdateProfileResponse,
} from "@/types/user.type";

export const usersService = {
  getMe: async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/users/me");
    return response.data.user;
  },

  updateProfile: async (data: UpdateProfileDTO): Promise<User> => {
    const response = await api.patch<UpdateProfileResponse>("/users/me", data);
    return response.data.user;
  },

  deleteProfile: async (): Promise<MessageResponse> => {
    const response = await api.delete<MessageResponse>("/users/me");
    return response.data;
  },
};
