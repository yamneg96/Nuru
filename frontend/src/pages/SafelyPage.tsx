import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export default function SafelyPage() {
  const navigate = useNavigate();
  const anonymousId = useAuthStore((s) => s.anonymousId);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [copied, setCopied] = useState(false);

  // Generate a short display ID from the anonymous_id
  const displayId = anonymousId
    ? `User #${anonymousId.slice(0, 4).toUpperCase()}`
    : "User #ANON";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleStart = () => {
    setOnboarded(true);
    navigate("/dashboard");
  };

  return (
    <div className="bg-gradient-to-br from-surface to-surface-container-low min-h-screen flex items-center justify-center p-6 antialiased">
      <main className="w-full max-w-[480px]">
        <div className="bg-surface-container-lowest rounded-[24px] p-8 md:p-10 shadow-[0_8px_40px_rgba(0,88,190,0.06)] border border-surface-variant/50 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 shadow-sm shadow-primary/10">
            <span className="material-symbols-outlined fill text-[48px]">shield_person</span>
          </div>

          {/* Text */}
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface mb-3">
            You're In — Safely
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant mb-8 px-4">
            You're now anonymous. No one knows who you are.
          </p>

          {/* Anonymous ID Badge */}
          <div className="w-full bg-surface-container rounded-xl p-5 mb-8 flex items-center justify-between border border-surface-container-highest">
            <div className="text-left flex flex-col gap-1">
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">Your Anonymous ID</span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface tracking-wide">
                {displayId}
              </span>
            </div>
            <button
              onClick={handleCopy}
              aria-label="Copy ID"
              className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center text-primary hover:bg-surface-variant transition-colors group"
            >
              <span className="material-symbols-outlined group-active:scale-90 transition-transform">
                {copied ? "check" : "content_copy"}
              </span>
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="w-full bg-primary text-on-primary font-semibold py-4 px-8 rounded-full hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm shadow-primary/20"
          >
            Start exploring
          </button>
        </div>
      </main>
    </div>
  );
}
