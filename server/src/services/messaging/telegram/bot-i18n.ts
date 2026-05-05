import { Language } from "../shared/constants.js";

const translations: Record<string, Record<Language, string>> = {
  welcome: {
    EN: "Welcome to Nuru! Please select your language / እባክዎ ቋንቋዎን ይምረጡ / Maaloo afaan keessan filadhaa:",
    AM: "Welcome to Nuru! Please select your language / እባክዎ ቋንቋዎን ይምረጡ / Maaloo afaan keessan filadhaa:",
    OR: "Welcome to Nuru! Please select your language / እባክዎ ቋንቋዎን ይምረጡ / Maaloo afaan keessan filadhaa:",
  },
  menu_title: {
    EN: "How can we help you today?",
    AM: "ዛሬ እንዴት ልንረዳዎ?",
    OR: "Har'a akkamiin si gargaaruu?",
  },
  btn_decision: {
    EN: "🧠 Get Help",
    AM: "🧠 እርዳታ ያግኙ",
    OR: "🧠 Gargaarsa Argadhu",
  },
  btn_professional: {
    EN: "🧑‍⚕️ Find Professional",
    AM: "🧑‍⚕️ ባለሙያ ያግኙ",
    OR: "🧑‍⚕️ Ogeessa Barbaadi",
  },
  btn_support: {
    EN: "💬 Talk to Support",
    AM: "💬 ድጋፍ ያግኙ",
    OR: "💬 Deeggarsa Argadhu",
  },
  btn_settings: {
    EN: "⚙️ Language Settings",
    AM: "⚙️ የቋንቋ ቅንብሮች",
    OR: "⚙️ Qindaa'ina Afaanii",
  },
  lang_saved: {
    EN: "✅ Language set to English.",
    AM: "✅ ቋንቋ ወደ አማርኛ ተቀይሯል።",
    OR: "✅ Afaan gara Afaan Oromootti jijjiirameera.",
  },
  decision_prompt: {
    EN: "What situation are you facing?",
    AM: "ምን ዓይነት ሁኔታ እያጋጠመዎት ነው?",
    OR: "Haala akkamii keessa jirta?",
  },
  btn_back: {
    EN: "⬅️ Back",
    AM: "⬅️ ተመለስ",
    OR: "⬅️ Duuba",
  },
  decision_loading: {
    EN: "Analyzing your situation... please wait.",
    AM: "ሁኔታዎን በመገምገም ላይ... እባክዎ ይጠብቁ።",
    OR: "Haala kee xiinxalaa jira... maaloo eegi.",
  },
  decision_result_title: {
    EN: "📊 *Your Results*\n\n",
    AM: "📊 *ውጤቶችዎ*\n\n",
    OR: "📊 *Bu'aa Kee*\n\n",
  },
  professional_prompt: {
    EN: "What kind of professional are you looking for?",
    AM: "ምን ዓይነት ባለሙያ ይፈልጋሉ?",
    OR: "Ogeessa akkamii barbaadaa jirta?",
  },
  professional_loading: {
    EN: "Finding professionals... please wait.",
    AM: "ባለሙያዎችን በመፈለግ ላይ... እባክዎ ይጠብቁ።",
    OR: "Ogeeyyii barbaadaa jira... maaloo eegi.",
  },
  professional_none: {
    EN: "No professionals found at this time.",
    AM: "በአሁኑ ጊዜ ባለሙያዎች አልተገኙም።",
    OR: "Yeroo ammaa ogeeyyiin hin argamne.",
  },
  support_prompt: {
    EN: "Please type your message to our support team below:",
    AM: "እባክዎ ለድጋፍ ቡድናችን መልእክትዎን ከዚህ በታች ይጻፉ:",
    OR: "Maaloo ergaa kee garee deeggarsaa keenyaaf armaan gaditti barreessi:",
  },
  support_sent: {
    EN: "✅ Your message has been sent to our team. We will get back to you soon.",
    AM: "✅ መልእክትዎ ተልኳል። በቅርቡ እንመልስልዎታለን።",
    OR: "✅ Ergaan kee ergameera. Dhiyootti deebii siif kennina.",
  },
  error: {
    EN: "⚠️ Something went wrong. Please try /start again.",
    AM: "⚠️ ችግር ተፈጥሯል። እባክዎ /start እንደገና ይሞክሩ።",
    OR: "⚠️ Rakkoon uumameera. Maaloo /start irra deebi'ii yaali.",
  },
  prof_medical: { EN: "Medical", AM: "ሕክምና", OR: "Yaalaa" },
  prof_counselor: { EN: "Counselor", AM: "አማካሪ", OR: "Gorsaa" },
  prof_therapist: { EN: "Therapist", AM: "ቴራፒስት", OR: "Terapistii" },
};

export function t(lang: Language, key: string, params?: Record<string, string>): string {
  let text = translations[key]?.[lang] || translations[key]?.["EN"] || key;
  
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{{${k}}}`, v);
    }
  }
  
  return text;
}
