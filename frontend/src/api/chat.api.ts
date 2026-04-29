import api from "./client"
import type { ChatResponse } from "../../../shared/types"

export async function sendMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/chat/message", {
    message,
    conversation_id: conversationId,
  })
  return data
}
