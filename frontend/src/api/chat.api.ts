import api from "./client"
import type { ChatResponse } from "@/types"

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

/**
 * Stream a chat response via Server-Sent Events.
 * Calls `onChunk` for each token and returns the full reply once done.
 */
export async function streamMessage(
  message: string,
  conversationId: string | undefined,
  onChunk: (chunk: string, conversationId: string) => void
): Promise<string> {
  const token = localStorage.getItem("nuru_token")
  const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"

  const response = await fetch(`${baseURL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  })

  if (!response.ok) throw new Error("Stream request failed")

  const reader = response.body?.getReader()
  if (!reader) throw new Error("No response body")

  const decoder = new TextDecoder()
  let fullReply = ""
  let buffer = ""

  const processLine = (line: string) => {
    if (line.startsWith("\r")) {
      line = line.slice(1)
    }

    if (line.startsWith("data: ")) {
      const payload = line.slice(6).trim()
      if (payload === "[DONE]") return
      try {
        const parsed = JSON.parse(payload) as {
          chunk?: string
          conversation_id?: string
          error?: string
        }
        if (parsed.chunk) {
          fullReply += parsed.chunk
          onChunk(parsed.chunk, parsed.conversation_id || "")
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""

    for (const line of lines) {
      processLine(line)
    }
  }

  buffer += decoder.decode()
  if (buffer) {
    const lines = buffer.split("\n")
    for (const line of lines) {
      processLine(line)
    }
  }

  return fullReply
}
