import { useNavigate } from "react-router-dom"

const CATEGORIES = [
  {
    id: "relationships",
    title: "Healthy Relationships",
    desc: "Understanding boundaries, communication, and mutual respect.",
    icon: "favorite",
    color: "primary",
    modules: 5,
    featured: true,
  },
  {
    id: "body",
    title: "My Body & Health",
    desc: "Essential knowledge about physical well-being and personal care.",
    icon: "health_and_safety",
    color: "secondary",
    progress: 45,
  },
  {
    id: "myths",
    title: "Myths vs. Facts",
    desc: "Busting common misconceptions with reliable, medically-backed facts.",
    icon: "psychology_alt",
    color: "tertiary",
  },
  {
    id: "goals",
    title: "Life Goals & Planning",
    desc: "Tools and strategies for setting and achieving your personal ambitions.",
    icon: "flag",
    color: "primary",
  },
]

export default function ExplorePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-8 lg:p-12">
      <div className="mb-12">
        <h1 className="mb-2 font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface">
          Explore &amp; Learn
        </h1>
        <p className="text-lg text-on-surface-variant">
          Bite-sized knowledge for a healthier you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Featured Card */}
        <div
          className="group relative col-span-1 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] md:col-span-2"
          onClick={() => navigate("/chat")}
        >
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 transition-transform group-hover:scale-110" />
          <div className="z-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined fill text-2xl text-primary">
                favorite
              </span>
            </div>
            <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface">
              Healthy Relationships
            </h2>
            <p className="mb-6 max-w-md text-on-surface-variant">
              Understanding boundaries, communication, and mutual respect in all
              types of relationships.
            </p>
          </div>
          <div className="z-10 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-surface-variant flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-on-surface-variant">
                5
              </div>
              <span className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                Modules
              </span>
            </div>
            <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </div>
        </div>

        {/* Regular Cards */}
        {CATEGORIES.filter((c) => !c.featured).map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/module/${cat.id}`)}
            className="group flex cursor-pointer flex-col rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
          >
            <div
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full ${cat.color === "secondary" ? "bg-secondary-container" : cat.color === "tertiary" ? "bg-tertiary-container/20" : "bg-primary-container/10"}`}
            >
              <span
                className={`material-symbols-outlined fill text-2xl ${cat.color === "secondary" ? "text-secondary" : cat.color === "tertiary" ? "text-tertiary" : "text-primary"}`}
              >
                {cat.icon}
              </span>
            </div>
            <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface">
              {cat.title}
            </h3>
            <p className="mb-6 flex-grow text-on-surface-variant">{cat.desc}</p>
            {cat.progress ? (
              <>
                <div className="bg-surface-variant mb-2 h-1.5 w-full rounded-full">
                  <div
                    className="h-1.5 rounded-full bg-secondary"
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {cat.progress}% Completed
                </span>
              </>
            ) : (
              <div
                className={`flex items-center font-semibold transition-transform group-hover:translate-x-1 ${cat.color === "tertiary" ? "text-tertiary" : "text-primary"}`}
              >
                Start Learning{" "}
                <span className="material-symbols-outlined ml-1 text-sm">
                  arrow_forward
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Quiz Card */}
        <div className="border-surface-variant col-span-1 flex flex-col justify-center rounded-2xl border bg-surface-container p-6 text-center md:col-span-2 lg:col-span-1">
          <span className="material-symbols-outlined mb-4 text-4xl text-on-surface-variant">
            quiz
          </span>
          <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-lg font-semibold text-on-surface">
            Test Your Knowledge
          </h3>
          <p className="mb-4 text-sm text-on-surface-variant">
            Take a quick quiz to see what you've learned today.
          </p>
          <button 
            onClick={() => navigate("/quiz")}
            className="mx-auto rounded-full border border-outline-variant/30 bg-white px-4 py-2 font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  )
}
