import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  { id: "relationships", title: "Healthy Relationships", desc: "Understanding boundaries, communication, and mutual respect.", icon: "favorite", color: "primary", modules: 5, featured: true },
  { id: "body", title: "My Body & Health", desc: "Essential knowledge about physical well-being and personal care.", icon: "health_and_safety", color: "secondary", progress: 45 },
  { id: "myths", title: "Myths vs. Facts", desc: "Busting common misconceptions with reliable, medically-backed facts.", icon: "psychology_alt", color: "tertiary" },
  { id: "goals", title: "Life Goals & Planning", desc: "Tools and strategies for setting and achieving your personal ambitions.", icon: "flag", color: "primary" },
];

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 w-full">
      <div className="mb-12">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[38px] font-bold text-on-surface mb-2">Explore &amp; Learn</h1>
        <p className="text-lg text-on-surface-variant">Bite-sized knowledge for a healthier you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Card */}
        <div className="col-span-1 md:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer" onClick={() => navigate("/chat")}>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="z-10">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-2xl fill">favorite</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-semibold text-on-surface mb-3">Healthy Relationships</h2>
            <p className="text-on-surface-variant mb-6 max-w-md">Understanding boundaries, communication, and mutual respect in all types of relationships.</p>
          </div>
          <div className="z-10 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-variant border-2 border-white flex items-center justify-center text-xs font-bold text-on-surface-variant">5</div>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Modules</span>
            </div>
            <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Regular Cards */}
        {CATEGORIES.filter(c => !c.featured).map((cat) => (
          <div key={cat.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-[0_4px_20px_rgba(59,130,246,0.05)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] transition-shadow duration-300 flex flex-col cursor-pointer group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${cat.color === "secondary" ? "bg-secondary-container" : cat.color === "tertiary" ? "bg-tertiary-container/20" : "bg-primary-container/10"}`}>
              <span className={`material-symbols-outlined text-2xl fill ${cat.color === "secondary" ? "text-secondary" : cat.color === "tertiary" ? "text-tertiary" : "text-primary"}`}>{cat.icon}</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-on-surface mb-2">{cat.title}</h3>
            <p className="text-on-surface-variant mb-6 flex-grow">{cat.desc}</p>
            {cat.progress ? (
              <>
                <div className="w-full bg-surface-variant rounded-full h-1.5 mb-2"><div className="bg-secondary h-1.5 rounded-full" style={{ width: `${cat.progress}%` }} /></div>
                <span className="text-xs font-semibold text-on-surface-variant">{cat.progress}% Completed</span>
              </>
            ) : (
              <div className={`flex items-center font-semibold group-hover:translate-x-1 transition-transform ${cat.color === "tertiary" ? "text-tertiary" : "text-primary"}`}>
                Start Learning <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
              </div>
            )}
          </div>
        ))}

        {/* Quiz Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-surface-container border border-surface-variant rounded-2xl p-6 flex flex-col justify-center text-center">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-4">quiz</span>
          <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-on-surface mb-2">Test Your Knowledge</h3>
          <p className="text-sm text-on-surface-variant mb-4">Take a quick quiz to see what you've learned today.</p>
          <button className="bg-white border border-outline-variant/30 text-on-surface font-semibold py-2 px-4 rounded-full hover:bg-surface-container-low transition-colors mx-auto">Start Quiz</button>
        </div>
      </div>
    </div>
  );
}
