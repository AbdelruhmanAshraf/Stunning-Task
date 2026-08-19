import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider, THEME_STORAGE_KEY } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Stunning Vibe Coder | AI App Builder with Integration Injection",
  description:
    "Describe what you want to build, select third-party integrations (Stripe, Shopify, Gmail, Slack, Google Sheets), and generate full-stack production-ready applications with context-injected AI.",
  keywords: ["AI app builder", "vibe coder", "Stunning", "integration injection", "Next.js", "AI code generation"],
  authors: [{ name: "Candidate - Full-Stack Vibe Coder", url: "https://stunning.so" }],
  icons: {
    icon: "/cat-logo.svg",
    shortcut: "/cat-logo.svg",
    apple: "/cat-logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090a10" },
  ],
};

// Runs before first paint so the stored/system theme is applied without a flash of the wrong palette.
const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var t=(s==='light'||s==='dark')?s:'light';var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(t);r.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#090a10] dark:text-slate-100 antialiased min-h-screen selection:bg-violet-600 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40" />
          <div className="fixed inset-0 bg-vibe-glow pointer-events-none z-0" />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
