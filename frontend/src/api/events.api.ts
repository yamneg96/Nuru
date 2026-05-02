import api from "./client"
import type { NuruEvent, MessageResponse } from "@/types"

export async function getEvents(filters?: {
  category?: string
  type?: string
}): Promise<NuruEvent[]> {
  const { data } = await api.get<NuruEvent[]>("/events", {
    params: filters,
  })
  return data
}

export async function getEvent(id: string): Promise<NuruEvent> {
  const { data } = await api.get<NuruEvent>(`/events/${id}`)
  return data
}

export async function registerForEvent(
  id: string
): Promise<MessageResponse & { attendee_count: number }> {
  const { data } = await api.post<
    MessageResponse & { attendee_count: number }
  >(`/events/${id}/register`)
  return data
}
