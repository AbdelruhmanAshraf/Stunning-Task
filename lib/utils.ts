import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smart Intent Classifier for AI Chat
 * Returns true if the message is a conversational greeting, question, or appreciation
 * that should NOT trigger a full app re-build.
 */
export function isConversationalIntent(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t) return true;

  // Short direct greetings & pleasantries
  const greetings = [
    "hi", "hello", "hey", "hola", "sup", "yo", "good morning", "good afternoon", "good evening",
    "how are you", "how's it going", "what's up", "who are you", "what can you do", "what is this",
    "thanks", "thank you", "thx", "cool", "awesome", "great", "nice", "ok", "okay", "alright", "perfect"
  ];

  if (greetings.includes(t)) return true;

  // Build/action verbs that indicate code generation/editing
  const buildKeywords = [
    "build", "create", "make", "add", "change", "update", "redesign", "fix",
    "generate", "implement", "set", "design", "style", "remove", "delete",
    "code", "refactor", "integrate", "button", "theme", "color", "layout",
    "dashboard", "store", "shop", "game", "chess", "form", "page", "api", "route"
  ];

  const hasBuildKeyword = buildKeywords.some((kw) => t.includes(kw));

  // If it's a general question without build keywords, treat as conversational
  const isQuestion = t.endsWith("?") || t.startsWith("what") || t.startsWith("how") || t.startsWith("can you") || t.startsWith("why");

  return isQuestion && !hasBuildKeyword;
}

/**
 * Returns a friendly, context-aware conversational response.
 */
export function getConversationalResponse(text: string): string {
  const t = text.trim().toLowerCase();

  if (t.includes("hi") || t.includes("hello") || t.includes("hey") || t.includes("yo") || t.includes("sup")) {
    return "Hello! 👋 I'm **Stunning AI**, your principal full-stack engineer and vibe coder. Describe an app or feature you'd like to build, and I'll generate the live code & preview for you!";
  }
  if (t.includes("who are you") || t.includes("what can you do")) {
    return "I am **Stunning AI**! I build full-stack web applications, dashboards, e-commerce stores, games, and forms with pre-configured SDK integrations (Stripe, Shopify, Gmail, Slack, Google Sheets, Supabase, GitHub). Just ask me to build or edit any feature!";
  }
  if (t.includes("thank") || t.includes("thx") || t.includes("cool") || t.includes("awesome") || t.includes("great") || t.includes("nice")) {
    return "You're very welcome! 😊 Let me know whenever you'd like to add new pages, features, or design tweaks to your application.";
  }
  return "I'm ready! What app or refinement would you like to build next? You can describe a layout, color scheme, integration, or custom feature.";
}
