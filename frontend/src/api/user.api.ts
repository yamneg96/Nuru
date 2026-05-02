import api from "./client"
import type { UserProfile, UserPreferences, MessageResponse } from "@/types"

export async function updatePreferences(
  prefs: Partial<UserPreferences>
): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>("/user/preferences", prefs)
  return data
}

export async function deleteUserData(): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>("/user/data")
  return data
}
