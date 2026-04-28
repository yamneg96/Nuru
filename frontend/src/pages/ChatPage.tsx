import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/api/chat.api";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  { icon: "help", text: "Can I get pregnant if..." },
  { icon: "warning", text: "My boyfriend is pressuring me" },
  { icon: "favorite", text: "How to talk about boundaries" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there. I'm Nuru, your safe space to ask anything about your body, relationships, or health. What's on your mind today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await sendMessage(msg, convId);
      setConvId(res.conversation_id);
      setMessages((p) => [...p, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "I'm having trouble connecting. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-surface text-on-surface h-[100dvh] flex flex-col antialiased">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 shadow-sm flex justify-between items-center px-5 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-blue-600 font-['Plus_Jakarta_Sans']">Nuru</h1>
          <span className="text-on-surface-variant opacity-70">Assistant</span>
        </div>
        <span className="material-symbols-outlined text-blue-600">lock_person</span>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-6 pb-48 flex flex-col gap-4">
        <div className="flex justify-center mb-4">
          <div className="bg-surface-container-high px-4 py-2 rounded-full flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary fill">encrypted</span>
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">End-to-End Encrypted</span>
          </div>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col gap-1 w-full max-w-[85%] sm:max-w-[70%] ${m.role === "user" ? "items-end self-end" : "items-start"}`}>
            <div className={`p-4 leading-relaxed ${m.role === "user" ? "bg-primary-fixed text-on-primary-fixed rounded-2xl rounded-tr-sm" : "bg-surface-container-lowest text-on-surface rounded-2xl rounded-tl-sm border border-gray-100"} shadow-[0_2px_10px_rgba(59,130,246,0.04)]`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start w-full max-w-[70%]">
            <div className="bg-surface-container-lowest p-4 rounded-2xl rounded-tl-sm border border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-8 pb-4 px-4 z-40 flex flex-col gap-3">
        {messages.length <= 1 && (
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button key={s.text} onClick={() => handleSend(s.text)} className="shrink-0 bg-surface-container-lowest border border-outline-variant rounded-full px-5 py-2.5 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>{s.text}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 bg-surface-container-lowest border border-outline-variant/60 rounded-[24px] p-2 pr-3 shadow-sm focus-within:border-primary-fixed-dim focus-within:ring-2 focus-within:ring-primary-fixed-dim/20 transition-all">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline resize-none py-3 px-3 min-h-[48px] max-h-[120px] outline-none" placeholder="Message Nuru securely..." rows={1} />
          <button onClick={() => handleSend()} disabled={!input.trim() || loading} className="p-3 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50"><span className="material-symbols-outlined fill">send</span></button>
        </div>
      </div>
    </div>
  );
}
