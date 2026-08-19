import { Assistant } from "@/app/assistant";
import { HomeWelcome } from "@/components/assistant-ui/home-welcome";
import { ApiKeyGate, ApiKeySettingsDialog } from "@/components/api-key-gate";
import { WorkspaceFrame } from "@/app/workspace-frame";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { CatLogo } from "@/components/CatLogo";

export const metadata = {
  title: "Live Cloud Builder | Stunning Vibe Coder (Adorable VM)",
  description:
    "Sandboxed cloud VM environment with real-time AI code execution, live preview, and multi-file persistence.",
};

export default function BuilderPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Top Banner with back button and Stunning branding */}
      <header className="h-12 border-b border-border/40 bg-background/80 backdrop-blur px-4 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Showcase
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <CatLogo size={20} showGlow={false} />
            <span className="text-xs font-semibold tracking-tight text-foreground">
              Stunning Cloud Builder
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              Adorable Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            Cloud Sandboxed VM
          </span>
          <ApiKeySettingsDialog />
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 overflow-hidden relative">
        <ApiKeyGate>
          <WorkspaceFrame>
            <Assistant welcome={<HomeWelcome />} />
          </WorkspaceFrame>
        </ApiKeyGate>
      </div>
    </div>
  );
}
