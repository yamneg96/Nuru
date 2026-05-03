import type { TemplateKey } from "../constants.js";

export const en: Record<TemplateKey, string> = {
  welcome: `👋 Welcome to Nuru!

We provide safe, confidential, youth-friendly health guidance.

Here's what you can do:
• Type /help to see support options
• Type /doctor to connect with a professional
• Type /lang am or /lang or to switch language

Your privacy is our priority. 💙`,

  help: `💡 Nuru Support Options:

🧠 Mental Health — stress, anxiety, feelings
🩺 Talk to a Professional — type /doctor
📘 Sexual & Reproductive Health — ask freely
🍎 Nutrition & Wellness — healthy habits
🚫 Substance Use — safe information

Just type what's on your mind, or use:
• /doctor — connect with a professional
• /lang am — switch to Amharic
• /lang or — switch to Afaan Oromoo`,

  doctor: `🩺 Connecting you to a professional...

A verified healthcare provider will reach out to you shortly. Your conversation is confidential.

⚠️ If this is an emergency, please contact local emergency services immediately.`,

  mental_health: `🧠 It's okay to feel this way — you're not alone.

Here are some things that may help right now:
• Take slow, deep breaths (4 counts in, 4 out)
• Drink some water
• Step outside for fresh air
• Talk to someone you trust

Would you like to speak with a professional? Type /doctor.

💙 Remember: seeking help is a sign of strength.`,

  srh: `📘 Sexual & Reproductive Health

We provide confidential, non-judgmental information on:
• Contraception and family planning
• STI prevention and awareness
• Menstrual health
• Consent and healthy relationships

Type /doctor to speak with a specialist privately.

⚠️ This is educational guidance, not medical diagnosis. Always consult a healthcare provider for personal medical decisions.`,

  fallback: `🤖 I didn't quite understand that.

Try typing:
• /help — see what I can help with
• /doctor — talk to a professional
• Or just describe how you're feeling`,

  lang_changed: `✅ Language updated successfully!

Your responses will now be in English.`,

  unsupported_command: `❌ That command isn't recognized.

Available commands:
• /start — restart conversation
• /help — see support options
• /doctor — connect with professional
• /lang en|am|or — change language`,

  empty_message: `💬 It looks like you sent an empty message.

Type /help to see what I can assist with, or just tell me what's on your mind.`,

  error: `⚠️ Something went wrong on our end.

Please try again in a moment. If the issue persists, type /help.`,

  escalation_confirm: `✅ Your request has been submitted.

A support team member will be in touch with you soon. In the meantime, feel free to continue chatting.

🆘 If this is urgent, please contact local emergency services.`,

  greeting: `👋 Hi there! How can Nuru help you today?

Type /help to explore your options, or just tell me what's on your mind.`,

  substance_use: `🚫 Substance Use Support

Thank you for reaching out. Here's what you should know:
• You're not being judged — this is a safe space
• Many young people face these challenges
• Professional support makes a real difference

Would you like to talk to someone trained in this area? Type /doctor.

⚠️ This is guidance, not medical advice. Please consult a healthcare professional for personalized support.`,

  nutrition: `🍎 Nutrition & Wellness

Healthy habits make a big difference:
• Eat balanced meals with variety
• Stay hydrated — aim for 8 glasses of water
• Get regular physical activity
• Prioritize sleep (8-10 hours for teens)

Have specific nutrition questions? Type /doctor to speak with a professional.`,

  rate_limited: `⏳ You're sending messages too quickly.

Please wait a moment before sending another message.`,

  non_text: `📎 I can only process text messages right now.

Please type your question or use /help to see options.`,
};
