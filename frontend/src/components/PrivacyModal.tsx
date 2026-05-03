import { useState } from "react"

interface PrivacyModalProps {
  open: boolean
  onClose: () => void
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/60 p-5 backdrop-blur-md">
      <div className="flex max-h-[90vh] w-full flex-col rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_10px_40px_-10px_rgba(59,130,246,0.08),0_4px_12px_-4px_rgba(59,130,246,0.04)]">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-4 border-b border-outline-variant/50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined fill text-3xl">
              shield_lock
            </span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              Privacy &amp; Security
            </h2>
            <p className="mt-1 text-base text-on-surface-variant">
              A transparent look at how we protect you.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 overflow-y-auto p-6">
          {/* How it works */}
          <section>
            <h3 className="mb-4 font-semibold text-on-surface">How it works</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-lg border border-outline-variant/40 bg-surface p-4">
                <span className="material-symbols-outlined fill mt-0.5 text-primary">
                  account_circle
                </span>
                <p className="font-semibold text-on-surface">
                  We verify users using Google
                </p>
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-outline-variant/40 bg-surface p-4">
                <span className="material-symbols-outlined fill mt-0.5 text-primary">
                  fingerprint
                </span>
                <p className="font-semibold text-on-surface">
                  We convert your account into an anonymous ID
                </p>
              </div>
            </div>
          </section>

          {/* Storage Info */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined fill text-secondary">
                  check_circle
                </span>
                <h4 className="font-semibold text-on-surface">What we store</h4>
              </div>
              <ul className="flex flex-col gap-2">
                {["Anonymous ID", "Usage activity (no identity)"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg bg-surface-container-lowest p-2"
                    >
                      <span className="material-symbols-outlined text-[20px] text-secondary">
                        check
                      </span>
                      <span className="text-on-surface-variant">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined fill text-outline">
                  cancel
                </span>
                <h4 className="font-semibold text-on-surface">
                  What we DON'T store
                </h4>
              </div>
              <ul className="flex flex-col gap-2">
                {["Name", "Email (raw)", "Contacts"].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-lg bg-surface-container-lowest p-2"
                  >
                    <span className="material-symbols-outlined text-[20px] text-outline">
                      close
                    </span>
                    <span className="text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-outline-variant/50 p-6">
          <button
            onClick={onClose}
            className="flex min-w-[160px] items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-on-primary transition-colors hover:bg-on-primary-fixed-variant active:bg-primary-fixed"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  )
}

/** Hook to manage first-visit privacy modal */
export function usePrivacyModal() {
  const [isOpen, setIsOpen] = useState(() => {
    return !localStorage.getItem("nuru_privacy_accepted")
  })

  const accept = () => {
    localStorage.setItem("nuru_privacy_accepted", "true")
    setIsOpen(false)
  }

  return { isOpen, accept }
}
