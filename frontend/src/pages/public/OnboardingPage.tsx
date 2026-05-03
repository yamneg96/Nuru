import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem("nuru_has_seen_onboarding", "true")
    navigate("/")
  }

  // --- Screens ---
  const renderWelcome = () => (
    <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pt-24 pb-32 mx-auto w-full relative z-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="w-full aspect-square mb-lg rounded-[32px] overflow-hidden bg-surface-container-low shadow-[0_-4px_20px_rgba(59,130,246,0.08)] flex items-center justify-center">
        <img alt="Warm Welcome Illustration" className="w-full h-full object-cover opacity-90 mix-blend-multiply dark:mix-blend-normal" src="/Nuru_Logo.png"/>
      </div>
      <div className="text-center w-full mb-xl">
        <h1 className="font-h1 text-h1 text-primary mb-sm">Welcome to your safe space.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto">
          Nuru is here to support you on your journey. We provide a private, trusted environment for you to explore and understand your health.
        </p>
      </div>
      <div className="w-full flex justify-center mt-auto">
        <button onClick={handleNext} className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-full shadow-[0_-4px_20px_rgba(59,130,246,0.08)] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-2">
          Get Started
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>arrow_forward</span>
        </button>
      </div>
    </main>
  )

  const renderPrivacyFirst = () => (
    <main className="flex-1 flex flex-col justify-center px-margin-mobile pt-[100px] pb-[140px] mx-auto w-full relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="flex flex-col items-center text-center space-y-xl">
        <div className="relative group">
          <div className="absolute inset-0 bg-secondary-fixed/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
          <div className="relative flex items-center justify-center w-40 h-40 bg-surface-container-lowest border border-outline-variant/30 rounded-full shadow-[0_8px_32px_rgba(0,88,190,0.08)]">
            <div className="absolute inset-2 border border-dashed border-primary/20 rounded-full"></div>
            <span className="material-symbols-outlined text-[64px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-secondary-container rounded-full flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
              <span className="material-symbols-outlined text-on-secondary-container text-sm font-bold">check</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-md mx-auto">
          <h1 className="font-h1 text-h1 text-on-surface">No names.<br/>No judgment.</h1>
          <h2 className="font-h2 text-h2 text-primary">Your secrets are safe with us.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant pt-sm">
            Nuru is completely anonymous. We never ask for your real name, and your personal data is never shared. This is a secure space designed just for you.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-gutter w-full mt-lg">
          <div className="flex flex-col items-center justify-center p-md bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-[0_4px_16px_rgba(59,130,246,0.04)]">
            <span className="material-symbols-outlined text-secondary text-2xl mb-xs">visibility_off</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Invisible</span>
          </div>
          <div className="flex flex-col items-center justify-center p-md bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-[0_4px_16px_rgba(59,130,246,0.04)]">
            <span className="material-symbols-outlined text-secondary text-2xl mb-xs">encrypted</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  )

  const renderHowNuruHelps = () => (
    <main className="flex-grow w-full xl mx-auto px-margin-mobile pt-28 pb-40 flex flex-col gap-lg animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-md">
        <h1 className="font-h1 text-h1 text-on-surface mb-sm">How Nuru Helps</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant [280px] mx-auto">
          Your safe, private space to find answers and get care.
        </p>
      </div>
      <div className="w-full h-48 rounded-2xl bg-surface-container-high mb-sm overflow-hidden relative shadow-[0_-4px_20px_rgba(59,130,246,0.08)]">
        <img alt="" className="w-full h-full object-cover opacity-90" src="/Nuru_Logo.png"/>
      </div>
      <div className="flex flex-col relative px-2">
        <div className="absolute top-[24px] bottom-[48px] left-[34px] w-[2px] bg-surface-variant z-0 rounded-full"></div>
        <div className="flex gap-md mb-lg relative z-10">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>forum</span>
            </div>
          </div>
          <div className="pt-2">
            <h2 className="font-button text-button text-on-surface mb-xs">Ask a question</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Chat privately with our AI guide about your health concerns without any judgment.</p>
          </div>
        </div>
        <div className="flex gap-md mb-lg relative z-10">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>route</span>
            </div>
          </div>
          <div className="pt-2">
            <h2 className="font-button text-button text-on-surface mb-xs">Get guided steps</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Receive personalized, medically accurate information and actionable advice.</p>
          </div>
        </div>
        <div className="flex gap-md relative z-10">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-14 h-14 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>local_hospital</span>
            </div>
          </div>
          <div className="pt-2">
            <h2 className="font-button text-button text-on-surface mb-xs">Find safe solutions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Locate verified, youth-friendly clinics nearby for professional support and care.</p>
          </div>
        </div>
      </div>
    </main>
  )

  const renderCommunitySupport = () => (
    <main className="flex-grow pt-24 px-margin-mobile w-full xl mx-auto flex flex-col gap-lg animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="flex flex-col gap-sm text-center mb-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container mx-auto mb-sm">
          <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>group</span>
        </div>
        <h1 className="font-h1 text-h1 text-on-surface">Community &amp; Support</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant px-4">
          Hear from others like you. You are never alone on this journey.
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest border border-surface-variant rounded-[24px] p-lg shadow-[0_4px_20px_rgba(59,130,246,0.05)] relative overflow-hidden flex flex-col gap-md justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface italic relative z-10">
            "Finding reliable answers here helped me feel less anxious and more in control of my health choices."
          </p>
          <div className="flex items-center gap-sm relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdzkQIZEmz5vh3IA8BFL5dN9ifLEf4VtFnSlQ5GKsmGd1vPW-rkPC2sYe6DGi3zDz9ZKppjOCO0qda7sUT75a9UptGfE9gN4vu7rfi_fFQOQ7cRVj55dwHRNkcgLt6Frkqx1liMsjB-9EChXFYFcGJB8hF5Iv_6jr2RjxOemcU9fkTbhTXw2XWsTZGuhHR9SeMlCfJT106C3MHRaQG4-Q9jpiM_6ydVjwz6WyXOW2SQ4GYR6E8yOa1gkCFXmkwzVhXflbFlX64aHM')"}}></div>
            <div>
              <p className="font-button text-button text-on-surface">Anonymous</p>
              <p className="font-label-caps text-label-caps text-outline">University Student</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant rounded-[24px] p-lg shadow-[0_4px_20px_rgba(59,130,246,0.05)] relative overflow-hidden flex flex-col gap-md justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-secondary">
            <span className="material-symbols-outlined text-[64px]" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface italic relative z-10">
            "The community feels safe. I finally asked questions I was too scared to ask anyone else."
          </p>
          <div className="flex items-center gap-sm relative z-10">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed-dim overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfA-kJqqjWQ9DKMZ9Lx1FSXP1T67pdIFk3Ls1eFBSBsNjAxp4vtHu92sHzAiFmzF1hQ0OvVaXG83Aqc34w1gyT6R-MiuazZ6MxxMFVDCDjZymag-l1jSFzbYv3Xsosbm6TRrBq459w-hYseSoAfz52qtDUqXI_OVTQP9gsBqLW05bIF3rJHwsatOloS8r5v579TVB41OhJyS8Tnxs3nIdBSGgruDKQF5dbVJ7dvLsdzL7zv0TrhcmpUYmE-FxeotEf2By-cJhI_6Y')"}}></div>
            <div>
              <p className="font-button text-button text-on-surface">Anonymous</p>
              <p className="font-label-caps text-label-caps text-outline">Young Professional</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-sm bg-primary-container text-on-primary-container rounded-[32px] p-xl flex flex-col items-center text-center gap-md relative overflow-hidden shadow-[0_8px_30px_rgba(0,88,190,0.15)]">
        <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-40px] right-[-20px] w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-[40px]" style={{fontVariationSettings: "'FILL' 1"}}>support_agent</span>
          <h2 className="font-h2 text-h2 text-on-primary-container">Need more help?</h2>
          <p className="font-body-md text-body-md text-on-primary-container/90 [280px]">
            Professional counselors are available to chat privately and confidentially whenever you're ready.
          </p>
        </div>
      </section>
    </main>
  )

  const [language, setLanguage] = useState("English")
  const [interest, setInterest] = useState("Relationships")

  const renderPersonalize = () => (
    <main className="xl mx-auto px-margin-mobile flex flex-col gap-10 pt-28 pb-32 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="flex flex-col gap-3 mt-4">
        <div className="w-16 h-16 rounded-2xl mb-2 bg-gradient-to-br from-primary-fixed to-secondary-fixed opacity-60"></div>
        <h1 className="font-h1 text-h1 text-on-surface">Personalize Your Experience</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Let's tailor Nuru to make it feel like your own safe space.</p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-h2 text-h2 text-on-surface">Language</h2>
        <div className="grid grid-cols-1 gap-3">
          {["English", "አማርኛ", "Afaan Oromoo"].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang)} className={`flex items-center justify-between p-lg rounded-xl border-2 text-left w-full transition-colors ${language === lang ? "border-primary bg-primary-fixed/20" : "border-outline-variant bg-surface hover:bg-surface-container-low"}`}>
              <div className="flex flex-col gap-1 relative z-10">
                <span className={`font-button text-button ${language === lang ? "text-on-primary-fixed" : "text-on-surface"}`}>{lang}</span>
              </div>
              <span className={`material-symbols-outlined ${language === lang ? "text-primary" : "text-outline-variant"}`} style={{fontVariationSettings: language === lang ? "'FILL' 1" : "'FILL' 0"}}>{language === lang ? "radio_button_checked" : "radio_button_unchecked"}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="font-h2 text-h2 text-on-surface">Areas of Focus</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-2">Select what you'd like to explore first.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "Relationships", icon: "favorite", desc: "Navigating connections, boundaries, and communication." },
            { id: "Health", icon: "health_and_safety", desc: "Understanding your body, wellbeing, and safety." },
            { id: "Personal Growth", icon: "psychology", desc: "Building confidence, life skills, and planning for the future.", cols: "sm:col-span-2" }
          ].map(item => (
            <button key={item.id} onClick={() => setInterest(item.id)} className={`flex flex-col gap-3 p-lg rounded-xl border-2 text-left w-full transition-colors ${item.cols || ""} ${interest === item.id ? "border-primary bg-surface" : "border-outline-variant bg-surface hover:bg-surface-container-low"}`}>
              <div className="flex justify-between items-start w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${interest === item.id ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: interest === item.id ? "'FILL' 1" : "'FILL' 0"}}>{item.icon}</span>
                </div>
                <span className={`material-symbols-outlined ${interest === item.id ? "text-primary" : "text-outline-variant opacity-50"}`} style={{fontVariationSettings: interest === item.id ? "'FILL' 1" : "'FILL' 0"}}>{interest === item.id ? "check_circle" : "add_circle"}</span>
              </div>
              <div>
                <h3 className="font-button text-button text-on-surface mb-1">{item.id}</h3>
                <p className="font-body-md text-[14px] leading-tight text-on-surface-variant">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )

  const renderReady = () => (
    <main className="flex-1 flex flex-col justify-between px-margin-mobile py-xl md mx-auto w-full h-full relative z-10 pt-28 pb-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="flex flex-col items-center justify-center text-center flex-1 w-full mt-10">
        <div className="relative w-56 h-56 mb-xl group">
          <div className="absolute inset-0 bg-primary-fixed rounded-full blur-[40px] opacity-60 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700"></div>
          <img className="relative w-full h-full object-cover rounded-full shadow-[0_12px_40px_rgba(0,88,190,0.12)] border-[6px] border-surface transition-transform duration-500 group-hover:-translate-y-2" src="/Nuru_Logo.png"/>
          <div className="absolute -bottom-2 -right-2 bg-secondary-container text-on-secondary-container rounded-full p-3 shadow-lg flex items-center justify-center border-4 border-surface">
            <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
          </div>
        </div>
        <div className="space-y-sm [280px]">
          <h1 className="font-h1 text-h1 text-on-surface tracking-tight">You're all set!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Your journey to safe, informed choices starts now.</p>
        </div>
      </section>
      <section className="w-full pt-lg pb-sm mt-auto z-20">
        <button onClick={completeOnboarding} className="w-full bg-primary text-on-primary font-button text-button py-[18px] px-6 rounded-full shadow-[0_8px_24px_rgba(0,88,190,0.15)] hover:bg-surface-tint hover:shadow-[0_12px_32px_rgba(0,88,190,0.2)] active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-2 group">
          <span>Go to Dashboard</span>
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
        </button>
      </section>
    </main>
  )

  const steps = [
    renderWelcome,
    renderPrivacyFirst,
    renderHowNuruHelps,
    renderCommunitySupport,
    renderPersonalize,
    renderReady
  ]

  // Note: Welcome screen (step 0) has a different structure and button logic built into the center, 
  // and no standard bottom nav in the design. Step 5 (Ready) also has a built-in button.
  // The middle steps 1-4 use a bottom nav.

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md selection:bg-primary-fixed selection:text-on-primary-fixed relative">
      {/* Top Header */}
      <header className="fixed w-full top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 xl mx-auto">
          <span className="font-h1 text-2xl font-bold tracking-tight text-primary">Nuru</span>
          {step < 5 && (
            <button onClick={completeOnboarding} className="font-button text-primary hover:bg-surface-container-low px-4 py-2 rounded-full active:scale-95 transition-all">
              Skip
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {steps[step]()}

      {/* Ambient background for step 0 and 5 */}
      {(step === 0 || step === 5) && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="absolute w-[120vw] h-[120vw] [800px] max-h-[800px] bg-primary-fixed-dim/20 rounded-full blur-3xl -top-[20%] -right-[20%]"></div>
          <div className="absolute w-[100vw] h-[100vw] [600px] max-h-[600px] bg-secondary-fixed-dim/10 rounded-full blur-3xl bottom-[0%] -left-[20%]"></div>
        </div>
      )}

      {/* Bottom Navigation for steps 1-4 */}
      {step > 0 && step < 5 && (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 flex justify-center pointer-events-none px-0 sm:px-4">
          <nav className="pointer-events-auto w-full sm:w-auto sm:min-w-[500px] rounded-t-[32px] sm:rounded-b-[32px] sm:mb-4 bg-surface border border-outline-variant/20 shadow-[0_-4px_20px_rgba(59,130,246,0.08)] animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-around items-center px-4 py-4 mx-auto w-full">
              <button onClick={handleBack} className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary px-6 py-2 active:scale-[0.98] transition-all duration-200">
                <span className="material-symbols-outlined mb-1 text-[24px]">arrow_back</span>
                <span className="font-label-caps font-medium">Back</span>
              </button>
  
              <div className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2">
                <div className="flex gap-2 items-center h-[24px]">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${step === idx ? 'w-6 bg-primary' : 'w-2 bg-surface-variant'}`}></div>
                  ))}
                </div>
                <span className="font-label-caps font-medium opacity-0">Progress</span>
              </div>
  
              <button onClick={handleNext} className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-6 py-2 hover:bg-primary hover:text-on-primary active:scale-[0.98] transition-all duration-200">
                <span className="material-symbols-outlined mb-1 text-[24px]">arrow_forward</span>
                <span className="font-label-caps font-medium">Next</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
