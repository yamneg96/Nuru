import api from "./client"

export interface CreateTicketPayload {
  name?: string
  email?: string
  subject: string
  message: string
  category: "general" | "medical" | "technical" | "escalation"
}

export interface TicketResponse {
  ticketId: string
  status: string
  category: string
  createdAt: string
}

export interface TicketStatus {
  ticketId: string
  status: string
  category: string
  subject: string
  createdAt: string
  updatedAt: string
  responseCount: number
}

export async function submitSupportTicket(
  data: CreateTicketPayload
): Promise<TicketResponse> {
  const res = await api.post("/support/tickets", { ...data, source: "web" })
  return res.data
}

export async function getTicketStatus(
  ticketId: string
): Promise<TicketStatus> {
  const res = await api.get(`/support/tickets/${ticketId}`)
  return res.data
}
