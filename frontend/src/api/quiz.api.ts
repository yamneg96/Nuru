import api from "./client"
import type { Quiz, QuizResult } from "@/types"

export async function getModuleQuiz(moduleId: string): Promise<Quiz> {
  const { data } = await api.get<Quiz>(`/quiz/module/${moduleId}`)
  return data
}

export async function generateQuiz(
  topic: string
): Promise<Quiz> {
  const { data } = await api.post<Quiz>("/quiz/generate", { topic })
  return data
}

export async function submitQuiz(
  quizId: string,
  answers: number[]
): Promise<QuizResult> {
  const { data } = await api.post<QuizResult>(`/quiz/${quizId}/submit`, {
    answers,
  })
  return data
}
