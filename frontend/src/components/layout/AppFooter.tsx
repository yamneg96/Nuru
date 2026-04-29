import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

export function AppFooter() {
  const location = useLocation()
  const isLanding = location.pathname === "/"
  const { t } = useTranslation()

  return (
    <footer className="bg-inverse-surface px-8 py-16 text-inverse-on-surface">
      <div className="mx-auto flex w-full flex-col items-center justify-between md:flex-row">
        <div className="flex items-center justify-center-safe mb-4 lg:mb-0">
          <Link
            to={isLanding ? "/" : "/dashboard"}
            className="text-xl font-bold text-blue-600 dark:text-blue-400 mr-2 flex items-center gap-2"
          >
            <img
              src="/Nuru_Logo.png"
              alt="Nuru Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold text-inverse-primary">{t("nuru")}</span>
          </Link>
        </div>
        <div className="flex gap-8">
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
        <div className="text-sm opacity-70 mt-8 md:mt-0">
          {t("common.copyright", "© 2024 Nuru. Trusted companion for Ethiopian youth.")}
        </div>
      </div>
    </footer>
  )
}
