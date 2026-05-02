import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react"
import api from "@/api/client"
import { Button } from "@/components/ui/button"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface QuizResult {
  title: string
  questions: QuizQuestion[]
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState("")
  const [quiz, setQuiz] = useState<QuizResult | null>(null)
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)

  const { mutate: generateQuiz, isPending } = useMutation({
    mutationFn: async (topicString: string) => {
      const res = await api.post("/quiz/generate", { topic: topicString })
      return res.data as QuizResult
    },
    onSuccess: (data) => {
      setQuiz(data)
      setCurrentQuestionIdx(0)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setScore(0)
    },
  })

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    generateQuiz(topic)
  }

  const handleSelectAnswer = (idx: number) => {
    if (showExplanation) return
    setSelectedAnswer(idx)
    setShowExplanation(true)
    
    if (idx === quiz?.questions[currentQuestionIdx].correctAnswer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (!quiz) return
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(idx => idx + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz finished - maybe show a summary state, but for now we'll just alert and let them retry
      alert(`Quiz completed! Your score: ${score}/${quiz.questions.length}`)
      setQuiz(null)
      setTopic("")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 pt-10 pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-surface p-2 text-foreground/80 hover:bg-surface-hover"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">AI Quiz</h1>
      </div>

      {!quiz ? (
        <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-surface p-6 shadow-sm">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl text-primary">🧠</span>
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-foreground">Generate a Quiz</h2>
          <p className="mb-6 text-center text-sm text-foreground/70">
            Enter any topic you want to learn about, and Nuru AI will create a quick 3-question quiz for you.
          </p>
          
          <form onSubmit={handleGenerate} className="w-full">
            <input
              type="text"
              placeholder="e.g. Nutrition, Consent, Menstrual Cycle"
              className="mb-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isPending}
            />
            <Button
              type="submit"
              disabled={!topic.trim() || isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                "Create Quiz"
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-md flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">{quiz.title}</h2>
            <span className="rounded-full bg-surface px-3 py-1 text-sm font-medium text-foreground">
              {currentQuestionIdx + 1} / {quiz.questions.length}
            </span>
          </div>

          <div className="rounded-2xl bg-surface p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-medium leading-relaxed text-foreground">
              {quiz.questions[currentQuestionIdx].question}
            </h3>

            <div className="space-y-3">
              {quiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                const isCorrect = idx === quiz.questions[currentQuestionIdx].correctAnswer
                const isSelected = selectedAnswer === idx

                let btnClass = "w-full justify-start rounded-xl border p-4 text-left font-normal transition-all "
                if (!showExplanation) {
                  btnClass += "border-border bg-background hover:border-primary/50 text-foreground"
                } else {
                  if (isCorrect) {
                    btnClass += "border-success bg-success/10 text-success-foreground"
                  } else if (isSelected) {
                    btnClass += "border-destructive bg-destructive/10 text-destructive-foreground"
                  } else {
                    btnClass += "border-border bg-background/50 text-foreground/50 opacity-50"
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectAnswer(idx)}
                    className={btnClass}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>{opt}</span>
                      {showExplanation && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                      {showExplanation && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 animate-in slide-in-from-bottom-2">
                <div className="rounded-xl bg-primary/5 p-4 text-sm text-foreground/90 border border-primary/20">
                  <p className="font-semibold mb-1">Explanation:</p>
                  <p>{quiz.questions[currentQuestionIdx].explanation}</p>
                </div>
                
                <Button 
                  onClick={handleNext}
                  className="mt-6 w-full bg-primary text-primary-foreground"
                >
                  {currentQuestionIdx < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
