import api from "./client";
import type { AuthResponse, UserProfile } from "@shared/types";

export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google", { credential });
  return data;
}

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/auth/me");
  return data;
}
