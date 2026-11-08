import { usersService } from "@/services/users.service";
import type { AuthState } from "@/types/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, userToken) => {
        set({ user: userData, token: userToken, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      syncUser: async () => {
        const { token } = get();

        if (!token) return;

        try {
          const freshUser = await usersService.getMe();
          set({ user: freshUser });
        } catch (error) {
          console.error("Failed to sync user data:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
