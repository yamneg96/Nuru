import { env } from "../config/env.js";

const getSystemPrompt = (language: string) => `
You are a supportive youth advisor for Ethiopian adolescents.

Rules:
- Be calm, non-judgmental, and respectful
- Do NOT provide explicit sexual instructions
- Provide safe, general guidance only
- Encourage seeking trusted help when needed
- Use simple language
- Avoid medical diagnosis
- Keep responses concise and actionable
- Be culturally sensitive to Ethiopian context
- IMPORTANT: You MUST respond exclusively in ${language.toUpperCase()}.

Goal:
Help users make safe and informed decisions.
`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Fallback responses when Grok API is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  default:
    "I understand you're looking for guidance. While I'm having trouble connecting right now, I want you to know that your feelings are valid. Please consider reaching out to a trusted adult, school counselor, or health professional in your area for immediate support.",
  pregnancy:
    "It's completely normal to feel worried about this. A missed period can happen for many reasons including stress, diet changes, or hormonal shifts. If you're concerned, consider taking a home pregnancy test or visiting a youth-friendly clinic near you. Remember, you're not alone in this.",
  relationship:
    "Healthy relationships are built on mutual respect, trust, and communication. If you're feeling pressured or uncomfortable, it's okay to say no and set boundaries. Talk to someone you trust — a friend, family member, or counselor — about what you're experiencing.",
  general:
    "Thank you for reaching out. Taking the first step to seek information shows real strength. I'm here to help you navigate whatever you're going through. What specific topic would you like to explore?",
};

/**
 * Generate a response using the Grok AI API.
 * Falls back to pre-written responses if the API key is missing or the call fails.
 */
export async function generateResponse(
  prompt: string,
  conversationHistory: ChatMessage[] = [],
  language: string = "english"
): Promise<string> {
  // If no API key, use fallback
  if (!env.GROK_API_KEY) {
    console.warn("⚠️ No GROK_API_KEY set — using fallback responses");
    return getFallbackResponse(prompt);
  }

  try {
    const messages: ChatMessage[] = [
      { role: "system", content: getSystemPrompt(language) },
      ...conversationHistory,
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Grok API error (${res.status}):`, errorText);
      return getFallbackResponse(prompt);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return data.choices[0]?.message?.content || getFallbackResponse(prompt);
  } catch (error) {
    console.error("Grok API call failed:", error);
    return getFallbackResponse(prompt);
  }
}

/**
 * Select a contextually appropriate fallback response based on keywords.
 */
function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("pregnant") || lower.includes("period") || lower.includes("missed")) {
    return FALLBACK_RESPONSES.pregnancy;
  }
  if (
    lower.includes("relationship") ||
    lower.includes("boyfriend") ||
    lower.includes("girlfriend") ||
    lower.includes("pressure")
  ) {
    return FALLBACK_RESPONSES.relationship;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("start")) {
    return FALLBACK_RESPONSES.general;
  }

  return FALLBACK_RESPONSES.default;
}

/**
 * Generate a short 3-5 word title for a conversation.
 */
export async function generateTitle(conversationHistory: ChatMessage[]): Promise<string> {
  if (!env.GROK_API_KEY) return "New Conversation";

  try {
    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: "user", content: "Generate a short, 3 to 5 word title summarizing this conversation. Do not use quotes or prefixes, just the title itself." }
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages,
        max_tokens: 20,
        temperature: 0.5,
      }),
    });

    if (!res.ok) return "New Conversation";

    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, "") || "New Conversation";
  } catch (error) {
    console.error("Grok API title generation failed:", error);
    return "New Conversation";
  }
}
