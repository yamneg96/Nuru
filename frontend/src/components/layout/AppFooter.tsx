import { Link } from "react-router-dom"

export function AppFooter() {
  return (
    <footer className="bg-inverse-surface px-8 py-16 text-inverse-on-surface">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center justify-between gap-10 md:flex-row">
        <div className="text-2xl font-bold text-inverse-primary">Nuru</div>
        <div className="flex gap-8">
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/contact"
          >
            Contact
          </Link>
        </div>
        <div className="text-sm opacity-70">
          © 2024 Nuru. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
