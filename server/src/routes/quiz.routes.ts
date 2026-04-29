import { Router } from "express"
import { generateQuiz } from "../services/quiz.service.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

export const quizRouter = Router()

quizRouter.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { topic } = req.body
    if (!topic || typeof topic !== "string") {
      res.status(400).json({ error: "A valid topic string is required" })
      return
    }

    const quiz = await generateQuiz(topic)
    res.json(quiz)
  } catch (error) {
    console.error("Quiz generation error:", error)
    res.status(500).json({ error: "Failed to generate quiz" })
  }
})
