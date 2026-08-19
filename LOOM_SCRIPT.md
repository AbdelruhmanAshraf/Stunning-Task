# 5-Minute Loom Video Walkthrough Script (LOOM_SCRIPT.md)

**Candidate Task**: Full-Stack Vibe Coder (Builder Mindset) — [Stunning.so](https://stunning.so)  
**Date**: August 19, 2026 | **Deadline**: August 21, 2026  
**Time Limit**: Under 5 minutes strictly (Videos >5 mins are NOT reviewed)  
**Setup**: Screen share full-screen + Camera bubble visible (Face + clear audio)

---

## ⏱️ Timeline at a Glance

```
[0:00 - 0:40]  Introduction & What I Built
[0:40 - 2:00]  Core Demo: Prompt Input + Integration Selection + System Prompt Injection
[2:00 - 3:20]  Live Interactive Sandbox + Agent Planning + Code Viewer
[3:20 - 4:10]  DECISIONS.md & TECH.md Highlights
[4:10 - 4:40]  Closing & Why I Want to Join Stunning
```

---

## 🎬 Full Script (Word-for-Word)

---

### [0:00 – 0:40] Introduction

> *"Hey Mohamed and the Stunning team — I'm [Your Name], and I'm really excited to show you what I built for the Full-Stack Vibe Coder challenge.*
>
> *My approach wasn't just to build a form that calls an API. I wanted to build a real vibe coding engine — one where choosing integrations like Stripe or Slack actually changes what the AI knows, what rules it follows, and what code it generates.*
>
> *Let me show you exactly how it works."*

---

### [0:40 – 2:00] Core Demo: Prompt + Integration Selection + System Prompt Injection

**👉 Actions on screen:**
1. Open `http://localhost:3000` — show the dark premium UI and sticky navbar.
2. Click a preset (e.g., **"AI SaaS Platform with Billing & Alerts"**) or type a custom prompt.
3. Toggle **Stripe**, **Slack**, and **Google Sheets** — watch the badges glow with active pulse.
4. **Click the `🔍 Inspect System Prompt` button** → show the modal.

> *"Here's the critical requirement — watch what happens when I select Stripe and Slack.*
>
> *The system prompt doesn't just receive a label — it compiles specific rules: webhook schemas, environment variable contracts, TypeScript interfaces, and API route definitions. All of this gets injected directly into the LLM context before the model sees anything.*
>
> *In the System Prompt Inspector, you can verify every single line being sent to Gemini 2.0 Flash (or your chosen model) in real time. This is full transparency — no black boxes."*

---

### [2:00 – 3:20] Live Workspace: Sandbox + Agent Planning + Code Viewer

**👉 Actions on screen:**
1. Click **"Generate Full-Stack App ⚡"** — watch live streaming tokens appear.
2. Switch to **Tab: Live Interactive Sandbox**.
3. Click **"Simulate Stripe Action"** → show confetti + telemetry log ✅
4. Click **"Simulate Slack Action"** → show real-time console event log ✅
5. Switch to **Tab: Agent Thinking & Planning** — show the reasoning tree (like Lovable/Replit).
6. Switch to **Tab: Multi-File Code Viewer** — show clean modular files: `app/page.tsx`, `api/integrations/route.ts`, `lib/integrations.ts`.

> *"Vibe coding lives or dies by immediate feedback loops.*
>
> *Instead of just dumping raw Markdown text, the Live Sandbox lets me click and test every integration dispatch in real time — when I trigger Stripe, it hits our actual `/api/integrations` route, simulates a payment capture, and streams the result to the telemetry console.*
>
> *In the Agent Thinking tab, you can see the reasoning tree the AI used — modeled after how Lovable and Replit visualize agent planning.*
>
> *And in the Code Viewer, every file is clean, modular Next.js 15 App Router code — zero placeholders, ready to copy or ship."*

---

### [3:20 – 4:10] DECISIONS.md & TECH.md

> *"For Part 2 — Discipline & Ownership:*
>
> *If this went live tomorrow, my 60-minute priority was the zero-latency System Prompt Compiler and the dual-engine fallback — so the app runs fully even without any API key. I deliberately left out heavy VM containers like WebContainers or E2B, because they add 5 to 15 seconds of cold start and would kill the experience on mobile. Instead, our sandbox responds in under 50 milliseconds.*
>
> *For Part 3 — Latest Technology:*
>
> *In `TECH.md`, I analyzed Reasoning Models — specifically DeepSeek-R1 and Gemini Flash Thinking. The key insight for Stunning is using them as a pre-planning layer: before generating code, the model resolves data contracts across all selected integrations — so Shopify cart IDs map correctly to Stripe metadata, and webhook signatures are validated before any code is emitted. This eliminates hallucination at the architectural level."*

---

### [4:10 – 4:40] Closing

> *"The project runs instantly with just `npm install` and `npm run dev` — no external accounts, no API keys required to see the full experience.*
>
> *Everything is packaged: working Next.js 15 app, DECISIONS.md, TECH.md, and this walkthrough.*
>
> *I'd love to bring this builder mindset and this kind of end-to-end thinking to Stunning. Thank you for your time — I look forward to hearing from you!"*

---

## 💡 Recording Tips

1. **Resolution**: Record at **1080p minimum** for sharp code visibility.
2. **Audio**: Use headphones or an external mic — minimize background noise.
3. **Speed**: Speak clearly and confidently — aim for **~4 min 20 sec** to stay comfortably under 5 minutes.
4. **Cursor**: Move your cursor deliberately to each element you mention — don't let it hover randomly.
5. **Energy**: Smile at the start and end — first impressions and last impressions matter most.
