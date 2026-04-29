import { useNavigate } from "react-router-dom"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { loginWithGoogle } from "@/api/auth.api"
import { useAuthStore } from "@/store/authStore"
import { useState } from "react"

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return
    setLoading(true)
    setError("")
    try {
      const data = await loginWithGoogle(response.credential)
      login(data.token, data.anonymous_id)
      navigate("/onboarding")
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymousContinue = () => {
    navigate("/dashboard")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-container-low p-4 font-sans text-on-surface antialiased md:p-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute top-0 left-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed-dim/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-secondary-container/20 blur-[100px]" />

      <main className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-[80px]">
        {/* Left Column: Hero */}
        <div className="flex flex-col gap-6 px-4 md:col-span-5 md:px-0">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined fill text-[32px]">
              favorite
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-primary">
              Nuru
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">
            Talk freely.
            <br />
            <span className="text-primary">Stay private.</span>
          </h1>
          <p className="max-w-md text-lg leading-7 text-on-surface-variant">
            We use secure sign-in, but your identity stays anonymous.
          </p>
        </div>

        {/* Right Column: Interactive Card */}
        <div className="md:col-span-7">
          <div className="relative flex flex-col gap-8 overflow-hidden rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-sm shadow-primary/5 md:p-12">
            {error && (
              <div className="rounded-xl bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
                {error}
              </div>
            )}

            {/* Google Login */}
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex w-full justify-center">
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
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {/* Divider
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-outline-variant/50" />
                <span className="text-xs font-semibold tracking-wider text-outline uppercase">
                  or
                </span>
                <div className="h-px flex-1 bg-outline-variant/50" />
              </div> */}

              {/* Anonymous Option
              <button
                onClick={handleAnonymousContinue}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-transparent px-6 py-4 text-primary transition-colors duration-200 hover:bg-surface-container-low active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">
                  incognito
                </span>
                <span className="font-semibold">
                  Continue anonymously (limited features)
                </span>
              </button> */}
            </div>

            <hr className="border-outline-variant/30" />

            {/* Trust Indicators */}
            <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/10 bg-surface-container/50 p-6">
              {[
                {
                  icon: "no_accounts",
                  text: (
                    <>
                      We do{" "}
                      <strong className="font-semibold text-on-surface">
                        NOT
                      </strong>{" "}
                      store your name or email
                    </>
                  ),
                },
                {
                  icon: "visibility_off",
                  text: "You will be anonymous inside the app",
                },
                { icon: "lock", text: "Your conversations are private" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="material-symbols-outlined fill text-[24px] text-secondary">
                    {item.icon}
                  </span>
                  <p className="pt-[2px] text-on-surface-variant">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Microcopy */}
            <div className="pt-1 text-center">
              <p className="text-xs font-normal text-outline-variant">
                We only use Google to verify you are real.
                <br />
                You will not be identified.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
