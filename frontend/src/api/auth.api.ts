import api from "./client"
import type { AuthResponse, UserProfile } from "@/types"

export async function loginWithGoogle(
  credential: string,
  previous_anonymous_id?: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google", {
    credential,
    previous_anonymous_id,
  })
  return data
}

export async function loginAnonymous(preferences?: {
  language?: string
  save_history?: boolean
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/anonymous", {
    preferences,
  })
  return data
}

export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/auth/me")
  return data
}

export async function refreshToken(): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>("/auth/refresh")
  return data
}

export async function logout(): Promise<{ success: boolean }> {
  const { data } = await api.post<{ success: boolean }>("/auth/logout")
  return data
}
