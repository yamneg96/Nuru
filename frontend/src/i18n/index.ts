import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./en.json"
import am from "./am.json"
import om from "./om.json"

const resources = {
  en: { translation: en },
  am: { translation: am },
  om: { translation: om },
}

const langMap: Record<string, string> = {
  english: "en",
  amharic: "am",
  oromo: "om",
}

const savedLang = localStorage.getItem("nuru_language") as
  | "english"
  | "amharic"
  | "oromo"
  | null

const initialLang = savedLang ? langMap[savedLang] : "en"

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
