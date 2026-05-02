import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// ── Gemini API Config ─────────────────────────────────────────────────────────

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

const getSystemPrompt = (language: string) => `
You are Nuru, a supportive youth advisor for Ethiopian adolescents.

Rules:
- Be calm, non-judgmental, and respectful
- Do NOT provide explicit sexual instructions
- Provide safe, general guidance only
- Encourage seeking trusted help when needed
- Use simple, clear language
- Avoid medical diagnosis
- Keep responses concise and actionable
- Be culturally sensitive to the Ethiopian context
- IMPORTANT: You MUST respond exclusively in ${language.toUpperCase()}.

Goal:
Help users make safe and informed decisions about health, relationships, and well-being.
`;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Gemini uses "user" and "model" roles (not "assistant")
interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

// ── Fallback Responses ────────────────────────────────────────────────────────

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

function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("pregnant") || lower.includes("period") || lower.includes("missed")) {
    return FALLBACK_RESPONSES.pregnancy;
  }
  if (lower.includes("relationship") || lower.includes("boyfriend") || lower.includes("girlfriend") || lower.includes("pressure")) {
    return FALLBACK_RESPONSES.relationship;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("start")) {
    return FALLBACK_RESPONSES.general;
  }
  return FALLBACK_RESPONSES.default;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert internal ChatMessage[] to Gemini's "contents" format.
 * Gemini uses "user"/"model" roles and parts arrays.
 * Filters out system messages (handled separately via systemInstruction).
 */
function toGeminiContents(history: ChatMessage[], userPrompt: string): GeminiContent[] {
  const contents: GeminiContent[] = history
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  contents.push({ role: "user", parts: [{ text: userPrompt }] });
  return contents;
}

// ── generateResponse ──────────────────────────────────────────────────────────

/**
 * Generate a response using the Gemini AI API.
 * Falls back to pre-written responses if the API key is missing or call fails.
 */
export async function generateResponse(
  prompt: string,
  conversationHistory: ChatMessage[] = [],
  language: string = "english"
): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    logger.warn("⚠️ No GEMINI_API_KEY set — using fallback responses");
    return getFallbackResponse(prompt);
  }

  try {
    const url = `${GEMINI_BASE_URL}:generateContent?key=${env.GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: getSystemPrompt(language) }],
        },
        contents: toGeminiContents(conversationHistory, prompt),
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      logger.error({ status: res.status, errorText }, "Gemini API error");
      return getFallbackResponse(prompt);
    }

    const data = (await res.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    return data.candidates[0]?.content?.parts[0]?.text || getFallbackResponse(prompt);
  } catch (error) {
    logger.error(error, "Gemini API call failed");
    return getFallbackResponse(prompt);
  }
}

// ── streamResponse ────────────────────────────────────────────────────────────

/**
 * Stream a response using the Gemini AI API (Server-Sent Events).
 */
export async function streamResponse(
  prompt: string,
  conversationHistory: ChatMessage[] = [],
  language: string = "english",
  onChunk: (text: string) => void
): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    const fallback = getFallbackResponse(prompt);
    onChunk(fallback);
    return fallback;
  }

  try {
    // alt=sse enables Server-Sent Events streaming
    const url = `${GEMINI_BASE_URL}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: getSystemPrompt(language) }],
        },
        contents: toGeminiContents(conversationHistory, prompt),
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok || !res.body) {
      const fallback = getFallbackResponse(prompt);
      onChunk(fallback);
      return fallback;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim() || line.trim() === "data: [DONE]") continue;
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.substring(6));
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullResponse += text;
              onChunk(text);
            }
          } catch {
            // Ignore incomplete SSE chunks
          }
        }
      }
    }

    return fullResponse || getFallbackResponse(prompt);
  } catch (error) {
    logger.error(error, "Gemini API stream failed");
    const fallback = getFallbackResponse(prompt);
    onChunk(fallback);
    return fallback;
  }
}

// ── generateTitle ─────────────────────────────────────────────────────────────

/**
 * Generate a short 3-5 word title for a conversation using Gemini.
 */
export async function generateTitle(conversationHistory: ChatMessage[]): Promise<string> {
  if (!env.GEMINI_API_KEY) return "New Conversation";

  try {
    const url = `${GEMINI_BASE_URL}:generateContent?key=${env.GEMINI_API_KEY}`;

    const contents: GeminiContent[] = [
      ...conversationHistory
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
          parts: [{ text: m.content }],
        })),
      {
        role: "user",
        parts: [{ text: "Generate a short, 3 to 5 word title summarizing this conversation. No quotes or prefixes — just the title." }],
      },
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 20, temperature: 0.5 },
      }),
    });

    if (!res.ok) return "New Conversation";

    const data = (await res.json()) as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    const title = data.candidates[0]?.content?.parts[0]?.text?.trim().replace(/^[\"']|[\"']$/g, "");
    return title || "New Conversation";
  } catch (error) {
    logger.error(error, "Gemini API title generation failed");
    return "New Conversation";
  }
}
