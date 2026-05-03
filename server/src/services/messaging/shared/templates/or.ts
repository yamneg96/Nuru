import type { TemplateKey } from "../constants.js";

export const or: Record<TemplateKey, string> = {
  welcome: `👋 Baga gara Nuru dhuftan!

Odeeffannoo fayyaa nageenya qabu, iccitiin eegamu, dargaggootaaf mijatu ni kennina.

Waan gochuu dandeessan:
• /help barreessaa — filannoo deeggarsa ilaaluuf
• /doctor barreessaa — ogeessa fayyaa waliin wal quunnamuuf
• /lang en ykn /lang am barreessaa — afaan jijjiiruuf

Iccitiin keessan dursa keenya. 💙`,

  help: `💡 Filannoo Deeggarsa Nuru:

🧠 Fayyaa Sammuu — dhiphina, yaaddoo
🩺 Ogeessa Waliin Dubbachuu — /doctor barreessaa
📘 Fayyaa Wal-hormaataa — bilisaan gaafadhaa
🍎 Nyaata fi Fayyummaa
🚫 Fayyadama Wantoota Araadaa — odeeffannoo nageenya qabu

Yaada keessan barreessaa ykn:
• /doctor — ogeessa waliin wal quunnamaa
• /lang en — gara Afaan Ingiliffaatti jijjiiraa
• /lang am — gara Afaan Amaaraatti jijjiiraa`,

  doctor: `🩺 Ogeessa fayyaa waliin isin wal qunnamsiisaa jirra...

Ogeessi fayyaa mirkanaa'e dhiyootti isin quunnama. Haasaan keessan iccitiin eegama.

⚠️ Kun yeroo muddamaa yoo ta'e, tajaajila balaa tasaa naannoo keessanii hatattamaan quunnamaa.`,

  mental_health: `🧠 Akkas miira'uun rakkoo miti — qofaa miti.

Wantootni amma gargaaruu danda'an:
• Suuta suuta hafuura baafadhaa (4 lakkaawwii ol, 4 gad)
• Bishaan dhugaa
• Qilleensa qulqulluuf gara alaatti ba'aa
• Nama amantan waliin dubbadhu

Ogeessa waliin dubbachuu barbaadduu? /doctor barreessaa.

💙 Gargaarsa barbaadun mallattoo cimina.`,

  srh: `📘 Fayyaa Wal-hormaataa

Odeeffannoo iccitiin eegamu, murtii malee ni kennina:
• Karoora maatii fi ittisa da'umsaa
• Ittisa dhukkuba wal-quunnamtii saalaan darbu
• Fayyaa laguu
• Waliigaltee fi hariiroo fayyaa qabu

Ogeessa waliin addatti dubbachuuf /doctor barreessaa.

⚠️ Kun odeeffannoo barnoota, qorannoo yaalaa miti.`,

  fallback: `🤖 Dhiifama, sana hubachuu hin dandeenye.

Yaali:
• /help — waan gargaaruu danda'u ilaali
• /doctor — ogeessa waliin dubbadhu
• Ykn miira kee ibsi`,

  lang_changed: `✅ Afaan milkaa'inaan jijjiirame!

Deebiin keessan amma Afaan Oromooin ta'a.`,

  unsupported_command: `❌ Ajajni sun hin beekamne.

Ajajota jiran:
• /start — haasaa irra deebi'ii jalqabi
• /help — filannoo deeggarsa
• /doctor — ogeessa waliin wal quunnami
• /lang en|am|or — afaan jijjiiri`,

  empty_message: `💬 Ergaa duwwaa ergitan fakkaata.

/help barreessaa ykn waan yaaddan natti himaa.`,

  error: `⚠️ Gama keenyaan rakkoon uumame.

Mee xiqqoo turaa irra deebi'aa yaalaa.`,

  escalation_confirm: `✅ Gaaffiin keessan dhiyaateera.

Miseensi garee deeggarsa dhiyootti isin quunnama.

🆘 Hatattamaa yoo ta'e, tajaajila balaa tasaa naannoo keessanii quunnamaa.`,

  greeting: `👋 Akkam! Nuru har'a akkamiin si gargaaruu danda'a?

/help barreessaa filannoo ilaaluuf ykn waan yaaddan natti himi.`,

  substance_use: `🚫 Deeggarsa Fayyadama Wantoota Araadaa

Waan qaqqabdaniif galatoomaa:
• Murtiin hin kennamuuf — bakki kun nageenya qabu
• Dargaggoonni hedduun qormaata kana ni muddatu
• Deeggarsi ogummaa jijjiirama guddaa fida

Ogeessa waliin dubbachuu barbaadduu? /doctor barreessaa.

⚠️ Kun odeeffannoo, gorsa yaalaa miti.`,

  nutrition: `🍎 Nyaata fi Fayyummaa

Amaloota fayyaa qaban jijjiirama guddaa fidu:
• Nyaata madaalawaa nyaadhaa
• Bishaan dhugaa — bilaawwii 8 xiyyeeffadhaa
• Sochii qaamaa idilee godhaa
• Hirriba dursa kennaaf

Gaaffii addaa qabduu? /doctor barreessaa.`,

  rate_limited: `⏳ Ergaawwan daftee ergaa jirta.

Mee xiqqoo eegii ergaa biraa ergi.`,

  non_text: `📎 Amma ergaa barreeffamaa qofa qorachuu nan danda'a.

Maaloo gaaffii keessan barreessaa ykn /help fayyadamaa.`,
};
