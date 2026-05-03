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

