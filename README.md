# Stunning Vibe Coder ⚡

> **Candidate Submission**: Full-Stack Vibe Coder (Builder Mindset)  
> **Target Company**: [Stunning.so](https://stunning.so)  
> **Submission Target**: `mohamed@stunning.so`

An AI-powered landing page and vibe coding engine that turns natural language user prompts into production-grade Next.js applications, dynamically injecting selectable dummy integrations (**Stripe, Shopify, Gmail, Slack, Google Sheets, Supabase, GitHub**) directly into the AI system prompt.

---

## 🌟 Highlights & Key Features

- 🎯 **System Prompt Context Injection**: Toggling integrations dynamically compiles architectural guidelines, type contracts, and `.env` schemas directly into the LLM system prompt.
- 🔍 **System Prompt Inspector**: Transparent debug modal allowing reviewers to audit the exact injected system prompt in real-time.
- ⚡ **Multi-Model AI Execution**:
  - **Live AI Streaming**: Real-time streaming via Google Gemini models including **Gemini 2.0 Flash**, **Gemini 1.5 Pro**, **Gemini 1.5 Flash** (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`) with seamless model switching.
  - **High-Fidelity Offline Vibe Engine**: Built-in zero-dependency simulation engine for instant testing without API keys.
- 🛠️ **Live Interactive App Sandbox**: Clickable mock integration dispatchers (`/api/integrations`) with live telemetry logs and celebration effects.
- 💻 **Multi-File Code Viewer**: Tabbed inspection for `app/page.tsx`, `app/api/integrations/route.ts`, `lib/integrations-config.ts`, and `.env.local` with single-click copy.
- 🌐 **Integrated Cloud VM AI Builder (Adorable Engine)**: Complete sandboxed VM builder workspace accessible via `/builder` with git-backed persistence, terminal sessions, and multi-provider AI support (OpenAI / Anthropic Claude).
- 🎨 **Sleek Vibe Coder Aesthetics**: Modern dark mode (`#090a10`), glassmorphism, responsive grid, and strict spacing adherence (80px desktop / 60px tablet / 40px mobile).

---

## 📁 Repository Structure

```
├── app/
│   ├── api/
│   │   ├── generate/route.ts       # Full-stack AI route with prompt injection & streaming
│   │   └── integrations/route.ts   # Interactive mock dispatcher for live sandbox events
│   ├── globals.css                 # Design system tokens, glassmorphism, responsive spacing
│   ├── layout.tsx                  # Root layout with SEO metadata and theme configuration
│   └── page.tsx                    # Main landing page and vibe coder interface
├── components/
│   ├── FeaturesGrid.tsx            # Engineering highlights & capabilities
│   ├── Footer.tsx                  # Footer with candidate branding & documentation links
│   ├── Hero.tsx                    # Hero section with animated headings and scroll indicator
│   ├── IntegrationBadge.tsx        # Interactive integration toggle chips with brand icons
│   ├── IntegrationShowcase.tsx     # Deep-dive matrix of what each integration injects
│   ├── LiveWorkspace.tsx           # Multi-tab sandbox, code viewer, and architecture diagram
│   ├── Navbar.tsx                  # Sticky header with logo, live indicator, and CTAs
│   ├── PromptEngine.tsx            # Prompt box, presets, integration picker, and model config
│   └── SystemPromptModal.tsx       # Inspector modal showing raw injected system prompt
├── lib/
│   ├── ai.ts                       # AI streaming orchestrator (Gemini / OpenAI / Local Vibe Engine)
│   ├── integrations.ts             # Metadata catalog for Stripe, Shopify, Gmail, Slack, etc.
│   └── prompt-builder.ts           # Dynamic system prompt compilation engine
├── DECISIONS.md                    # Part 2: 60-minute improvements, trade-offs, production risks
├── TECH.md                         # Part 3: Latest technology analysis (Reasoning Models & Sandboxing)
├── package.json                    # Dependencies and build scripts
└── README.md                       # Project documentation and run guide
```

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js**: `v18.0+` (Tested on `v20` / `v24`)
- **npm** or **pnpm**

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "stunning task"

# Install dependencies
npm install
```

### 3. (Optional) Configure Environment Variables
Create a `.env.local` file if you wish to use live cloud LLMs (Gemini / OpenAI). If omitted, the app automatically runs in **High-Fidelity Local Vibe Engine Mode** with zero external dependencies!

```env
# Optional Live LLM Keys:
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verification & Build

To test production build and type-checking:
```bash
npm run build
```

---

## 📑 Required Deliverables Index

1. **Working Full-Stack Application**: Next.js 15 App Router + TypeScript + Tailwind CSS
2. **[DECISIONS.md](file:///Users/abdelruhamanelfekky/Desktop/stunning%20task/DECISIONS.md)**: 60-minute improvements, deliberate omissions, and top production risk mitigations.
3. **[TECH.md](file:///Users/abdelruhamanelfekky/Desktop/stunning%20task/TECH.md)**: In-depth analysis of Reasoning Models & Distillation Pipelines for Stunning.

---

## 📬 Submission Details

- **Contact**: `mohamed@stunning.so`
- **Candidate**: Full-Stack Vibe Coder Applicant
- **Submission Date**: August 2026
