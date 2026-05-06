import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { sendMessage } from "@/api/chat.api"
import { FeedbackModal } from "@/components/shared/FeedbackModal"
import { useTranslation } from "react-i18next"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const SUGGESTIONS = [
    { icon: "help", text: t('chat.suggestion1', "Can I get pregnant if...") },
    { icon: "warning", text: t('chat.suggestion2', "My boyfriend is pressuring me") },
    { icon: "favorite", text: t('chat.suggestion3', "How to talk about boundaries") },
  ]

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t('chat.welcome_msg', "Hi there. I'm Nuru, your safe space to ask anything about your body, relationships, or health. What's on your mind today?"),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | undefined>()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput("")
    setMessages((p) => [...p, { role: "user", content: msg }])
    setLoading(true)
    try {
      const res = await sendMessage(msg, convId)
      setConvId(res.conversation_id)
      setMessages((p) => [...p, { role: "assistant", content: res.reply }])
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: t('chat.error_msg', "I'm having trouble connecting. Please try again."),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-surface text-on-surface antialiased">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3 shadow-sm dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="mr-2 rounded-full p-2 hover:bg-surface-hover">
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-blue-600">
            Nuru
          </h1>
          <span className="text-on-surface-variant opacity-70">{t('chat.assistant', 'Assistant')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant transition-colors text-sm font-medium text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">rate_review</span>
            {t('common.feedback', 'Feedback')}
          </button>
          <span className="material-symbols-outlined text-blue-600 ml-2">
            lock_person
          </span>
        </div>
      </header>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        context="chat" 
      />

      <main
        ref={scrollRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pt-6 pb-48"
      >
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2">
            <span className="material-symbols-outlined fill text-[16px] text-secondary">
              encrypted
            </span>
            <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              {t('chat.encrypted', 'End-to-End Encrypted')}
            </span>
          </div>
        </div>

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex w-full max-w-[85%] flex-col gap-1 sm:max-w-[70%] ${m.role === "user" ? "items-end self-end" : "items-start"}`}
          >
            <div
              className={`p-4 leading-relaxed ${m.role === "user" ? "rounded-2xl rounded-tr-sm bg-primary-fixed text-on-primary-fixed" : "rounded-2xl rounded-tl-sm border border-gray-100 bg-surface-container-lowest text-on-surface"} shadow-[0_2px_10px_rgba(59,130,246,0.04)]`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex w-full max-w-[70%] flex-col items-start">
            <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-surface-container-lowest p-4">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary/40" />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 z-40 flex w-full flex-col gap-3 bg-linear-to-t from-surface via-surface to-transparent px-4 pt-8 pb-4">
        {messages.length <= 1 && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.text}
                onClick={() => handleSend(s.text)}
                className="flex shrink-0 items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-on-surface-variant shadow-sm transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {s.icon}
                </span>
                {s.text}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-2 pr-3 shadow-sm transition-all focus-within:border-primary-fixed-dim focus-within:ring-2 focus-within:ring-primary-fixed-dim/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="max-h-30 min-h-12 flex-1 resize-none border-none bg-transparent px-3 py-3 text-on-surface outline-none placeholder:text-outline focus:ring-0"
            placeholder={t('chat.placeholder', 'Message Nuru securely...')}
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-full bg-primary p-3 text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <span className="material-symbols-outlined fill">send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
