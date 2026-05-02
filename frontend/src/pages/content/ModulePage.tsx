import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function ModulePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Placeholder static content since we don't have a CMS yet
  const title = id ? id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Module"

  return (
    <div className="flex min-h-screen flex-col bg-background p-4 pt-10 pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full bg-surface p-2 text-foreground/80 hover:bg-surface-hover"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Explore</h1>
      </div>

      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-sm">
        <div className="h-48 w-full bg-primary/20 flex items-center justify-center">
           <span className="text-5xl">📚</span>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{title}</h2>
          <div className="prose prose-sm md:prose-base dark:prose-invert">
            <p className="lead text-foreground/80 text-lg">
              Welcome to the learning module for {title}. Here you'll find comprehensive, evidence-based information.
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Introduction</h3>
            <p className="text-foreground/70 mb-4">
              This is placeholder content. In a fully implemented system, this would fetch rich markdown or structured data from a CMS or the backend based on the module ID <code>{id}</code>.
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Key Takeaways</h3>
            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
              <li>Always seek information from reliable, evidence-based sources.</li>
              <li>Your health and well-being are a priority.</li>
              <li>Nuru AI is here to help guide you to the right resources.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
