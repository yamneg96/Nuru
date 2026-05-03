import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

export function AppFooter() {
  const location = useLocation()
  const isLanding = location.pathname === "/"
  const { t } = useTranslation()

  return (
    <footer className="bg-inverse-surface px-4 py-12 text-inverse-on-surface sm:px-6 md:py-16">
      <div className="mx-auto flex w-full flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex w-full items-center justify-center md:w-auto md:justify-start">
          <Link
            to={isLanding ? "/" : "/dashboard"}
            className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            <img
              src="/Nuru_Logo.png"
              alt="Nuru Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold text-inverse-primary">
              {t("nuru")}
            </span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 md:w-auto md:justify-center">
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/privacy"
          >
            {t("common.privacy_policy", "Privacy Policy")}
          </Link>
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/terms"
          >
            {t("common.terms", "Terms of Service")}
          </Link>
          <Link
            className="transition-colors hover:text-inverse-primary"
            to="/contact"
          >
            {t("common.contact", "Contact")}
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm opacity-70 md:text-right md:mt-2">
          {t(
            "common.copyright",
            "© 2024 Nuru. Trusted companion for Ethiopian youth."
          )}
        </div>
      </div>
    </footer>
  )
}