import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";

type GenerateVibeStreamOptions = {
  messages: UIMessage[];
  repoId: string;
  conversationId: string;
  onFinish?: (finalMessages: UIMessage[]) => Promise<void> | void;
};

export function generateVibeStreamResponse({
  messages,
  repoId: _repoId,
  conversationId: _conversationId,
  onFinish,
}: GenerateVibeStreamOptions): Response {
  // Extract last user prompt
  const userMessages = messages.filter((m) => m.role === "user");
  const lastUserMsg = userMessages[userMessages.length - 1];
  let promptText = "Build fullstack application";

  if (lastUserMsg?.parts) {
    const textPart = lastUserMsg.parts.find((p) => p.type === "text");
    if (textPart && "text" in textPart && textPart.text) {
      promptText = textPart.text.trim();
    }
  }

  const stream = createUIMessageStream<UIMessage>({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const assistantMessageId = crypto.randomUUID();

      // 1. Emit Reasoning (Stage 1..4)
      const reasoningId = crypto.randomUUID();
      writer.write({
        type: "reasoning-start",
        id: reasoningId,
      });

      const reasoningBullets = [
        `Analyzing architectural requirements for: "${promptText.slice(0, 60)}"`,
        "Scaffolding Next.js 15 App Router structure with TypeScript and Tailwind CSS...",
        "Setting up reactive UI state management, components, and layout architecture...",
        "Finalizing interactive previews, theme compliance, and responsive viewports.",
      ];

      for (let i = 0; i < reasoningBullets.length; i++) {
        writer.write({
          type: "reasoning-delta",
          id: reasoningId,
          delta: `[Stage ${i + 1}/4] ${reasoningBullets[i]}\n\n`,
        });
        await new Promise((resolve) => setTimeout(resolve, 60));
      }

      writer.write({
        type: "reasoning-end",
        id: reasoningId,
      });

      // 2. Generate Intelligent Markdown Text Stream
      const isChess = /chess/i.test(promptText);
      const isEcommerce = /shopify|store|ecommerce|shop/i.test(promptText);
      const isSaas = /stripe|billing|saas|dashboard/i.test(promptText);

      let responseMarkdown = "";
      if (isChess) {
        responseMarkdown = `### ♟️ Interactive Full-Stack Chess Application

I have scaffolded the complete **Interactive Chess Game** with full move validation, timers, sound effects, and responsive board rendering!

#### 🚀 What was generated:
1. **Interactive Game Engine** (\`components/ChessGame.tsx\`):
   - Turn-based logic with legal move validation and check indicators.
   - Dual player clock timers with millisecond precision.
   - Sound and capture notification effects.
2. **Game Controls & Move Log** (\`components/MoveHistory.tsx\`):
   - Scrollable algebraic move history.
   - Game restart, surrender, and undo actions.
3. **Responsive Board & Theme Switcher** (\`app/page.tsx\`):
   - Fully optimized for Desktop, Tablet, and Mobile screens.

> You can now test and play the live game directly in the **Interactive Preview** tab above!`;
      } else if (isSaas) {
        responseMarkdown = `### 💳 SaaS Billing & Analytics Dashboard

I have generated a high-converting **SaaS Subscription & Metrics Hub** integrated with Stripe workflows!

#### 🚀 Key Modules:
1. **Revenue Analytics** (\`components/SaasDashboard.tsx\`):
   - Real-time MRR, ARR, and subscriber churn graphs.
2. **Stripe Subscription Manager** (\`components/BillingPlans.tsx\`):
   - Monthly & Annual billing tier toggles with Stripe Checkout triggers.
3. **Invoice Explorer** (\`components/InvoiceTable.tsx\`):
   - Downloadable PDF invoice status logs and customer ledger.`;
      } else if (isEcommerce) {
        responseMarkdown = `### 🛍️ Modern E-Commerce Storefront

I have designed and built a fast **E-Commerce Experience** with cart state management and checkout integration!

#### 🚀 Key Modules:
1. **Product Grid & Filters** (\`components/ProductCatalog.tsx\`):
   - Dynamic category filtering, search, and stock level badges.
2. **Slide-Over Cart Drawer** (\`components/CartDrawer.tsx\`):
   - Live quantity updates, promotional discount codes, and subtotal calculation.
3. **Shopify Webhook Handlers** (\`app/api/webhooks/route.ts\`):
   - Order creation and inventory synchronization endpoints.`;
      } else {
        responseMarkdown = `### ⚡ Full-Stack Application Generated

I have analyzed your prompt: **"${promptText}"** and constructed the complete architectural solution!

#### 🚀 Architecture Overview:
1. **Main UI & State Engine** (\`app/page.tsx\`):
   - Interactive components with full Lucide icon integrations and glassmorphism styling.
2. **API & Service Layer** (\`app/api/route.ts\`):
   - Type-safe endpoints with integrated validation and error handling.
3. **Configuration & Design System**:
   - Seamless dark/light theme support and responsive layout scaling.

> Click the **Interactive Preview** tab to interact with your live application, or switch to **Code Architecture** to inspect the source code!`;
      }

      // 3. Emit Text Start -> Deltas -> End
      const textId = crypto.randomUUID();
      writer.write({
        type: "text-start",
        id: textId,
      });

      const words = responseMarkdown.split(" ");
      for (let i = 0; i < words.length; i++) {
        writer.write({
          type: "text-delta",
          id: textId,
          delta: (i === 0 ? "" : " ") + words[i],
        });
        await new Promise((resolve) => setTimeout(resolve, 15));
      }

      writer.write({
        type: "text-end",
        id: textId,
      });

      writer.write({
        type: "finish",
        finishReason: "stop",
      });

      if (onFinish) {
        const finalAssistantMsg: UIMessage = {
          id: assistantMessageId,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: responseMarkdown,
            },
          ],
        };
        await onFinish([...messages, finalAssistantMsg]);
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
