export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (userData: User, userToken: string) => void;
  logout: () => void;
  syncUser: () => Promise<void>;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MessageResponse {
  message: string;
}
