import { useState } from "react";

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-surface-dim/60 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_-10px_rgba(59,130,246,0.08),0_4px_12px_-4px_rgba(59,130,246,0.04)] border border-outline-variant/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-outline-variant/50 shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined text-3xl fill">shield_lock</span>
          </div>
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              Privacy &amp; Security
            </h2>
            <p className="text-base text-on-surface-variant mt-1">
              A transparent look at how we protect you.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-8">
          {/* How it works */}
          <section>
            <h3 className="font-semibold text-on-surface mb-4">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-surface rounded-lg border border-outline-variant/40">
                <span className="material-symbols-outlined text-primary mt-0.5 fill">account_circle</span>
                <p className="font-semibold text-on-surface">We verify users using Google</p>
              </div>
              <div className="flex items-start gap-4 p-4 bg-surface rounded-lg border border-outline-variant/40">
                <span className="material-symbols-outlined text-primary mt-0.5 fill">fingerprint</span>
                <p className="font-semibold text-on-surface">We convert your account into an anonymous ID</p>
              </div>
            </div>
          </section>

          {/* Storage Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary fill">check_circle</span>
                <h4 className="font-semibold text-on-surface">What we store</h4>
              </div>
              <ul className="flex flex-col gap-2">
                {["Anonymous ID", "Usage activity (no identity)"].map((item) => (
                  <li key={item} className="flex items-start gap-2 bg-surface-container-lowest p-2 rounded-lg">
                    <span className="material-symbols-outlined text-secondary text-[20px]">check</span>
                    <span className="text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-outline fill">cancel</span>
                <h4 className="font-semibold text-on-surface">What we DON'T store</h4>
              </div>
              <ul className="flex flex-col gap-2">
                {["Name", "Email (raw)", "Contacts"].map((item) => (
                  <li key={item} className="flex items-start gap-2 bg-surface-container-lowest p-2 rounded-lg">
                    <span className="material-symbols-outlined text-outline text-[20px]">close</span>
                    <span className="text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-primary text-on-primary font-semibold px-8 py-3 rounded-full hover:bg-on-primary-fixed-variant active:bg-primary-fixed transition-colors flex items-center justify-center gap-2 min-w-[160px]"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}

/** Hook to manage first-visit privacy modal */
export function usePrivacyModal() {
  const [isOpen, setIsOpen] = useState(() => {
    return !localStorage.getItem("nuru_privacy_accepted");
  });

  const accept = () => {
    localStorage.setItem("nuru_privacy_accepted", "true");
    setIsOpen(false);
  };

  return { isOpen, accept };
}
