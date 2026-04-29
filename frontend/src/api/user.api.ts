import api from "./client"
import type { UserProfile, UserPreferences } from "../../../shared/types"

export async function updatePreferences(
  prefs: Partial<UserPreferences>
): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>("/user/preferences", prefs)
  return data
}

export async function deleteUserData(): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>("/user/data")
  return data
}
