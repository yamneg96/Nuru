import { Link } from "react-router-dom"
import { useMetrics } from "@/hooks/useMetrics"
import { useEffect } from "react"

export default function LandingPage() {
  const { data: metrics } = useMetrics()

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach((reveal) => {
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 100;
        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger on load
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md  pb-32">
      {/* Mobile Header */}
      <header className="md:hidden bg-surface-container-lowest flex justify-between items-center px-margin-mobile py-md sticky top-0 z-40 bg-opacity-90 backdrop-blur-sm border-b border-outline-variant">
        <div className="font-h2 text-h2 text-primary font-bold tracking-tight">Nuru</div>
        <Link to="/login" aria-label="Quick Exit" className="text-primary p-2 rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>lock_person</span>
        </Link>
      </header>

      {/* 1. Hero Section */}
      <div className="bg-gradient-to-b from-surface-container-low to-background">
        <main className="max-w-screen-xl mx-auto px-margin-mobile md:px-xl py-lg space-y-xl">
          <section className="text-center space-y-xl py-12 md:py-24 flex flex-col items-center justify-center reveal active">
            <div className="space-y-sm max-w-4xl">
              <p className="font-label-caps text-on-surface-variant tracking-wider uppercase mb-4">Built for Ethiopian youth</p>
              <h1 className="font-h1 text-5xl md:text-6xl lg:text-7xl font-bold text-on-surface leading-tight tracking-tight">You’re not alone. <br className="hidden md:block"/>Get guidance you can trust.</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-6">Get private, judgment-free support for your reproductive health and well-being.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-md mt-8">
              <Link to="/login" className="bg-primary text-on-primary font-button px-8 py-4 rounded-full hover:bg-surface-tint transition-colors shadow-sm text-lg">Start Safely</Link>
              <button className="bg-surface border border-outline text-primary font-button px-8 py-4 rounded-full hover:bg-surface-container transition-colors text-lg">Explore Topics</button>
            </div>
          </section>
        </main>
      </div>

      <main className="max-w-screen-xl mx-auto px-margin-mobile md:px-xl py-lg space-y-24">
        {/* 2. Trust Strip */}
        <section className="bg-surface-container-low rounded-3xl p-lg reveal">
          <div className="flex flex-col md:flex-row justify-around items-center gap-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <h3 className="font-button text-on-surface">Anonymous &amp; Private</h3>
            </div>
            <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <h3 className="font-button text-on-surface">No names. No judgment.</h3>
            </div>
            <div className="hidden md:block w-px h-12 bg-outline-variant"></div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <h3 className="font-button text-on-surface">Built with health professionals</h3>
            </div>
          </div>
        </section>

        {/* 3. Trusted By */}
        <section className="text-center space-y-md py-md reveal">
          <p className="font-label-caps text-on-surface-variant uppercase tracking-wider">Aligned with trusted youth and health initiatives</p>
          <div className="flex flex-wrap justify-center items-center gap-xl md:gap-24 opacity-50">
            <div className="font-h2 text-xl font-semibold text-on-surface">UNFPA Ethiopia</div>
            <div className="font-h2 text-xl font-semibold text-on-surface">Ministry of Health Ethiopia</div>
          </div>
        </section>

        {/* 4. Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-md reveal">
          <div className="bg-surface p-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-primary-container text-on-primary-container p-4 rounded-full">
              <span className="material-symbols-outlined text-[32px]">group</span>
            </div>
            <div>
              <div className="text-4xl font-bold text-on-surface mb-1">
                {metrics ? metrics.total_users.toLocaleString() + "+" : "5,000+"}
              </div>
              <div className="font-body-md text-on-surface-variant">Youth supported</div>
            </div>
          </div>
          <div className="bg-surface p-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-tertiary-container text-on-tertiary-container p-4 rounded-full">
              <span className="material-symbols-outlined text-[32px]">forum</span>
            </div>
            <div>
              <div className="text-4xl font-bold text-on-surface mb-1">
                {metrics ? metrics.total_questions.toLocaleString() + "+" : "12,000+"}
              </div>
              <div className="font-body-md text-on-surface-variant">Questions answered</div>
            </div>
          </div>
          <div className="bg-surface p-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-secondary-container text-on-secondary-container p-4 rounded-full">
              <span className="material-symbols-outlined text-[32px]">trending_up</span>
            </div>
            <div>
              <div className="text-4xl font-bold text-on-surface mb-1">15,000+</div>
              <div className="font-body-md text-on-surface-variant">Active daily users</div>
            </div>
          </div>
        </section>

        {/* 5. How It Works */}
        <section className="space-y-xl py-md reveal">
          <div className="text-center">
            <h2 className="font-h1 text-4xl text-on-surface font-bold">How it works</h2>
            <p className="font-body-lg text-on-surface-variant mt-4">Three simple steps to get the support you need.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg relative mt-12">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-1 bg-outline-variant -z-10 rounded-full"></div>
            <div className="flex flex-col items-center text-center gap-6 bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md border-4 border-surface">1</div>
              <div className="space-y-2">
                <h3 className="font-h2 text-xl text-on-surface">Choose a Topic</h3>
                <p className="font-body-md text-on-surface-variant">Select what's on your mind right now from our guided topics.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-6 bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md border-4 border-surface">2</div>
              <div className="space-y-2">
                <h3 className="font-h2 text-xl text-on-surface">Get Private Guidance</h3>
                <p className="font-body-md text-on-surface-variant">Receive trustworthy, judgment-free information and answers.</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-6 bg-surface p-8 rounded-2xl border border-outline-variant shadow-sm relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md border-4 border-surface">3</div>
              <div className="space-y-2">
                <h3 className="font-h2 text-xl text-on-surface">Take Action</h3>
                <p className="font-body-md text-on-surface-variant">Find services, resources, or next steps near you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Start with what you're going through */}
        <section className="space-y-lg reveal">
          <div>
            <h2 className="font-h1 text-4xl text-on-surface font-bold">Start with what you’re going through</h2>
            <p className="font-body-lg text-on-surface-variant mt-4">Learn more about your body, relationships, and reproductive health in a safe space.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <button className="bg-surface hover:bg-surface-container-low transition-colors rounded-3xl p-8 flex flex-col items-start gap-6 border border-outline-variant shadow-sm hover:shadow-md duration-200 text-left group">
              <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>body_system</span>
              </div>
              <div className="space-y-2">
                <span className="font-h2 text-2xl text-on-surface group-hover:text-primary transition-colors">Your Body &amp; Changes</span>
                <p className="font-body-md text-on-surface-variant">Understand puberty, periods, and how your body works without embarrassment.</p>
              </div>
            </button>
            <button className="bg-surface hover:bg-surface-container-low transition-colors rounded-3xl p-8 flex flex-col items-start gap-6 border border-outline-variant shadow-sm hover:shadow-md duration-200 text-left group">
              <div className="bg-tertiary-container text-on-tertiary-container p-4 rounded-2xl group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_1</span>
              </div>
              <div className="space-y-2">
                <span className="font-h2 text-2xl text-on-surface group-hover:text-tertiary transition-colors">Safe Relationships</span>
                <p className="font-body-md text-on-surface-variant">Learn about consent, setting boundaries, and building healthy connections.</p>
              </div>
            </button>
            <button className="bg-surface hover:bg-surface-container-low transition-colors rounded-3xl p-8 flex flex-col items-start gap-6 border border-outline-variant shadow-sm hover:shadow-md duration-200 text-left group">
              <div className="bg-secondary-container text-on-secondary-container p-4 rounded-2xl group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
              </div>
              <div className="space-y-2">
                <span className="font-h2 text-2xl text-on-surface group-hover:text-secondary transition-colors">Myths vs. Facts</span>
                <p className="font-body-md text-on-surface-variant">Get accurate, science-backed answers to common questions and dispel rumors.</p>
              </div>
            </button>
          </div>
        </section>

        {/* 7. Events & Workshops */}
        <section className="space-y-lg reveal">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-h1 text-3xl text-on-surface font-bold">Events &amp; Workshops</h2>
              <p className="font-body-md text-on-surface-variant mt-2">Join community sessions online and near you.</p>
            </div>
            <button className="text-primary font-button hover:underline hidden md:block">View all events</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              {
                title: "Youth Health Seminar",
                location: "Addis Ababa Community Center",
                icon: "location_on",
                time: "Oct 15, 2:00 PM"
              },
              {
                title: "Online Q&A Session",
                location: "Virtual (Zoom)",
                icon: "videocam",
                time: "Oct 18, 5:00 PM"
              },
              {
                title: "Wellness Workshop",
                location: "Youth Hub",
                icon: "location_on",
                time: "Oct 22, 10:00 AM"
              }
            ].map((event, i) => (
              <div key={i} className="bg-surface rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="h-40 bg-surface-container flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-4xl">event</span>
                </div>
                <div className="p-6 flex flex-col flex-grow gap-4">
                  <div className="space-y-2 flex-grow">
                    <h3 className="font-h2 text-xl text-on-surface">{event.title}</h3>
                    <div className="flex items-center text-on-surface-variant text-sm gap-2">
                      <span className="material-symbols-outlined text-[18px]">{event.icon}</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-on-surface-variant text-sm gap-2">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <button className="w-full text-center border border-outline text-on-surface font-button py-2 rounded-full hover:bg-surface-container transition-colors">View Details</button>
                </div>
              </div>
            ))}
          </div>
          <button className="text-primary font-button hover:underline md:hidden w-full text-center mt-4">View all events</button>
        </section>

        {/* 8. Watch & Learn */}
        <section className="space-y-lg reveal bg-surface-container-low -mx-margin-mobile md:-mx-xl px-margin-mobile md:px-xl py-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-h1 text-3xl text-on-surface font-bold">Watch &amp; Learn</h2>
              <p className="font-body-md text-on-surface-variant mt-2">Short videos on important topics.</p>
            </div>
            <button className="text-primary font-button hover:underline hidden md:block">More videos</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              {
                title: "What happens during puberty?",
                duration: "3:45"
              },
              {
                title: "Understanding menstrual cycles",
                duration: "5:12"
              },
              {
                title: "How to talk about boundaries",
                duration: "4:20"
              }
            ].map((video, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative bg-surface-variant rounded-2xl overflow-hidden aspect-video flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">smart_display</span>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="bg-surface/90 rounded-full p-3 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded font-medium">{video.duration}</div>
                </div>
                <h3 className="font-h2 text-lg text-on-surface group-hover:text-primary transition-colors">{video.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Learn Something New */}
        <section className="space-y-lg reveal">
          <div>
            <h2 className="font-h1 text-3xl text-on-surface font-bold">Learn Something New</h2>
            <p className="font-body-md text-on-surface-variant mt-2">Quick reads on essential health and relationship topics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {[
              {
                title: "Understanding consent",
                desc: "Learn what consent means and how to practice it.",
                icon: "handshake",
                color: "primary",
                containerColor: "primary-container",
                onContainerColor: "on-primary-container"
              },
              {
                title: "Mental health basics",
                desc: "Tips for managing stress and taking care of your mind.",
                icon: "healing",
                color: "tertiary",
                containerColor: "tertiary-container",
                onContainerColor: "on-tertiary-container"
              },
              {
                title: "Navigating family talks",
                desc: "How to discuss sensitive topics with your parents.",
                icon: "family_restroom",
                color: "secondary",
                containerColor: "secondary-container",
                onContainerColor: "on-secondary-container"
              }
            ].map((item, i) => (
              <a key={i} className="bg-surface p-6 rounded-2xl border border-outline-variant flex items-start gap-4 hover:shadow-md transition-all hover:-translate-y-1 group" href="#">
                <div className={`p-3 bg-${item.containerColor} text-${item.onContainerColor} rounded-xl group-hover:bg-${item.color} group-hover:text-on-${item.color} transition-colors shrink-0`}>
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className={`font-h2 text-lg text-on-surface mb-1 group-hover:text-${item.color} transition-colors`}>{item.title}</h3>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 10. Learning & Help */}
        <section className="space-y-lg reveal">
          <div>
            <h2 className="font-h1 text-3xl text-on-surface font-bold">Resources &amp; Support</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <a className="bg-surface p-8 rounded-3xl border border-outline-variant flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all group h-full" href="#">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-primary-container text-primary rounded-2xl">
                  <span className="material-symbols-outlined text-[40px]">menu_book</span>
                </div>
                <div>
                  <h3 className="font-h2 text-2xl text-on-surface group-hover:text-primary transition-colors">Browse Learning Library</h3>
                  <p className="text-body-md text-on-surface-variant mt-1">Articles, videos, and guides</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:translate-x-2 group-hover:text-primary transition-all">arrow_forward</span>
            </a>
            <a className="bg-surface p-8 rounded-3xl border border-outline-variant flex items-center justify-between hover:shadow-md hover:-translate-y-1 transition-all group h-full" href="#">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-secondary-container text-secondary rounded-2xl">
                  <span className="material-symbols-outlined text-[40px]">medical_services</span>
                </div>
                <div>
                  <h3 className="font-h2 text-2xl text-on-surface group-hover:text-secondary transition-colors">Find Nearby Services</h3>
                  <p className="text-body-md text-on-surface-variant mt-1">Clinics and help centers</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:translate-x-2 group-hover:text-secondary transition-all">arrow_forward</span>
            </a>
          </div>
        </section>

        {/* 11. Testimonials */}
        <section className="space-y-lg bg-surface-container-low rounded-[40px] p-xl md:p-24 reveal overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          </div>
          <h2 className="font-h1 text-4xl text-on-surface font-bold text-center mb-12">What others say</h2>
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x no-scrollbar">
            <div className="min-w-[300px] md:min-w-[400px] bg-surface rounded-3xl p-8 shadow-sm flex flex-col gap-4 snap-center relative">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-body-lg text-on-surface italic flex-grow">"I was so scared when I missed my period. Nuru helped me understand my options without making me feel judged."</p>
              <div className="font-label-caps text-on-surface-variant mt-4">- Anonymous, 19</div>
            </div>
            <div className="min-w-[300px] md:min-w-[400px] bg-surface rounded-3xl p-8 shadow-sm flex flex-col gap-4 snap-center relative">
              <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-body-lg text-on-surface italic flex-grow">"The relationship advice helped me set better boundaries. I feel much safer now."</p>
              <div className="font-label-caps text-on-surface-variant mt-4">- Anonymous, 22</div>
            </div>
            <div className="min-w-[300px] md:min-w-[400px] bg-surface rounded-3xl p-8 shadow-sm flex flex-col gap-4 snap-center relative">
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-body-lg text-on-surface italic flex-grow">"Finally a place where I can get real answers to the questions I'm too embarrassed to ask anyone else."</p>
              <div className="font-label-caps text-on-surface-variant mt-4">- Anonymous, 17</div>
            </div>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="text-center space-y-6 py-24 flex flex-col items-center reveal">
          <h2 className="font-h1 text-4xl md:text-5xl font-bold text-on-surface">Start your journey safely today</h2>
          <p className="font-body-lg text-on-surface-variant font-medium">Private. Safe. Always.</p>
          <Link to="/login" className="bg-primary text-on-primary font-button px-10 py-4 rounded-full hover:bg-surface-tint transition-all shadow-md hover:shadow-lg mt-8 text-lg hover:-translate-y-1">Start Safely</Link>
        </section>
      </main>

      {/* Floating Chat Action Button */}
      <button className="fixed bottom-24 right-margin-mobile md:bottom-10 md:right-xl bg-primary text-on-primary p-4 rounded-2xl shadow-[0_4px_14px_rgba(0,88,190,0.39)] hover:bg-surface-tint transition-all hover:scale-105 z-40 flex items-center justify-center active:scale-95 duration-200">
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
      </button>

      {/* BottomNavBar */}
      <nav className="bg-surface-container-lowest font-plus-jakarta-sans text-[11px] font-medium fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden rounded-t-[24px] border-t border-outline-variant">
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-2xl px-4 py-1">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-label-caps text-label-caps">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>explore</span>
          <span className="font-label-caps text-label-caps">Explore</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>chat</span>
          <span className="font-label-caps text-label-caps">Chat</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>medical_services</span>
          <span className="font-label-caps text-label-caps">Services</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
          <span className="font-label-caps text-label-caps">Profile</span>
        </button>
      </nav>
    </div>
  )
}
