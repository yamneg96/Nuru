import { Link } from "react-router-dom";
import { useMetrics } from "@/hooks/useMetrics";

export default function LandingPage() {
  const { data: metrics } = useMetrics();

  return (
    <div className="bg-surface-bright min-h-screen flex flex-col font-sans antialiased text-on-surface">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-8 py-4 sticky top-0 z-50 bg-white/90 backdrop-blur-md dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm font-['Plus_Jakarta_Sans']">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Nuru</div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 font-semibold text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#how-it-works">How it works</a>
            <a className="hover:text-primary transition-colors" href="#features">Features</a>
            <a className="hover:text-primary transition-colors" href="#trust">About us</a>
          </nav>
          <Link
            to="/login"
            className="bg-primary/10 text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary/20 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">lock_person</span>
            Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-[1440px] mx-auto px-8 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 flex flex-col items-start text-left">
          <div className="w-24 h-24 bg-primary-fixed rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_8px_24px_rgba(59,130,246,0.12)]">
            <span className="material-symbols-outlined text-[48px] text-primary fill">psychology_alt</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[56px] leading-[64px] font-bold text-on-surface mb-3 tracking-tight text-balance">
            Your life. Your choices. Your future.
          </h1>
          <p className="text-xl leading-8 text-on-surface-variant mb-16 text-balance max-w-2xl">
            Anonymous support for relationships, health, and life decisions. A safe space built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/login"
              className="px-8 bg-primary text-on-primary font-semibold py-4 rounded-full shadow-[0_4px_16px_rgba(0,88,190,0.25)] transition-transform hover:scale-105 active:scale-95 active:shadow-sm text-center"
            >
              Start Now (No Login)
            </Link>
            <a
              href="#how-it-works"
              className="px-8 bg-surface-container-low text-primary border border-outline-variant/30 font-semibold py-4 rounded-full transition-transform hover:bg-surface-container hover:scale-105 active:scale-95 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="flex-1 w-full">
          <img
            className="w-full h-[600px] object-cover rounded-[2rem] shadow-[0_24px_48px_rgba(59,130,246,0.12)] border border-outline-variant/30"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_BCuzlFXfVvIpoQnnsL58xgZRGQ6HTh_4P8DT_tOROlhfLZ_WXOMNnz-b5QOdPk6o4FRGFr6-N9D84oAoHaoiGiuWZVrtqwUQ2yipXlosw-OnbnL4HaJdsGxFlF6vr0XaV9vWDl11Ed0gBDeq1JOTyZqgxq89G3f60gpTUGCVZ5mzoyYn0wrXDWOuy9FmZs4RpXVYPALNquYcda4pxJQ2iHxdM1CIE8-BtZF-T3ll8FQxaeWabRkxePXD9XiHF1kXvMUPsQrqRI"
            alt="Group of diverse youth standing together"
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-[1440px] mx-auto px-8 mb-[120px]">
        <div className="text-center mb-16">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface mb-3">How it works</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">Simple, secure, and designed with your privacy in mind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: "visibility_off", title: "Ask Anonymously", desc: "No names, no tracking. Your identity is completely hidden from the moment you start typing.", color: "primary-fixed" },
            { icon: "medical_information", title: "Get Expert Answers", desc: "Receive reliable, judgment-free guidance from verified medical and counseling professionals.", color: "secondary-container" },
            { icon: "directions", title: "Make Informed Choices", desc: "Use accurate, culturally relevant information to make the best decisions for your future.", color: "tertiary-fixed" },
          ].map((step) => (
            <div key={step.title} className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-10 flex flex-col gap-4 shadow-[0_8px_32px_rgba(59,130,246,0.04)] relative overflow-hidden items-start hover:shadow-[0_16px_48px_rgba(59,130,246,0.08)] transition-shadow">
              <div className={`absolute right-0 top-0 w-32 h-32 bg-${step.color}/30 rounded-bl-[4rem] -z-0`} />
              <div className={`w-16 h-16 shrink-0 bg-${step.color} rounded-2xl flex items-center justify-center relative z-10 mb-2`}>
                <span className="material-symbols-outlined text-[32px] fill">{step.icon}</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-on-surface mb-2 text-2xl">{step.title}</h3>
                <p className="text-lg text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-[1440px] mx-auto px-8 mb-[120px]">
        <div className="bg-primary/5 rounded-[2rem] p-16 flex flex-col items-center text-center">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface mb-10">Trusted by Youth Like You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-16">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[48px] text-primary mb-2">groups</span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-primary">
                {metrics ? metrics.total_users.toLocaleString() + "+" : "10,000+"}
              </div>
              <div className="text-lg text-on-surface-variant">youth supported</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[48px] text-secondary mb-2">forum</span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-secondary">
                {metrics ? metrics.total_questions.toLocaleString() + "+" : "5,000+"}
              </div>
              <div className="text-lg text-on-surface-variant">questions answered</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[48px] text-tertiary mb-2">trending_up</span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-tertiary">Growing</div>
              <div className="text-lg text-on-surface-variant">every day</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center border-t border-outline-variant/20 pt-8 w-full max-w-3xl">
            <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-secondary">visibility_off</span>
              <span>All users remain anonymous</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined text-secondary">shield_lock</span>
              <span>No personal data shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="bg-surface-container-low py-[120px]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-10">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface mb-3">Key Features</h2>
              <p className="text-xl text-on-surface-variant max-w-2xl">Everything you need to navigate life's big questions.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="col-span-1 md:col-span-8 bg-primary-container text-on-primary-container rounded-[2rem] p-16 flex flex-col justify-center gap-4 shadow-[0_16px_48px_rgba(33,112,228,0.12)] relative overflow-hidden min-h-[400px]">
              <div className="absolute -right-12 -bottom-12 opacity-10">
                <span className="material-symbols-outlined text-[300px] fill">forum</span>
              </div>
              <span className="material-symbols-outlined text-[48px] mb-2 fill">forum</span>
              <div className="relative z-10 max-w-lg">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold mb-4">Anonymous Q&amp;A Community</h3>
                <p className="text-xl opacity-90">A safe space to ask anything without fear of judgment or exposure.</p>
              </div>
            </div>
            <div className="col-span-1 md:col-span-4 flex flex-col gap-10">
              <div className="flex-1 bg-secondary-container text-on-secondary-container rounded-[2rem] p-8 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[40px] fill">explore</span>
                <div className="mt-auto pt-8">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-2">Life guidance</h3>
                  <p className="opacity-90">Navigate relationships and personal growth.</p>
                </div>
              </div>
              <div className="flex-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-[2rem] p-8 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[40px] fill">diversity_3</span>
                <div className="mt-auto pt-8">
                  <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-2">Youth-friendly services</h3>
                  <p className="opacity-90">Tailored support for young adults.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="bg-surface-container py-[120px] px-8 flex flex-col items-center text-center gap-10">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-6 py-3 rounded-full shadow-sm mb-2 border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[24px] fill">verified_user</span>
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Private &amp; Secure by Design</span>
        </div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[48px] font-bold text-on-surface max-w-3xl">Built for Ethiopian youth</h2>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Designed with deep respect for local culture, prioritizing your privacy, safety, and well-being above all else.
        </p>
        <div className="mt-16">
          <Link
            to="/login"
            className="px-12 bg-primary text-on-primary font-semibold py-4 rounded-full shadow-[0_4px_16px_rgba(0,88,190,0.25)] transition-transform hover:scale-105 active:scale-95 text-xl"
          >
            Start Your Journey Anonymously
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-inverse-surface text-inverse-on-surface py-16 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-2xl font-bold text-inverse-primary">Nuru</div>
          <div className="flex gap-8">
            <a className="hover:text-inverse-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-inverse-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-inverse-primary transition-colors" href="#">Contact</a>
          </div>
          <div className="text-sm opacity-70">© 2024 Nuru. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
