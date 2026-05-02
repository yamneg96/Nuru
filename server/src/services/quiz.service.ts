import { generateResponse } from "./ai.service.js"
import { logger } from "../utils/logger.js"


export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizResult {
  title: string
  questions: QuizQuestion[]
}

export async function generateQuiz(topic: string): Promise<QuizResult> {
  const prompt = `You are a helpful educational assistant. Generate a 3-question multiple choice quiz about "${topic}" suitable for a young audience learning about sexual and reproductive health or general life skills.
The output MUST be valid JSON matching exactly this TypeScript interface:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0, // index of the correct option (0-3)
      "explanation": "Short explanation of why the answer is correct"
    }
  ]
}
Return ONLY the JSON. No markdown formatting, no backticks, no introductory text.`

  const responseText = await generateResponse(prompt)
  
  try {
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    const quizData = JSON.parse(jsonStr) as QuizResult
    
    if (!quizData.title || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error("Invalid format")
    }
    
    return quizData
  } catch (error) {
    logger.error({ error, responseText }, "Failed to parse quiz JSON")
    throw new Error("Failed to generate a valid quiz. Please try again.")
  }
}
