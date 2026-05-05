import { Language } from "../shared/constants.js";
import { t } from "./bot-i18n.js";

export function getLanguageKeyboard() {
  return [
    [{ text: "English 🇬🇧", callback_data: "lang_EN" }],
    [{ text: "አማርኛ 🇪🇹", callback_data: "lang_AM" }],
    [{ text: "Afaan Oromoo 🇪🇹", callback_data: "lang_OR" }],
  ];
}

export function getMainMenuKeyboard(lang: Language) {
  return [
    [{ text: t(lang, "btn_decision"), callback_data: "menu_decision" }],
    [{ text: t(lang, "btn_professional"), callback_data: "menu_professional" }],
    [{ text: t(lang, "btn_support"), callback_data: "menu_support" }],
    [{ text: t(lang, "btn_settings"), callback_data: "menu_settings" }],
  ];
}

export function getDecisionFlowsKeyboard(lang: Language) {
  return [
    [{ text: "Pregnancy", callback_data: "flow_pregnancy" }],
    [{ text: "Sexual Assault", callback_data: "flow_sexual_assault" }],
    [{ text: "Relationship Pressure", callback_data: "flow_relationship_pressure" }],
    [{ text: "Missed Period", callback_data: "flow_missed_period" }],
    [{ text: "STI", callback_data: "flow_sti" }],
    [{ text: "General Advice", callback_data: "flow_general_advice" }],
    [{ text: t(lang, "btn_back"), callback_data: "menu_main" }],
  ];
}

export function getDecisionOptionsKeyboard(options: { label: string; value: string }[], lang: Language) {
  const keyboard = options.map((opt) => [{ text: opt.label, callback_data: `ans_${opt.value}` }]);
  keyboard.push([{ text: t(lang, "btn_back"), callback_data: "menu_main" }]);
  return keyboard;
}

export function getProfessionalSpecialtyKeyboard(lang: Language) {
  return [
    [{ text: t(lang, "prof_medical"), callback_data: "prof_type_medical" }],
    [{ text: t(lang, "prof_counselor"), callback_data: "prof_type_counselor" }],
    [{ text: t(lang, "prof_therapist"), callback_data: "prof_type_therapist" }],
    [{ text: t(lang, "btn_back"), callback_data: "menu_main" }],
  ];
}

export function getBackKeyboard(lang: Language) {
  return [[{ text: t(lang, "btn_back"), callback_data: "menu_main" }]];
}
