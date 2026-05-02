import api from "./client"
import type { Professional, ProfessionalRegistration } from "@/types"

export async function getProfessionals(filters?: {
  type?: string
  city?: string
  online?: boolean
  offline?: boolean
}): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>("/professionals", {
    params: filters,
  })
  return data
}

export async function getProfessionalById(
  id: string
): Promise<Professional> {
  const { data } = await api.get<Professional>(`/professionals/${id}`)
  return data
}

export async function getNearbyProfessionals(
  lat: number,
  lng: number,
  radius?: number,
  type?: string
): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>("/professionals/nearby", {
    params: { lat, lng, radius, type },
  })
  return data
}

export async function registerProfessional(
  registration: ProfessionalRegistration
): Promise<Professional> {
  const { data } = await api.post<Professional>(
    "/professionals/register",
    registration
  )
  return data
}

export async function getMyProfessionalProfile(): Promise<Professional> {
  const { data } = await api.get<Professional>("/professionals/me")
  return data
}

export async function updateMyProfessionalProfile(
  updates: Partial<ProfessionalRegistration>
): Promise<Professional> {
  const { data } = await api.put<Professional>("/professionals/me", updates)
  return data
}
