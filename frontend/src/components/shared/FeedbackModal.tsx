import { useState } from "react"
import { submitFeedback, type SubmitFeedbackPayload } from "@/api/feedback.api"
import { useMutation } from "@tanstack/react-query"
import { NuruButton } from "@/components/shared/buttons/NuruButton"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  context: SubmitFeedbackPayload["context"]
  contextId?: string
}

export function FeedbackModal({ isOpen, onClose, context, contextId }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState("")
  const [age, setAge] = useState<number | "">("")

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      setRating(5)
      setComment("")
      setAge("")
      onClose()
      alert("Thank you for your feedback!")
    },
    onError: () => {
      alert("Failed to submit feedback. Please try again.")
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-auto">
      <div className="bg-surface w-auto rounded-3xl p-6 shadow-xl border border-outline-variant animate-in fade-in zoom-in-95 duration-200 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="font-h2 text-2xl text-on-surface mb-2">Leave Feedback</h2>
        <p className="font-body-sm text-on-surface-variant mb-6">Your feedback helps us improve Nuru for everyone.</p>

        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-2">How would you rate this?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${rating >= star ? 'text-primary' : 'text-outline-variant'}`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-2">Your Thoughts</label>
            <textarea
              className="w-full bg-surface-container rounded-xl p-3 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none min-h-[100px]"
              placeholder="Tell us what you think..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-md text-on-surface mb-2">Your Age (Optional)</label>
            <input
              type="number"
              className="w-full bg-surface-container rounded-xl p-3 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 19"
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
              min={10}
              max={100}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <NuruButton size="sm" variant="secondary" onClick={onClose} type="button">Cancel</NuruButton>
            <NuruButton
              size="sm"
              variant="primary"
              onClick={() => mutation.mutate({
                context,
                context_id: contextId,
                rating,
                comment,
                user_age: age === "" ? undefined : age,
                anonymous_id: localStorage.getItem("nuru_anonymous_id") || undefined
              })}
              disabled={mutation.isPending || !comment.trim()}
            >
              {mutation.isPending ? "Submitting..." : "Submit Feedback"}
            </NuruButton>
          </div>
        </div>
      </div>
    </div>
  )
}
