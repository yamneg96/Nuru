import { INTENTS, type Intent, type Language, LANGUAGES } from "../shared/constants.js";

interface KeywordMap {
  keywords: string[];
  intent: Intent;
}

const keywordMaps: Record<Language, KeywordMap[]> = {
  [LANGUAGES.EN]: [
    { keywords: ["hello", "hi", "hey", "good morning", "good evening", "sup", "yo"], intent: INTENTS.GREETING },
    { keywords: ["help", "support", "assist", "what can you do", "options"], intent: INTENTS.HELP },
    { keywords: ["doctor", "physician", "medical", "clinic", "hospital", "appointment"], intent: INTENTS.DOCTOR },
    { keywords: ["stress", "anxiety", "anxious", "depressed", "depression", "sad", "lonely", "overwhelmed", "panic", "scared", "afraid", "mental health", "suicidal", "self-harm", "hurt myself", "hopeless", "can't cope", "breakdown"], intent: INTENTS.MENTAL_HEALTH },
    { keywords: ["sex", "pregnancy", "pregnant", "contraception", "condom", "hiv", "std", "sti", "period", "menstruation", "reproductive", "abortion", "consent", "rape", "assault", "birth control", "family planning"], intent: INTENTS.SRH },
    { keywords: ["drug", "drugs", "alcohol", "smoking", "cigarette", "weed", "marijuana", "addiction", "substance", "khat", "chat"], intent: INTENTS.SUBSTANCE_USE },
    { keywords: ["food", "nutrition", "diet", "eating", "weight", "hungry", "meal", "vitamin", "healthy eating"], intent: INTENTS.NUTRITION },
  ],
  [LANGUAGES.AM]: [
    { keywords: ["ሰላም", "ሃይ", "እንደምን"], intent: INTENTS.GREETING },
    { keywords: ["እርዳታ", "ድጋፍ", "አማራጭ"], intent: INTENTS.HELP },
    { keywords: ["ዶክተር", "ሐኪም", "ህክምና", "ክሊኒክ", "ሆስፒታል"], intent: INTENTS.DOCTOR },
    { keywords: ["ጭንቀት", "ድብርት", "ፍርሃት", "ብቸኝነት", "ስሜት", "ራሴን", "ተስፋ"], intent: INTENTS.MENTAL_HEALTH },
    { keywords: ["ወሲብ", "እርግዝና", "ፅንስ", "ኮንዶም", "ኤችአይቪ", "የወር", "ስነ-ተዋልዶ", "ፆታ"], intent: INTENTS.SRH },
    { keywords: ["አልኮል", "ሲጋራ", "ዕፅ", "ጫት", "ሱስ"], intent: INTENTS.SUBSTANCE_USE },
    { keywords: ["ምግብ", "አመጋገብ", "ጤናማ", "ቪታሚን"], intent: INTENTS.NUTRITION },
  ],
  [LANGUAGES.OR]: [
    { keywords: ["akkam", "nagaa", "salaam"], intent: INTENTS.GREETING },
    { keywords: ["gargaarsa", "deeggarsa"], intent: INTENTS.HELP },
    { keywords: ["hakiima", "doktora", "hospitaala", "kilinika"], intent: INTENTS.DOCTOR },
    { keywords: ["dhiphina", "yaaddoo", "sodaa", "gadda", "abdii"], intent: INTENTS.MENTAL_HEALTH },
    { keywords: ["saalaa", "ulfaa", "ulfa", "kondomii", "hiv", "laguu", "wal-hormaata"], intent: INTENTS.SRH },
    { keywords: ["alkoolii", "sigaaraa", "caatii", "araadaa"], intent: INTENTS.SUBSTANCE_USE },
    { keywords: ["nyaata", "soorata", "fayyaa"], intent: INTENTS.NUTRITION },
  ],
};

export function detectIntent(text: string, lang?: Language): Intent {
  const normalizedText = text.toLowerCase().trim();

  if (!normalizedText) return INTENTS.GENERAL;

  const languagesToCheck: Language[] = lang
    ? [lang, LANGUAGES.EN]
    : [LANGUAGES.EN, LANGUAGES.AM, LANGUAGES.OR];

  for (const langKey of languagesToCheck) {
    const maps = keywordMaps[langKey];
    if (!maps) continue;

    for (const { keywords, intent } of maps) {
      for (const keyword of keywords) {
        if (normalizedText.includes(keyword)) {
          return intent;
        }
      }
    }
  }

  return INTENTS.GENERAL;
}