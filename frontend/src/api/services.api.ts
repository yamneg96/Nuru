import api from "./client"
import type { ServiceLocation } from "@/types"

export async function getServices(filters?: {
  tag?: string
  type?: string
  search?: string
  lat?: number
  lng?: number
}): Promise<ServiceLocation[]> {
  const { data } = await api.get<ServiceLocation[]>("/services", {
    params: filters,
  })
  return data
}

export async function getNearbyServices(
  lat: number,
  lng: number,
  radius?: number,
  type?: string
): Promise<ServiceLocation[]> {
  const { data } = await api.get<ServiceLocation[]>("/services/nearby", {
    params: { lat, lng, radius, type },
  })
  return data
}

export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number; formatted_address: string }> {
  const { data } = await api.get<{
    lat: number
    lng: number
    formatted_address: string
  }>("/services/geocode", { params: { address } })
  return data
}
