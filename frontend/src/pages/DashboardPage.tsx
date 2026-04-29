import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const QUICK_ACTIONS = [
  {
    labelKey: "action_pressure",
    icon: "favorite",
    bgIcon: "bg-primary-container text-on-primary-container",
    hoverBg: "group-hover:bg-primary group-hover:text-on-primary",
    flow: "relationship_pressure",
  },
  {
    labelKey: "action_period",
    icon: "calendar_month",
    bgIcon: "bg-error-container text-on-error-container",
    hoverBg: "group-hover:bg-error group-hover:text-on-error",
    flow: "missed_period",
  },
  {
    labelKey: "action_pregnancy",
    icon: "shield",
    bgIcon: "bg-secondary-container text-on-secondary-container",
    hoverBg: "group-hover:bg-secondary group-hover:text-on-secondary",
    flow: "contraception",
  },
  {
    labelKey: "action_advice",
    icon: "psychology",
    bgIcon: "bg-tertiary-container text-on-tertiary-container",
    hoverBg: "group-hover:bg-tertiary group-hover:text-on-tertiary",
    flow: "general_advice",
  },
]

const LEARNING_CARDS = [
  {
    titleKey: "consent_title",
    descKey: "consent_desc",
    badge: "3 min read",
    cta: "Read Article",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKQom5agMxZQ64nGVYf2gmGmCnx7gsN4MsOYtBXgsWMNpWpwda_oowe-R3v52vQwVdQXygwKXIgZl_7je17xnVF71AOlX3m5Fivjlc5BcCbayJ7_58cNluUr8v1LRIOvG0KuNmTHRvLqu4VC7zUjurRQ_lZGth_v8CVee35Jh1LuSzH1Zm8Adj8G0bqgsWKryHWZs653sVshVcdGVf-9I7SOD6qvgkEbdMctMrj6_Fwmppzdsmub5dwnMA0i5bCqzCFN_TA24psJg",
  },
  {
    titleKey: "contraception_title",
    descKey: "contraception_desc",
    badge: "5 min video",
    cta: "Watch Video",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuapl6NYY098BfL6Tgq2iAPHaZP46tsnHnimzqr0A8feyXJBFV-f9wtDPAgoEjjyPg4dd60uzCRKTMneGzEuO5WJfgji1lRnciWOlQ3H458K85czAv2uiLsb8bLFbIJ1oWSOo1Mjg7f6qN_cR_HJf75y7jUmDaDo5eX9z5FZ9bkazia6PRnz14y5byveO4Qix8KiOgZWU71Jb1myk7MyTZMlaoDp1BoyzRAY8pI5TLEuKqxnZe57Pz2zu3QkRM1rxsRua5UkQyp-A",
  },
  {
    titleKey: "selfcare_title",
    descKey: "selfcare_desc",
    badge: "Interactive",
    cta: "Start Check-in",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYFRCjtB2LqsJyf0O1-oVLuPZLXySe_JzmQlhNHQ-u1tXi91akTMbOHdNhtxrdBnzlXlHEgf3fW8tI8LDWQ3L35QJkSiANlp78sgTyiF-E4fpoemPwP522xE0c3U-DFjkrSDsrrgsn5Zt3KODU3pYbSTpqBh0jM08QXASLunOV63juE9tfv18iycUGroWIzPvJPztOoLaRTZ6lKW5meW1BK1BEVaEfzSCOL62Uwuq-5Au_ZgL4NpZggfCx9EMmdhifvbOTzEfzHeo",
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleQuickAction = (flow: string) => {
    if (flow === "general_advice") {
      navigate("/chat")
    } else {
      navigate(`/decision?flow=${flow}`)
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 px-5 py-6 md:px-8">
      {/* Greeting */}
      <section className="space-y-2">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">
          {t("dashboard.greeting")}
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-on-surface-variant">
          {t("dashboard.greeting_sub")}
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.flow}
            onClick={() => handleQuickAction(action.flow)}
            className="group flex flex-col items-start gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-6 text-left shadow-sm transition-colors duration-200 hover:bg-surface-container active:scale-95"
          >
            <div
              className={`${action.bgIcon} rounded-full p-3 ${action.hoverBg} transition-colors`}
            >
              <span className="material-symbols-outlined fill text-[32px]">
                {action.icon}
              </span>
            </div>
            <span className="font-semibold text-on-surface">
              {t(`dashboard.${action.labelKey}`)}
            </span>
          </button>
        ))}
      </section>

      {/* Recommended Learning */}
      <section className="space-y-4">
        <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
          {t("dashboard.recommended")}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {LEARNING_CARDS.map((card) => (
            <div
              key={card.titleKey}
              className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
            >
              <div className="relative h-40 bg-surface-container-highest">
                <img
                  alt={t(`dashboard.${card.titleKey}`)}
                  className="h-full w-full object-cover"
                  src={card.img}
                />
                <div className="absolute top-2 right-2 rounded-full bg-surface/80 px-2 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                  {card.badge}
                </div>
              </div>
              <div className="flex flex-grow flex-col gap-2 p-6">
                <h3 className="font-semibold text-on-surface">{t(`dashboard.${card.titleKey}`)}</h3>
                <p className="line-clamp-2 flex-grow text-on-surface-variant">
                  {t(`dashboard.${card.descKey}`)}
                </p>
                <button
                  onClick={() => navigate("/explore")}
                  className="mt-2 self-start font-semibold text-primary hover:underline"
                >
                  {card.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className="hover:bg-surface-tint fixed right-5 bottom-24 z-40 flex items-center justify-center rounded-2xl bg-primary p-4 text-on-primary shadow-[0_4px_14px_rgba(0,88,190,0.39)] transition-colors duration-200 active:scale-95 md:right-8 md:bottom-10"
      >
        <span className="material-symbols-outlined fill text-[28px]">chat</span>
      </button>
    </div>
  )
}
