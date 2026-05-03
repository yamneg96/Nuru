import api from "./client"

export interface SubmitFeedbackPayload {
  anonymous_id?: string;
  context: "video" | "chat" | "event" | "blog" | "decision" | "other";
  context_id?: string;
  rating?: number;
  comment: string;
  user_age?: number;
  user_type?: string;
}

export async function submitFeedback(payload: SubmitFeedbackPayload) {
  const { data } = await api.post("/feedback", payload)
  return data
}
