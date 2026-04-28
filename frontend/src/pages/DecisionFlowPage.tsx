import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { startFlow, submitStep, getResult } from "@/api/decision.api";
import type { DecisionQuestion, DecisionResult, FlowType } from "../../../shared/types";

export default function DecisionFlowPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const flowType = (params.get("flow") || "missed_period") as FlowType;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(4);
  const [question, setQuestion] = useState<DecisionQuestion | null>(null);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [selected, setSelected] = useState<string | string[]>("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await startFlow(flowType);
      setSessionId(res.session_id);
      setCurrentStep(res.current_step);
      setTotalSteps(res.total_steps);
      setQuestion(res.question);
      setStarted(true);
    } catch { /* fallback */ }
    finally { setLoading(false); }
  };

  const handleNext = async () => {
    if (!sessionId || !selected) return;
    setLoading(true);
    try {
      const res = await submitStep(sessionId, selected);
      setCurrentStep(res.current_step);
      if (res.completed) {
        const resultData = await getResult(sessionId);
        setResult(resultData);
      } else if (res.question) {
        setQuestion(res.question);
        setSelected("");
      }
    } catch { /* fallback */ }
    finally { setLoading(false); }
  };

  // Not started yet — show intro
  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[40px] fill">psychology</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-bold text-on-surface">Let's figure this out together</h1>
          <p className="text-lg text-on-surface-variant">We'll ask a few private questions to help guide you. Everything stays anonymous.</p>
          <button onClick={handleStart} disabled={loading} className="w-full bg-primary text-on-primary font-semibold py-4 rounded-full shadow-[0_4px_20px_rgba(0,88,190,0.2)] active:scale-[0.98] transition-transform disabled:opacity-50">
            {loading ? "Starting..." : "Begin Assessment"}
          </button>
        </div>
      </div>
    );
  }

  // Show result
  if (result) {
    const riskColors = { low: "text-secondary", moderate: "text-tertiary", high: "text-error" };
    return (
      <div className="min-h-screen bg-background pb-32">
        <header className="sticky top-0 z-50 flex justify-between items-center px-5 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm font-['Plus_Jakarta_Sans']">
          <div className="text-xl font-bold text-blue-600">Nuru</div>
        </header>
        <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`material-symbols-outlined text-[32px] fill ${riskColors[result.risk_level]}`}>assessment</span>
              <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-on-surface">Your Results</h1>
            </div>
            <p className="text-lg text-on-surface-variant mb-4">{result.summary}</p>
            {result.ai_explanation && (
              <div className="bg-primary-fixed/30 rounded-xl p-4 mb-4 border border-primary-fixed-dim/30">
                <p className="text-on-surface text-sm">{result.ai_explanation}</p>
              </div>
            )}
            <div className="space-y-2">
              {result.advice.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">check_circle</span>
                  <p className="text-on-surface-variant">{a}</p>
                </div>
              ))}
            </div>
          </div>
          <h3 className="text-xs font-semibold text-outline uppercase tracking-wider">What would you like to do next?</h3>
          <div className="flex flex-col gap-3">
            {result.next_steps?.map((step, i) => (
              <button key={i} onClick={() => navigate(step.action)} className="w-full flex items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant hover:bg-surface-container transition-colors group text-left">
                <div className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center text-on-surface mr-4 group-hover:bg-primary-fixed group-hover:text-on-primary-fixed transition-colors">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <div className="flex-grow">
                  <span className="font-semibold text-on-surface block">{step.title}</span>
                  <span className="text-on-surface-variant text-sm block">{step.description}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Show question step
  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm font-['Plus_Jakarta_Sans']">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="text-xl font-bold text-blue-600">Nuru</div>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-5 pt-6">
        {/* Progress */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Step {currentStep + 1} of {totalSteps}</span>
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden mt-2">
            <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>

        {question && (
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-2">{question.text}</h2>
            {question.subtitle && <p className="text-sm text-on-surface-variant mb-4">{question.subtitle}</p>}
            <div className={question.type === "multiple_choice" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
              {question.options.map((opt) => {
                const isSelected = question.type === "multiple_choice"
                  ? Array.isArray(selected) && selected.includes(opt.value)
                  : selected === opt.value;
                return (
                  <label key={opt.value} className="relative cursor-pointer group">
                    <input type={question.type === "multiple_choice" ? "checkbox" : "radio"} className="sr-only"
                      checked={isSelected}
                      onChange={() => {
                        if (question.type === "multiple_choice") {
                          const arr = Array.isArray(selected) ? selected : [];
                          setSelected(isSelected ? arr.filter((v) => v !== opt.value) : [...arr, opt.value]);
                        } else { setSelected(opt.value); }
                      }}
                    />
                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group-hover:border-primary/50 ${isSelected ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface-container-lowest"}`}>
                      <span className="font-semibold text-on-surface">{opt.label}</span>
                      {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        )}

        <div className="fixed bottom-0 left-0 w-full p-5 bg-gradient-to-t from-background via-background to-transparent z-40">
          <div className="max-w-lg mx-auto">
            <button onClick={handleNext} disabled={!selected || (Array.isArray(selected) && selected.length === 0) || loading}
              className="w-full bg-primary text-on-primary font-semibold py-4 rounded-full shadow-[0_4px_20px_rgba(59,130,246,0.2)] active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? "Processing..." : "Next Step"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
