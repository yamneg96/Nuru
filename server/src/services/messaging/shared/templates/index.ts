import { en } from "./en.js";
import { am } from "./am.js";
import { or } from "./or.js";
import type { Language, TemplateKey } from "../constants.js";
import { LANGUAGES } from "../constants.js";

const registry: Record<Language, Record<TemplateKey, string>> = {
  [LANGUAGES.EN]: en,
  [LANGUAGES.AM]: am,
  [LANGUAGES.OR]: or,
};

export function getTemplate(key: TemplateKey, lang: Language): string {
  const langTemplates = registry[lang] ?? registry[LANGUAGES.EN];
  return langTemplates[key] ?? registry[LANGUAGES.EN][key] ?? "";
}

export { en, am, or };
