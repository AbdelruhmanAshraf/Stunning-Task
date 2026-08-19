import { INTEGRATIONS_LIST, Integration } from "./integrations";

export interface BuildPromptParams {
  userPrompt: string;
  selectedIntegrationIds: string[];
  framework?: string;
  model?: string;
}

export interface PromptBuildResult {
  systemPrompt: string;
  userPrompt: string;
  injectedIntegrations: Integration[];
  requiredEnvVars: string[];
  architectureSummary: string;
}

export function buildSystemPrompt(params: BuildPromptParams): PromptBuildResult {
  const { userPrompt, selectedIntegrationIds } = params;

  const selectedIntegrations = INTEGRATIONS_LIST.filter((item) =>
    selectedIntegrationIds.includes(item.id)
  );

  const allEnvVars = Array.from(
    new Set(selectedIntegrations.flatMap((item) => item.envVars))
  );

  const integrationContext = selectedIntegrations.length > 0
    ? `The user has selected these integrations: ${selectedIntegrations.map(i => i.name).join(", ")}.
Simulate their behavior in the UI with mock API calls (fetch to "/api/..." that returns simulated JSON).
Show integration status badges, action buttons, and realistic UI feedback for each.`
    : `No integrations selected. Build a fully self-contained app.`;

  const systemPrompt = `You are Stunning Vibe Coder — an elite AI engineer and UI/UX expert. You build beautiful, fully interactive web apps.

## YOUR TASK
The user will describe an app. You must generate ONE complete, self-contained HTML file that runs immediately in a browser iframe.

## STRICT OUTPUT FORMAT
- Output ONLY a single \`\`\`html code block.
- The HTML file must be complete and standalone — no build steps, no external files needed.
- Include ALL CSS inline (or via CDN links in <head>).
- Include ALL JavaScript inline in <script> tags.
- Use these CDNs (already available):
  - Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>
  - Font Awesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  - Chart.js (if needed): <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  - Alpine.js (if needed): <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

## DESIGN STANDARDS (NON-NEGOTIABLE)
- Dark mode background: #0a0b14 or similar dark slate
- Use glassmorphism cards: bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl
- Vibrant accent colors: violet-500, cyan-400, emerald-400
- Beautiful typography: font-sans with clear hierarchy
- Smooth CSS transitions and hover effects
- Fully responsive (mobile-first with Tailwind)
- Must look STUNNING — premium, modern, wow-factor on first glance

## INTERACTIVITY REQUIREMENTS
- All buttons must DO something (update state, animate, show feedback)
- Forms must validate and show success/error states
- Use localStorage where appropriate for persistence
- Simulate async operations with setTimeout (show loading spinners)
- Navigation/tabs must work

## INTEGRATION CONTEXT
${integrationContext}

## WHAT NOT TO DO
- Do NOT output React/Next.js code (no JSX, no import/export for React)
- Do NOT output multiple files
- Do NOT use placeholder content like "Lorem ipsum" — generate real, contextual content
- Do NOT truncate the code — output the COMPLETE file
- Do NOT add explanations outside the code block

Now generate the complete HTML application for the user's request.`;

  const architectureSummary = selectedIntegrations.length > 0
    ? `Configured with ${selectedIntegrations.length} integrations: ${selectedIntegrations.map((i) => i.name).join(", ")}.`
    : "Configured with standalone zero-dependency architecture.";

  return {
    systemPrompt,
    userPrompt,
    injectedIntegrations: selectedIntegrations,
    requiredEnvVars: allEnvVars,
    architectureSummary,
  };
}
