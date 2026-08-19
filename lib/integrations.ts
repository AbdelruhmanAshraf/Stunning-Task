export interface Integration {
  id: string;
  name: string;
  category: "Payments" | "E-commerce" | "Communication" | "Productivity" | "Database" | "DevOps";
  icon: string;
  badgeColor: string;
  accentHex: string;
  tagline: string;
  description: string;
  envVars: string[];
  systemPromptSnippet: string;
  previewCapabilities: string[];
  samplePayload: Record<string, unknown>;
}

export const INTEGRATIONS_LIST: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    icon: "CreditCard",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    accentHex: "#6366f1",
    tagline: "Payments & Subscriptions",
    description: "Accept one-time payments, subscriptions, and webhooks with Stripe Checkout.",
    envVars: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
    systemPromptSnippet: `[INTEGRATION: STRIPE]
- Implement Stripe Checkout session creation at \`/api/checkout/route.ts\`.
- Handle incoming Stripe webhooks at \`/api/webhooks/stripe/route.ts\` verifying signature with \`stripe.webhooks.constructEvent\`.
- Handle subscription states: \`customer.subscription.created\`, \`customer.subscription.updated\`, \`invoice.payment_succeeded\`.
- Provide client-side checkout trigger button with redirection to Stripe Checkout URL.
- Include proper type definitions for Stripe payment intent metadata and customer sessions.`,
    previewCapabilities: ["Live Checkout Modal", "Webhook Simulator", "Subscription Tier Toggle"],
    samplePayload: {
      sessionId: "cs_test_a1b2c3d4e5f6g7h8",
      customerEmail: "candidate@stunning.so",
      amountTotal: 4900,
      currency: "usd",
      paymentStatus: "paid",
    },
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-commerce",
    icon: "ShoppingBag",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    accentHex: "#10b981",
    tagline: "Storefront & Catalog",
    description: "Fetch product catalogs, manage cart sessions, and handle order creation.",
    envVars: ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_STOREFRONT_ACCESS_TOKEN", "SHOPIFY_API_VERSION"],
    systemPromptSnippet: `[INTEGRATION: SHOPIFY]
- Use Shopify Storefront GraphQL API to query products, variants, and inventory levels.
- Implement GraphQL client in \`lib/shopify.ts\` with error handling and caching strategies.
- Support Cart API mutations: \`cartCreate\`, \`cartLinesAdd\`, \`cartLinesUpdate\`.
- Handle Shopify Webhooks (e.g., \`orders/create\`, \`products/update\`) with HMAC verification.
- Provide responsive e-commerce product grid, variant selector, and cart drawer components.`,
    previewCapabilities: ["Product Catalog Grid", "Variant Selector", "Cart Drawer Sync"],
    samplePayload: {
      productId: "gid://shopify/Product/789123456",
      title: "Vibe Coder Cyber Hoodie",
      price: "$89.00",
      inventoryStatus: "In Stock (42 units)",
      vendor: "Stunning Apparel",
    },
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    icon: "Mail",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    accentHex: "#f43f5e",
    tagline: "Transactional Email & Alerts",
    description: "Send automated transactional emails, notifications, and user confirmations.",
    envVars: ["GMAIL_USER", "GMAIL_APP_PASSWORD", "GMAIL_OAUTH_CLIENT_ID"],
    systemPromptSnippet: `[INTEGRATION: GMAIL / EMAIL]
- Configure Nodemailer / Gmail API transport in \`lib/mailer.ts\` using secure SMTP or Google OAuth2.
- Implement transactional email templates with responsive HTML (welcome email, receipt, magic link).
- Build asynchronous sending queue or server action to prevent blocking HTTP response.
- Add email validation, rate-limiting, and error logging for failed deliveries.`,
    previewCapabilities: ["HTML Email Previewer", "Instant Dispatch Test", "Inbox Mock Simulator"],
    samplePayload: {
      messageId: "<msg_vibe_9921@mail.gmail.com>",
      recipient: "founder@startup.io",
      subject: "Your project is ready to ship 🚀",
      status: "Delivered (250 OK)",
      timestamp: "Just now",
    },
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: "MessageSquare",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    accentHex: "#f59e0b",
    tagline: "Real-time Team Alerts",
    description: "Broadcast instant event notifications and interactive Block Kit messages to Slack channels.",
    envVars: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET", "SLACK_NOTIFICATION_WEBHOOK_URL"],
    systemPromptSnippet: `[INTEGRATION: SLACK]
- Send formatted Slack Block Kit messages on critical events (new signups, payments, alerts).
- Implement inbound webhook handler or Slack Slash Command handler at \`/api/slack/events/route.ts\`.
- Format messages with interactive elements (buttons, contextual color bars, mention tags).
- Include graceful fallback when Slack API is unreachable or rate-limited.`,
    previewCapabilities: ["Block Kit Previewer", "Channel Feed Mock", "Interactive Action Buttons"],
    samplePayload: {
      channel: "#growth-alerts",
      message: "🎉 New customer subscribed to Pro Plan ($49/mo)",
      blocksCount: 4,
      author: "Stunning Bot",
      timestamp: "10:42 PM",
    },
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    category: "Productivity",
    icon: "Table",
    badgeColor: "bg-green-500/20 text-green-300 border-green-500/30",
    accentHex: "#22c55e",
    tagline: "Live Spreadsheet Sync",
    description: "Append leads, log transactions, and sync form submissions directly to Google Sheets.",
    envVars: ["GOOGLE_SHEETS_SPREADSHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"],
    systemPromptSnippet: `[INTEGRATION: GOOGLE SHEETS]
- Authenticate via Google Service Account (JWT) using Googleapis SDK in \`lib/google-sheets.ts\`.
- Implement \`appendRowToSheet(range, values)\` helper to stream user submissions into active spreadsheet.
- Handle column mapping, header row validation, and timestamp injection.
- Provide batch insert capability for high-throughput form captures.`,
    previewCapabilities: ["Spreadsheet Table Viewer", "Live Row Append", "CSV/Sheet Export"],
    samplePayload: {
      spreadsheet: "Stunning Leads & Analytics 2026",
      rowAppended: 142,
      columns: ["Timestamp", "User Email", "Prompt", "Selected Integrations", "Status"],
      status: "Synced in 118ms",
    },
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Database",
    icon: "Database",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    accentHex: "#34d399",
    tagline: "Postgres & Auth",
    description: "Scalable Postgres database with Row Level Security (RLS) and real-time subscriptions.",
    envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    systemPromptSnippet: `[INTEGRATION: SUPABASE / POSTGRES]
- Initialize \`@supabase/supabase-js\` with typed database schema in \`lib/supabase.ts\`.
- Generate SQL table migrations with Row-Level Security (RLS) policies for user data isolation.
- Use Supabase Server Client for Next.js SSR / Server Actions with cookie-based session management.
- Provide CRUD operations with optimistic UI updates.`,
    previewCapabilities: ["Schema SQL Viewer", "Row Explorer", "RLS Policy Inspector"],
    samplePayload: {
      table: "projects",
      rowsCount: 24,
      rlsEnabled: true,
      lastInsertedId: "prj_01hx987f7a",
    },
  },
  {
    id: "github",
    name: "GitHub",
    category: "DevOps",
    icon: "GitBranch",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    accentHex: "#a855f7",
    tagline: "Repository Sync & Deploy",
    description: "Export code repositories, push commits, and trigger CI/CD pipelines automatically.",
    envVars: ["GITHUB_PERSONAL_ACCESS_TOKEN", "GITHUB_REPO_OWNER", "GITHUB_TARGET_REPO"],
    systemPromptSnippet: `[INTEGRATION: GITHUB]
- Use Octokit REST API to programmatically create branches, commit files, and open Pull Requests.
- Implement \`/api/github/sync/route.ts\` to bundle generated code into an automated Git commit.
- Dispatch repository events to trigger GitHub Actions CI/CD deployment pipelines.`,
    previewCapabilities: ["Commit Log Tree", "One-Click Repo Push", "Branch Visualizer"],
    samplePayload: {
      repo: "stunning-vibe-coder-live",
      branch: "feat/ai-generation-v1",
      commitHash: "9a2f7c1",
      filesChanged: 8,
      status: "Ready for PR",
    },
  },
];

export const STARTER_PRESETS = [
  {
    title: "AI SaaS Platform with Billing & Team Alerts",
    prompt: "Build an AI Content Engine SaaS where users can subscribe to monthly plans, generate marketing copy, and send automated notifications to Slack when new high-value users convert.",
    integrations: ["stripe", "slack", "supabase"],
    highlight: "SaaS Starter",
  },
  {
    title: "E-commerce Storefront with Inventory & Receipt Mailer",
    prompt: "Create a modern headless e-commerce store pulling product inventory from Shopify, handling credit card checkout via Stripe, and dispatching styled HTML receipts through Gmail.",
    integrations: ["shopify", "stripe", "gmail"],
    highlight: "E-Commerce",
  },
  {
    title: "Lead Generation Portal with Spreadsheet Sync & Notifications",
    prompt: "Design a high-converting waitlist & lead capture landing page that syncs submissions directly into Google Sheets in real-time and pings our team on Slack with user metrics.",
    integrations: ["google-sheets", "slack", "gmail"],
    highlight: "Growth Engine",
  },
  {
    title: "Automated Developer Hub with GitHub Sync & Postgres DB",
    prompt: "Build a collaborative developer dashboard that stores user snippets in Supabase Postgres and automatically commits approved code templates directly to a GitHub repository.",
    integrations: ["supabase", "github", "slack"],
    highlight: "DevOps Hub",
  },
];

export function getMockIntegrationResponse(integrationId: string, payload: Record<string, unknown> = {}) {
  const matched = INTEGRATIONS_LIST.find((i) => i.id === integrationId);
  const timeStr = new Date().toLocaleTimeString();

  switch (integrationId) {
    case "stripe":
      return {
        success: true,
        integration: "Stripe",
        action: "Checkout Session Verified",
        sessionId: "cs_test_" + Math.random().toString(36).substring(2, 14),
        amount: 4900,
        currency: "usd",
        customerEmail: payload.email || "founder@stunning.so",
        status: "payment_intent.succeeded",
        message: "💳 Stripe Checkout session verified! Simulated $49.00 payment captured.",
        timestamp: timeStr,
      };

    case "shopify":
      return {
        success: true,
        integration: "Shopify",
        action: "Storefront Cart Synchronized",
        cartId: "gid://shopify/Cart/" + Math.random().toString(36).substring(2, 10),
        linesCount: 3,
        totalPrice: "$187.00",
        message: "🛍️ Shopify Storefront API synced! 3 inventory items reserved in cart.",
        timestamp: timeStr,
      };

    case "gmail":
      return {
        success: true,
        integration: "Gmail",
        action: "Transactional Email Dispatched",
        messageId: "<msg_" + Date.now() + "@stunning.mail>",
        recipient: payload.email || "client@company.com",
        subject: "Your New Project Blueprint is Ready 🚀",
        status: "250 Message accepted for delivery",
        message: "✉️ Nodemailer/Gmail Transport sent transactional notification.",
        timestamp: timeStr,
      };

    case "slack":
      return {
        success: true,
        integration: "Slack",
        action: "Block Kit Broadcast",
        channel: "#vibe-updates",
        author: "Stunning Bot",
        blocksDelivered: 4,
        message: "💬 Slack Block Kit payload posted to #vibe-updates with interactive CTA.",
        timestamp: timeStr,
      };

    case "google-sheets":
      const row = Math.floor(Math.random() * 40) + 120;
      return {
        success: true,
        integration: "Google Sheets",
        action: "Append Row to Ledger",
        spreadsheetId: "1A2B3C4D5E_stunning_sheet",
        rowNumber: row,
        cellsCount: 5,
        message: `📊 Google Sheets v4 API: User record appended to Row #${row}.`,
        timestamp: timeStr,
      };

    case "supabase":
      return {
        success: true,
        integration: "Supabase",
        action: "Postgres Insert with RLS",
        table: "projects",
        recordId: "rec_" + Math.random().toString(36).substring(2, 10),
        rlsPolicy: "allow_authenticated_insert",
        message: "⚡ Supabase Postgres client executed row insert with Row-Level Security.",
        timestamp: timeStr,
      };

    case "github":
      return {
        success: true,
        integration: "GitHub",
        action: "Dispatch Repository Commit",
        repository: "user/stunning-generated-app",
        branch: "main",
        commitSha: "sha_" + Math.random().toString(16).substring(2, 9),
        message: "🐙 GitHub Octokit API: Automated commit pushed to main branch.",
        timestamp: timeStr,
      };

    default:
      return {
        success: true,
        integration: matched ? matched.name : integrationId,
        message: `🚀 Simulated event for ${matched ? matched.name : integrationId} executed successfully.`,
        timestamp: timeStr,
      };
  }
}
