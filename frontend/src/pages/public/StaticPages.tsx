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
    <div className="flex min-h-screen flex-col bg-background p-4 pt-10 pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="rounded-full bg-surface p-2 text-foreground/80 hover:bg-surface-hover">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
      </div>
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Reach out to the Nuru Team</h2>
        <p className="mb-6 text-foreground/80">If you have questions, feedback, or need direct support, please reach out to us on our secure channels.</p>
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-surface-hover transition-colors">
            <div className="h-10 w-10 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center text-xl">W</div>
            <div>
              <p className="font-medium text-foreground">WhatsApp</p>
              <p className="text-sm text-foreground/60">Chat securely with our support team</p>
            </div>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-surface-hover transition-colors">
            <div className="h-10 w-10 bg-[#0088cc]/20 text-[#0088cc] rounded-full flex items-center justify-center text-xl">T</div>
            <div>
              <p className="font-medium text-foreground">Telegram</p>
              <p className="text-sm text-foreground/60">Join our community channel</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
