import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle } from "@/api/auth.api";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return;
    setLoading(true);
    setError("");
    try {
      const data = await loginWithGoogle(response.credential);
      login(data.token, data.anonymous_id);
      navigate("/onboarding");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-on-surface antialiased relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-fixed-dim/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-[80px] items-center relative z-10">
        {/* Left Column: Hero */}
        <div className="md:col-span-5 flex flex-col gap-6 px-4 md:px-0">
          <div className="flex items-center gap-2 text-primary mb-2">
            <span className="material-symbols-outlined text-[32px] fill">favorite</span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl text-primary font-extrabold tracking-tight">Nuru</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">
            Talk freely.<br />
            <span className="text-primary">Stay private.</span>
          </h1>
          <p className="text-lg leading-7 text-on-surface-variant max-w-md">
            We use secure sign-in, but your identity stays anonymous.
          </p>
        </div>

        {/* Right Column: Interactive Card */}
        <div className="md:col-span-7">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-sm shadow-primary/5 border border-outline-variant/30 flex flex-col gap-8 relative overflow-hidden">
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {/* Google Login */}
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google sign-in failed")}
                  shape="pill"
                  size="large"
                  width="100%"
                  text="continue_with"
                />
              </div>

              {loading && (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-outline-variant/50 flex-1" />
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">or</span>
                <div className="h-px bg-outline-variant/50 flex-1" />
              </div>

              {/* Anonymous Option */}
              <button
                onClick={handleAnonymousContinue}
                className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-surface-container-low text-primary transition-colors rounded-full py-4 px-6 active:scale-[0.98] duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">incognito</span>
                <span className="font-semibold">Continue anonymously (limited features)</span>
              </button>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Trust Indicators */}
            <div className="flex flex-col gap-3 bg-surface-container/50 rounded-2xl p-6 border border-outline-variant/10">
              {[
                { icon: "no_accounts", text: <>We do <strong className="text-on-surface font-semibold">NOT</strong> store your name or email</> },
                { icon: "visibility_off", text: "You will be anonymous inside the app" },
                { icon: "lock", text: "Your conversations are private" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary text-[24px] fill">{item.icon}</span>
                  <p className="text-on-surface-variant pt-[2px]">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Footer Microcopy */}
            <div className="text-center pt-1">
              <p className="text-xs text-outline-variant font-normal">
                We only use Google to verify you are real.<br />You will not be identified.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
