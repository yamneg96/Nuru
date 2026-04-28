import { create } from "zustand";

interface AuthState {
  token: string | null;
  anonymousId: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (token: string, anonymousId: string) => void;
  logout: () => void;
  setOnboarded: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("nuru_token"),
  anonymousId: localStorage.getItem("nuru_anonymous_id"),
  isAuthenticated: !!localStorage.getItem("nuru_token"),
  isOnboarded: localStorage.getItem("nuru_onboarded") === "true",

  login: (token, anonymousId) => {
    localStorage.setItem("nuru_token", token);
    localStorage.setItem("nuru_anonymous_id", anonymousId);
    set({ token, anonymousId, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("nuru_token");
    localStorage.removeItem("nuru_anonymous_id");
    localStorage.removeItem("nuru_onboarded");
    set({ token: null, anonymousId: null, isAuthenticated: false, isOnboarded: false });
  },

  setOnboarded: (value) => {
    localStorage.setItem("nuru_onboarded", String(value));
    set({ isOnboarded: value });
  },
}));
