import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function PrivacyPolicyPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-background p-4 pt-10 pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="rounded-full bg-surface p-2 text-foreground/80 hover:bg-surface-hover">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      </div>
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-sm prose prose-sm dark:prose-invert">
        <h2>Your Privacy Matters</h2>
        <p>At Nuru, we take your privacy and safety extremely seriously. This platform is designed to be anonymous.</p>
        <h3>Data Collection</h3>
        <p>We do not collect personal identifiers like your real name, email, or phone number unless explicitly provided for specific services.</p>
        <h3>Data Usage</h3>
        <p>Your chat history and risk assessments are stored securely solely to provide you with a continuous experience on your device.</p>
      </div>
    </div>
  )
}

export function TermsPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-background p-4 pt-10 pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="rounded-full bg-surface p-2 text-foreground/80 hover:bg-surface-hover">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
      </div>
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-sm prose prose-sm dark:prose-invert">
        <h2>Terms of Use</h2>
        <p>By using the Nuru platform, you agree to these terms.</p>
        <h3>Not Medical Advice</h3>
        <p>The information and AI chat provided by Nuru do not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
      </div>
    </div>
  )
}

export function ContactPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3 shadow-sm dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="mr-2 rounded-full p-2 hover:bg-surface-hover">
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-blue-600">
            Contact & Support
          </h1>
        </div>
      </div>

      <main className="w-full max-w-[1440px] mx-auto pb-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-surface-container-high to-surface-container-low px-5 md:px-8 py-12 md:py-20 overflow-hidden mb-12 rounded-b-[2rem] md:rounded-bl-[3rem] md:rounded-br-[0]">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface mb-6 border border-outline-variant">
              <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
              <span className="font-['Inter'] text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Safe &amp; Confidential</span>
            </div>
            
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-[30px] leading-[38px] font-bold text-primary-fixed-dim mb-4">
              Get Help Safely with Nuru
            </h1>
            <p className="font-['Inter'] text-lg text-on-surface-variant max-w-2xl mb-8">
              Talk, learn, and connect through safe and trusted channels. We're here to support you without judgment.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-on-primary font-['Inter'] font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-surface-tint transition-all active:scale-[0.98] shadow-sm">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                Chat Now
              </button>
              <button className="bg-surface text-primary font-['Inter'] font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-surface-container transition-all active:scale-[0.98] border border-outline-variant">
                <span className="material-symbols-outlined">call</span>
                Call Hotline
              </button>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="hidden lg:block absolute right-12 bottom-0 w-[400px] h-[300px] pointer-events-none">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary-fixed rounded-t-full rounded-bl-full flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm">
              <span className="material-symbols-outlined text-9xl text-primary opacity-20">forum</span>
            </div>
            <div className="absolute right-48 bottom-12 w-32 h-32 bg-secondary-fixed rounded-t-full rounded-br-full flex items-center justify-center shadow-lg border border-white/50 backdrop-blur-sm z-10">
              <span className="material-symbols-outlined text-6xl text-secondary opacity-40">favorite</span>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <div className="px-5 md:px-8 space-y-16">
          {/* Instant Help */}
          <section>
            <div className="mb-8">
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg">bolt</span>
                Instant Help
              </h2>
              <p className="font-['Inter'] text-base text-on-surface-variant mt-2">Automated, secure, and private assistance available 24/7.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telegram Bot */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-[0_10px_40px_-10px_rgba(0,88,190,0.08)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0088cc]/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-[#0088cc]/10 text-[#0088cc] rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.896-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface mb-2">Telegram Bot</h3>
                  <p className="font-['Inter'] text-base text-on-surface-variant mb-8 flex-grow">Chat anonymously with our smart assistant. Get quick answers on reproductive health, local clinics, and more.</p>
                  <div className="flex flex-wrap items-center justify-between mt-auto gap-2">
                    <span className="font-['Inter'] text-xs font-semibold uppercase text-on-surface-variant bg-surface-container px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> 24/7 Available
                    </span>
                    <button className="bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 font-['Inter'] font-semibold px-6 py-3 rounded-full transition-colors">Start Chat</button>
                  </div>
                </div>
              </div>
              
              {/* WhatsApp Bot */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant shadow-[0_10px_40px_-10px_rgba(0,88,190,0.08)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface mb-2">WhatsApp Bot</h3>
                  <p className="font-['Inter'] text-base text-on-surface-variant mb-8 flex-grow">Connect securely on WhatsApp. Our bot uses end-to-end encryption to ensure your queries remain private.</p>
                  <div className="flex flex-wrap items-center justify-between mt-auto gap-2">
                    <span className="font-['Inter'] text-xs font-semibold uppercase text-on-surface-variant bg-surface-container px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span> 24/7 Available
                    </span>
                    <button className="bg-[#25D366]/10 text-[#00714d] hover:bg-[#25D366]/20 font-['Inter'] font-semibold px-6 py-3 rounded-full transition-colors">Start Chat</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Medical Professionals */}
          <section>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary bg-tertiary-container/20 p-2 rounded-lg">stethoscope</span>
                  Verified Professionals
                </h2>
                <p className="font-['Inter'] text-base text-on-surface-variant mt-2">Connect directly with vetted local healthcare providers.</p>
              </div>
              <a className="font-['Inter'] font-semibold text-primary hover:text-surface-tint flex items-center gap-1" href="#">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Doctor 1 */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant hover:border-primary-fixed-dim transition-colors flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface-container relative">
                  <img alt="Doctor Samira Ahmed" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwNRjC5WA58hJsST6XFczxDwgzf2Qy9s2V9vuw6VvfKSmj_sAUPcHhPlXubdRip9SCDMCGLdBKMFnzMGskXh--h_rRxT7cvjroGR_1-ffSjQxVr0zT_HqiMdpJyUNQsLfGlGav3qRCy5LIsNfkaRBVTUrdXV8UNQav0-Yw_IQhN8PuglPQYFfyvKheXnrO7P6JQthM-vG0fYjj64f4PzvBUbuKVQ1HJcdy9H4t4hkmkiipYqBgLf_5DP_Kg1lpyYoxT79Y-pRB-eg"/>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary-fixed rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-on-secondary-fixed font-bold">check</span>
                  </div>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-on-surface">Dr. Samira Ahmed</h3>
                <p className="font-['Inter'] text-base text-primary mb-3">SRH Specialist</p>
                <p className="font-['Inter'] text-sm text-on-surface-variant mb-6 line-clamp-2">Providing confidential reproductive health counseling and guidance for youth.</p>
                <button className="w-full bg-surface-container text-on-surface font-['Inter'] font-semibold py-3 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 mt-auto">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Book Session
                </button>
              </div>
              
              {/* Doctor 2 */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant hover:border-primary-fixed-dim transition-colors flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface-container relative">
                  <img alt="Dawit Tadesse" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXM_tDAb9qWKleX400yPI8vmIy5MgEcPvjel7oDNf5zjkg97rfyxMxOTq4B2qJsJkrMKyM6GIUbGGPYE95PrBiApUfL05kG19QWpJhO2U36NSQPnZf_eYo7D_Frm4193WDn8YH7C975yD1tF8__-uAtxWNPWoF4oBZjPpC1fX-2NOmVQm4bIFx9awtmrJTdACJhJXYBFVjrBXvPTAK7rx0Ey-EQwd8T1z49_elvs40VBrCvY0Af37ozGEuCYyRdUNViadK5vmakBw"/>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary-fixed rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-on-secondary-fixed font-bold">check</span>
                  </div>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-on-surface">Dawit Tadesse</h3>
                <p className="font-['Inter'] text-base text-tertiary mb-3">Mental Health Counselor</p>
                <p className="font-['Inter'] text-sm text-on-surface-variant mb-6 line-clamp-2">Specializing in anxiety, depression, and stress management for adolescents.</p>
                <button className="w-full bg-surface-container text-on-surface font-['Inter'] font-semibold py-3 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 mt-auto">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Book Session
                </button>
              </div>
              
              {/* Doctor 3 */}
              <div className="bg-surface rounded-2xl p-6 border border-outline-variant hover:border-primary-fixed-dim transition-colors flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface-container relative">
                  <img alt="Dr. Bethlehem Alemu" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv32Zn1CeLgEMuuR-yrCMSBIG-_50C6VGGk8KsfinPaWewwp_O8sFuHySPD5VqI4VqUUMQEAIeWbOcuOTWbN-fN5IQ-BBhni4nIi3GNtb8LzCw11DBmAuwFqtcWSlloyNkgjv_jOEQz5op3g4AYoJijaPwVSu10i-wF4mvdf5Y3w0Xn4ZPw4ThZ3BkXOSyCf44xDUB4sMlcXxEaPg8phnCWs8S_0PZtuNf71oS0j9MxrGCopurBi-F5MSObrUJPnIxlkRGt34mw6I"/>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary-fixed rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[12px] text-on-secondary-fixed font-bold">check</span>
                  </div>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-on-surface">Dr. Bethlehem Alemu</h3>
                <p className="font-['Inter'] text-base text-secondary mb-3">General Practitioner</p>
                <p className="font-['Inter'] text-sm text-on-surface-variant mb-6 line-clamp-2">General health consultations, wellness checks, and referrals to specialists.</p>
                <button className="w-full bg-surface-container text-on-surface font-['Inter'] font-semibold py-3 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 mt-auto">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Book Session
                </button>
              </div>
            </div>
          </section>

          {/* Talk to Someone */}
          <section>
            <div className="mb-8">
              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">support_agent</span>
                Human Support
              </h2>
              <p className="font-['Inter'] text-base text-on-surface-variant mt-2">Sometimes you just need to talk to a real person.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Nuru Support Team */}
              <div className="lg:col-span-2 bg-gradient-to-r from-primary-fixed to-surface-container rounded-3xl p-8 border border-outline-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_10px_40px_-10px_rgba(0,88,190,0.08)]">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-['Inter'] text-xs font-semibold uppercase tracking-widest text-on-primary-fixed">Live Now</span>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-on-primary-fixed mb-2">Nuru Support Team</h3>
                  <p className="font-['Inter'] text-base text-on-surface-variant mb-6">Our trained support staff are online and ready to listen. We provide a safe space to discuss anything that's on your mind.</p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-primary text-on-primary font-['Inter'] font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-surface-tint transition-all">
                      <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                      Call Now (Free)
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-auto flex-shrink-0 flex -space-x-4">
                  <img alt="Support agent 1" className="w-16 h-16 rounded-full border-4 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkmuKb-49gBbJ1H1WtiSy80mu_ZUMTiCYM9bV5azbwpdEVQxWh01vO0Z_OxvTzITcqMi5Px7wvkB5vwxXgC80AH4xZbYLO4_mVdrLuHzwmM0gLT8LuAEV5knXF3jTGgvVvaZVdReX5mTazp1bUVh2XUtQEgCkzUm3brT_DEgobjUv3zB2AtRzlao3lVLrYrdvbU6qFeD1xxREEguwCBCpOUIXTf9RNtS5yAo0LqJ1KpWsynWD8XZRdhSfi39QrAIb_Dw6aDlY1C5c"/>
                  <img alt="Support agent 2" className="w-16 h-16 rounded-full border-4 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqHEgNrG9VLOowIpeWbSQ_RCKxzb2BRKBEjUmJ35wY39nj_mMk23svbSDUfLF_Y4NW-zC5_E01TUcHkLo9P-oObKfNkgU6r98zfIWfnDEiTN1HoBz5bwlReyB9qsETuPkyIZ1US5rw7e8nyGcmOapFg14LNSR6NkHt7J91xGqTVQthtPbnCqYzxO5KKrBuwqVot6NfUD-9iQeYsVo3xaeGLgxvQ8dVWOPz2OyMOZI3Ej3Xhtwfq7J5Dmk335YKp9xflFMtoklmqzE"/>
                  <img alt="Support agent 3" className="w-16 h-16 rounded-full border-4 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0ROZNrGFbydBuE1nu1XFq45mjNQQyelKpNWOGtdbVMv3A1g8qqKrbGdlCd_anDI6Ql_rOfAmOHgunf3BWQLqX1Xr9jZma5Io2RZfJmFev6k3wzIwVy7p0Dx_uwEvvPl2RTU0wnBkjrjkURbzFS2DMUReZFy3izdb-HpL4DYyzTQqTWrlDWT8QnvxZO9dAMbaWYjHpnGF0BY7aWNKhyq2POozWQskh4lGGPzwye_-9hXUsnugJoC0fvdzB_bsh-FRowSTHmR5OE_I"/>
                  <div className="w-16 h-16 rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">+5</div>
                </div>
              </div>
              
              {/* Youth Counselors */}
              <div className="bg-surface rounded-3xl p-8 border border-outline-variant flex flex-col justify-center">
                <div className="w-12 h-12 bg-tertiary-container/20 text-tertiary rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined">diversity_3</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface mb-2">Youth Peers</h3>
                <p className="font-['Inter'] text-sm text-on-surface-variant mb-6">Talk to trained peers who understand what you're going through.</p>
                <button className="w-full bg-surface text-primary border border-outline-variant font-['Inter'] font-semibold py-3 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center gap-2 mt-auto">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Request Peer Match
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Safety Notice */}
      <footer className="fixed bottom-0 w-full bg-error-container/90 backdrop-blur-md border-t border-error-container z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-start sm:items-center gap-4">
          <span className="material-symbols-outlined text-error mt-1 sm:mt-0">warning</span>
          <p className="font-['Inter'] text-sm text-on-error-container leading-tight">
            <strong className="font-semibold">Nuru is not an emergency service.</strong> If you are in immediate danger or experiencing a medical emergency, please contact local emergency services immediately (Dial 911 or your local equivalent).
          </p>
        </div>
      </footer>
    </div>
  )
}

