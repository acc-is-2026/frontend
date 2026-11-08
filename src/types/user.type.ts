import type { User } from "./auth.type";

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}
