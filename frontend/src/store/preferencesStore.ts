import { create } from "zustand"

interface PreferencesState {
  language: "english" | "amharic" | "oromo"
  saveHistory: boolean
  setLanguage: (lang: "english" | "amharic" | "oromo") => void
  setSaveHistory: (value: boolean) => void
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language:
    (localStorage.getItem("nuru_language") as
      | "english"
      | "amharic"
      | "oromo") || "english",
  saveHistory: localStorage.getItem("nuru_save_history") !== "false",

  setLanguage: (lang) => {
    localStorage.setItem("nuru_language", lang)
    set({ language: lang })
  },

  setSaveHistory: (value) => {
    localStorage.setItem("nuru_save_history", String(value))
    set({ saveHistory: value })
  },
}))
