import type { Message } from "../types/chat";

/* Placeholder answers — replace with the real API call later. */
export const DUMMY_REPLIES = [
  "Got it. I'm running on placeholder answers right now, but the plumbing works — your message came through.",
  "That's an interesting one. Once I'm wired to a real model I'll give you a proper answer instead of this canned line.",
  "Noted. For now every reply is dummy text, so treat this as a UI preview rather than real advice.",
  "I hear you. This response is hard-coded, but the typing indicator, scrolling and bubbles are all real.",
  "Makes sense. Hook me up to an API route and this is where the actual answer will appear.",
];

export const SUGGESTIONS = [
  "What can you do?",
  "Summarise this page",
  "Give me three ideas",
  "Help me debug something",
];

export const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Hey — I'm Binger. Ask me anything and I'll reply with placeholder text for now.",
};

export const THEME_KEY = "binger-theme";

/* Impure helpers live at module scope so component bodies stay pure —
   React Compiler's lint rules reject these inside a component. */
export const newId = () => Math.random().toString(36).slice(2, 10);

export const pickReply = () =>
  DUMMY_REPLIES[Math.floor(Math.random() * DUMMY_REPLIES.length)];

export const replyDelay = () => 900 + Math.random() * 700;

export const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
