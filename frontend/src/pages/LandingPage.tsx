import { Link } from "react-router-dom"
import { useMetrics } from "@/hooks/useMetrics"

export default function LandingPage() {
  const { data: metrics } = useMetrics()

  return (
    <div className="flex min-h-screen flex-col bg-surface-bright font-sans text-on-surface antialiased">
      {/* Hero Section */}
      <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-16 px-8 pt-20 pb-16 lg:flex-row">
        <div className="flex flex-1 flex-col items-start text-left">
          <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-primary-fixed shadow-[0_8px_24px_rgba(59,130,246,0.12)]">
            <span className="material-symbols-outlined fill text-[48px] text-primary">
              psychology_alt
            </span>
          </div>
          <h1 className="mb-3 font-['Plus_Jakarta_Sans'] text-[56px] leading-[64px] font-bold tracking-tight text-balance text-on-surface">
            Your life. Your choices. Your future.
          </h1>
          <p className="mb-16 max-w-2xl text-xl leading-8 text-balance text-on-surface-variant">
            Anonymous support for relationships, health, and life decisions. A
            safe space built for you.
          </p>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Link
              to="/login"
              className="rounded-full bg-primary px-8 py-4 text-center font-semibold text-on-primary shadow-[0_4px_16px_rgba(0,88,190,0.25)] transition-transform hover:scale-105 active:scale-95 active:shadow-sm"
            >
              Start Now (No Login)
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-outline-variant/30 bg-surface-container-low px-8 py-4 text-center font-semibold text-primary transition-transform hover:scale-105 hover:bg-surface-container active:scale-95"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="w-full flex-1">
          <img
            className="h-[600px] w-full rounded-[2rem] border border-outline-variant/30 object-cover shadow-[0_24px_48px_rgba(59,130,246,0.12)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_BCuzlFXfVvIpoQnnsL58xgZRGQ6HTh_4P8DT_tOROlhfLZ_WXOMNnz-b5QOdPk6o4FRGFr6-N9D84oAoHaoiGiuWZVrtqwUQ2yipXlosw-OnbnL4HaJdsGxFlF6vr0XaV9vWDl11Ed0gBDeq1JOTyZqgxq89G3f60gpTUGCVZ5mzoyYn0wrXDWOuy9FmZs4RpXVYPALNquYcda4pxJQ2iHxdM1CIE8-BtZF-T3ll8FQxaeWabRkxePXD9XiHF1kXvMUPsQrqRI"
            alt="Group of diverse youth standing together"
          />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto mb-[120px] max-w-[1440px] px-8"
      >
        <div className="mb-16 text-center">
          <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface">
            How it works
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-on-surface-variant">
            Simple, secure, and designed with your privacy in mind.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {[
            {
              icon: "visibility_off",
              title: "Ask Anonymously",
              desc: "No names, no tracking. Your identity is completely hidden from the moment you start typing.",
              color: "primary-fixed",
            },
            {
              icon: "medical_information",
              title: "Get Expert Answers",
              desc: "Receive reliable, judgment-free guidance from verified medical and counseling professionals.",
              color: "secondary-container",
            },
            {
              icon: "directions",
              title: "Make Informed Choices",
              desc: "Use accurate, culturally relevant information to make the best decisions for your future.",
              color: "tertiary-fixed",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="relative flex flex-col items-start gap-4 overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container-lowest p-10 shadow-[0_8px_32px_rgba(59,130,246,0.04)] transition-shadow hover:shadow-[0_16px_48px_rgba(59,130,246,0.08)]"
            >
              <div
                className={`absolute top-0 right-0 h-32 w-32 bg-${step.color}/30 -z-0 rounded-bl-[4rem]`}
              />
              <div
                className={`h-16 w-16 shrink-0 bg-${step.color} relative z-10 mb-2 flex items-center justify-center rounded-2xl`}
              >
                <span className="material-symbols-outlined fill text-[32px]">
                  {step.icon}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="mb-2 text-2xl font-semibold text-on-surface">
                  {step.title}
                </h3>
                <p className="text-lg text-on-surface-variant">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto mb-[120px] max-w-[1440px] px-8">
        <div className="flex flex-col items-center rounded-[2rem] bg-primary/5 p-16 text-center">
          <h2 className="mb-10 font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface">
            Trusted by Youth Like You
          </h2>
          <div className="mb-16 grid w-full grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined mb-2 text-[48px] text-primary">
                groups
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-primary">
                {metrics
                  ? metrics.total_users.toLocaleString() + "+"
                  : "10,000+"}
              </div>
              <div className="text-lg text-on-surface-variant">
                youth supported
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined mb-2 text-[48px] text-secondary">
                forum
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-secondary">
                {metrics
                  ? metrics.total_questions.toLocaleString() + "+"
                  : "5,000+"}
              </div>
              <div className="text-lg text-on-surface-variant">
                questions answered
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined mb-2 text-[48px] text-tertiary">
                trending_up
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-[40px] font-bold text-tertiary">
                Growing
              </div>
              <div className="text-lg text-on-surface-variant">every day</div>
            </div>
          </div>
          <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 border-t border-outline-variant/20 pt-8 sm:flex-row">
            <div className="flex items-center gap-2 font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary">
                visibility_off
              </span>
              <span>All users remain anonymous</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary">
                shield_lock
              </span>
              <span>No personal data shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="bg-surface-container-low py-[120px]">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mb-16 flex flex-col items-end justify-between gap-10 md:flex-row">
            <div>
              <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[40px] leading-[48px] font-bold text-on-surface">
                Key Features
              </h2>
              <p className="max-w-2xl text-xl text-on-surface-variant">
                Everything you need to navigate life's big questions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="relative col-span-1 flex min-h-[400px] flex-col justify-center gap-4 overflow-hidden rounded-[2rem] bg-primary-container p-16 text-on-primary-container shadow-[0_16px_48px_rgba(33,112,228,0.12)] md:col-span-8">
              <div className="absolute -right-12 -bottom-12 opacity-10">
                <span className="material-symbols-outlined fill text-[300px]">
                  forum
                </span>
              </div>
              <span className="material-symbols-outlined fill mb-2 text-[48px]">
                forum
              </span>
              <div className="relative z-10 max-w-lg">
                <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-[32px] font-bold">
                  Anonymous Q&amp;A Community
                </h3>
                <p className="text-xl opacity-90">
                  A safe space to ask anything without fear of judgment or
                  exposure.
                </p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-10 md:col-span-4">
              <div className="flex min-h-[180px] flex-1 flex-col justify-between rounded-[2rem] bg-secondary-container p-8 text-on-secondary-container shadow-sm transition-shadow hover:shadow-md">
                <span className="material-symbols-outlined fill text-[40px]">
                  explore
                </span>
                <div className="mt-auto pt-8">
                  <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold">
                    Life guidance
                  </h3>
                  <p className="opacity-90">
                    Navigate relationships and personal growth.
                  </p>
                </div>
              </div>
              <div className="text-on-tertiary-fixed-variant flex min-h-[180px] flex-1 flex-col justify-between rounded-[2rem] bg-tertiary-fixed p-8 shadow-sm transition-shadow hover:shadow-md">
                <span className="material-symbols-outlined fill text-[40px]">
                  diversity_3
                </span>
                <div className="mt-auto pt-8">
                  <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold">
                    Youth-friendly services
                  </h3>
                  <p className="opacity-90">
                    Tailored support for young adults.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section
        id="trust"
        className="flex flex-col items-center gap-10 bg-surface-container px-8 py-[120px] text-center"
      >
        <div className="mb-2 flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-6 py-3 shadow-sm">
          <span className="material-symbols-outlined fill text-[24px] text-secondary">
            verified_user
          </span>
          <span className="text-xs font-semibold tracking-wider text-secondary uppercase">
            Private &amp; Secure by Design
          </span>
        </div>
        <h2 className="max-w-3xl font-['Plus_Jakarta_Sans'] text-[48px] font-bold text-on-surface">
          Built for Ethiopian youth
        </h2>
        <p className="max-w-2xl text-xl text-on-surface-variant">
          Designed with deep respect for local culture, prioritizing your
          privacy, safety, and well-being above all else.
        </p>
        <div className="mt-16">
          <Link
            to="/login"
            className="rounded-full bg-primary px-12 py-4 text-xl font-semibold text-on-primary shadow-[0_4px_16px_rgba(0,88,190,0.25)] transition-transform hover:scale-105 active:scale-95"
          >
            Start Your Journey Anonymously
          </Link>
        </div>
      </section>

    </div>
  )
}
