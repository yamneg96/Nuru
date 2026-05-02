import api from "./client"
import type { Appointment, BookAppointmentRequest } from "@/types"

export async function createAppointment(
  booking: BookAppointmentRequest
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/appointments", booking)
  return data
}

export async function getMyAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments")
  return data
}

export async function getProfessionalAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments/professional")
  return data
}

export async function cancelAppointment(
  id: string,
  reason?: string
): Promise<Appointment> {
  const { data } = await api.put<Appointment>(`/appointments/${id}/cancel`, {
    reason,
  })
  return data
}

export async function confirmAppointment(
  id: string
): Promise<Appointment> {
  const { data } = await api.put<Appointment>(`/appointments/${id}/confirm`)
  return data
}

export async function completeAppointment(
  id: string
): Promise<Appointment> {
  const { data } = await api.put<Appointment>(`/appointments/${id}/complete`)
  return data
}

export async function rateAppointment(
  id: string,
  rating: number,
  review?: string
): Promise<Appointment> {
  const { data } = await api.post<Appointment>(`/appointments/${id}/rate`, {
    rating,
    review,
  })
  return data
}
