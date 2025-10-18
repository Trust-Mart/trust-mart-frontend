"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: number;
  email: string;
  username?: string | null;
  roles?: string[];
  walletAddress?: string | null;
  smartAccountAddress?: string | null;
  smartAccountBalance?: string | null;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null }),
    }),
    {
      name: "tm_auth_store",
      partialize: (state) => ({ token: state.token, user: state.user }),
      version: 1,
    }
  )
);


