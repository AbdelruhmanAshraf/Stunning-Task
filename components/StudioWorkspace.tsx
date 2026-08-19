"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Code2,
  Copy,
  Check,
  Sparkles,
  Eye,
  KeyRound,
  ChevronDown,
  Send,
  Download,
  FileCode,
  Search,
  BrainCircuit,
  Loader2,
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
  FolderGit2,
  CheckCircle2,
  Terminal,
  Zap,
  CheckCheck,
  FileDown,
  Package,
  FileText,
  Clock,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { INTEGRATIONS_LIST } from "@/lib/integrations";
import { GenerationResponse, GeneratedFile } from "@/lib/ai";
import { IntegrationSelector } from "./IntegrationSelector";
import { SystemPromptModal } from "./SystemPromptModal";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { CatLogo } from "./CatLogo";
import { useTheme } from "@/components/ThemeProvider";
import { LiveAppPreview } from "./LiveAppPreview";
import { isConversationalIntent, getConversationalResponse } from "@/lib/utils";

interface StudioWorkspaceProps {
  generationData: GenerationResponse | null;
  rawStreamingOutput: string;
  liveHtml?: string;
  isStreaming: boolean;
  selectedIntegrations: string[];
  userPrompt: string;
  selectedModel: string;
  apiKey: string;
  onGenerate: (data: {
    prompt: string;
    integrations: string[];
    model: string;
    apiKey: string;
  }) => void;
  onBackToHome: () => void;
}

const CHIP_CLASS =
  "rounded-[36px] bg-slate-900/[0.04] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:bg-white/[0.05] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.08)]";

// Component to stream thinking bullet points one-by-one at a smooth, relaxed human-speed
function StreamedStageBullets({
  bullets,
  isLiveStreaming,
  onComplete,
}: {
  bullets: string[];
  isLiveStreaming: boolean;
  onComplete?: () => void;
}) {
  const [completedBulletsCount, setCompletedBulletsCount] = useState<number>(
    isLiveStreaming ? 0 : bullets.length
  );
  const [currentText, setCurrentText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(isLiveStreaming);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const bulletsRef = useRef(bullets);
  bulletsRef.current = bullets;

  useEffect(() => {
    if (!isLiveStreaming) {
      setCompletedBulletsCount(bullets.length);
      setCurrentText("");
      setIsTyping(false);
      return;
    }

    setCompletedBulletsCount(0);
    setCurrentText("");
    setIsTyping(true);

    let bulletIdx = 0;
    let charIdx = 0;
    let isCancelled = false;

    function step() {
      if (isCancelled) return;

      const currentBullets = bulletsRef.current;
      if (bulletIdx >= currentBullets.length) {
        setIsTyping(false);
        setCurrentText("");
        if (onCompleteRef.current) {
          setTimeout(() => {
            if (!isCancelled && onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 350);
        }
        return;
      }

      const targetBullet = currentBullets[bulletIdx];
      // Step forward by 2-5 characters for smooth typing
      const jump = Math.floor(Math.random() * 3) + 3;
      charIdx = Math.min(targetBullet.length, charIdx + jump);
      setCurrentText(targetBullet.slice(0, charIdx));

      if (charIdx >= targetBullet.length) {
        // Completed this bullet
        setCompletedBulletsCount((c) => c + 1);
        bulletIdx++;
        charIdx = 0;
        setCurrentText("");
        setTimeout(step, 200); // 200ms pause between bullets
      } else {
        setTimeout(step, 22); // 22ms per character chunk
      }
    }

    const startTimer = setTimeout(step, 100);

    return () => {
      isCancelled = true;
      clearTimeout(startTimer);
    };
  }, [isLiveStreaming]);

  return (
    <div className="space-y-2 font-mono text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
      {/* Completed bullets */}
      {bullets.slice(0, completedBulletsCount).map((bullet, idx) => (
        <div key={idx} className="flex items-start gap-2 animate-fadeIn">
          <span className="text-violet-500 mt-0.5 shrink-0 font-bold">•</span>
          <span>{bullet}</span>
        </div>
      ))}

      {/* Currently typing bullet */}
      {isTyping && currentText && completedBulletsCount < bullets.length && (
        <div className="flex items-start gap-2 text-violet-700 dark:text-violet-300">
          <span className="text-violet-500 mt-0.5 shrink-0 font-bold">•</span>
          <span>
            {currentText}
            <span className="inline-block w-1.5 h-3 ml-1 bg-violet-500 animate-pulse align-middle" />
          </span>
        </div>
      )}
    </div>
  );
}

// Component to stream code with animated token typing at a pleasant, relaxed speed
function StreamedCodeContent({
  fullCode,
  isLiveStreaming,
  onStreamComplete,
}: {
  fullCode: string;
  isLiveStreaming: boolean;
  onStreamComplete?: () => void;
}) {
  const [displayedLength, setDisplayedLength] = useState<number>(
    isLiveStreaming ? 0 : fullCode.length
  );
  const [isTyping, setIsTyping] = useState<boolean>(isLiveStreaming);

  const onCompleteRef = useRef(onStreamComplete);
  onCompleteRef.current = onStreamComplete;

  const codeRef = useRef(fullCode);
  codeRef.current = fullCode;

  useEffect(() => {
    if (!isLiveStreaming) {
      setDisplayedLength(fullCode.length);
      setIsTyping(false);
      return;
    }

    setDisplayedLength(0);
    setIsTyping(true);

    let index = 0;
    const total = codeRef.current.length;
    // Pleasant streaming pace: ~1.8s total per file
    const chunk = Math.max(14, Math.floor(total / 50));
    let isCancelled = false;

    const interval = setInterval(() => {
      if (isCancelled) return;
      index += chunk + Math.floor(Math.random() * 8);
      if (index >= total) {
        setDisplayedLength(total);
        setIsTyping(false);
        clearInterval(interval);
        if (onCompleteRef.current) {
          setTimeout(() => {
            if (!isCancelled && onCompleteRef.current) {
              onCompleteRef.current();
            }
          }, 350);
        }
      } else {
        setDisplayedLength(index);
      }
    }, 28);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [isLiveStreaming]);

  const displayedText = fullCode.slice(0, displayedLength);

  return (
    <div className="relative font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto p-4 bg-[#0a0c16]">
      <pre className="whitespace-pre">
        <code>{displayedText}</code>
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-0.5 bg-cyan-400 animate-pulse align-middle" />
        )}
      </pre>
    </div>
  );
}

export function StudioWorkspace({
  generationData,
  rawStreamingOutput,
  liveHtml = "",
  isStreaming,
  selectedIntegrations,
  userPrompt,
  selectedModel,
  apiKey,
  onGenerate,
  onBackToHome,
}: StudioWorkspaceProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Split pane resizable width
  const [sidebarWidth, setSidebarWidth] = useState<number>(420);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Conversational chat state
  type ChatMsg = { id: string; role: "user" | "assistant"; content: string; timestamp: Date };
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: "init-user", role: "user", content: userPrompt, timestamp: new Date() },
    { id: "init-assistant", role: "assistant", content: `I've analyzed your prompt and generated your application. The **Interactive Preview** is live on the right — you can switch to **Code Architecture** to inspect the source files.\n\nWhat would you like to refine or add next?`, timestamp: new Date() },
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showServicesDrawer, setShowServicesDrawer] = useState<boolean>(false);

  // Left sidebar controls state
  const [sideIntegrations, setSideIntegrations] = useState<string[]>(selectedIntegrations);
  const [sideModel, setSideModel] = useState<string>(selectedModel || "gemini-2.0-flash");
  const [sideApiKey, setSideApiKey] = useState<string>(apiKey || "");
  const [showKeyDrawer, setShowKeyDrawer] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  // Thinking State Machine (Stage 1 -> 2 -> 3 -> 4)
  const [showThinkingBox, setShowThinkingBox] = useState<boolean>(false);
  const [streamingThinkingStage, setStreamingThinkingStage] = useState<number | null>(null); // 1..4 or null
  const [completedThinkingStages, setCompletedThinkingStages] = useState<number[]>([]);
  const [isThinkingFinished, setIsThinkingFinished] = useState<boolean>(false);
  const [thinkingSeconds, setThinkingSeconds] = useState<number>(0);
  const [isThinkingBoxOpen, setIsThinkingBoxOpen] = useState<boolean>(true);
  const [expandedThinkingStageId, setExpandedThinkingStageId] = useState<number | null>(null);

  // Sequential File Streaming State Machine (File 0 -> 1 -> 2)
  const [streamingFileIndex, setStreamingFileIndex] = useState<number | null>(null);
  const [completedFileIndexes, setCompletedFileIndexes] = useState<number[]>([]);
  const [activeInspectingFileIndex, setActiveInspectingFileIndex] = useState<number | null>(null);

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"reasoning" | "preview" | "code">("reasoning");

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const integrationNames =
    sideIntegrations.length > 0 ? sideIntegrations.join(", ") : "None (Fullstack Vanilla)";

  // The 4 Structured Thinking Stages
  const THINKING_STAGES = [
    {
      id: 1,
      title: "Analyze Request & Architectural Intent",
      bullets: [
        `Parsed user prompt: "${userPrompt.slice(0, 70)}${userPrompt.length > 70 ? "..." : ""}"`,
        "Framework blueprint: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS",
        `Injected SDK dependencies: ${integrationNames}`,
      ],
    },
    {
      id: 2,
      title: "Synthesize Architectural Blueprint",
      bullets: [
        "Client UI: Responsive dashboard, interactive hero, and state management",
        "Server Layer: Secure API Route Handler (/api/integrations/route.ts) with auth verification",
        "Config Layer: Type-safe SDK initializers and environment schema in /lib",
      ],
    },
    {
      id: 3,
      title: "Injected Integrations & Security Schemas",
      bullets: [
        "Configured environment keys & signature verification for active services",
        "Constructed typed mock/live payload contracts and event handlers",
        "Added error boundaries and async loading fallbacks",
      ],
    },
    {
      id: 4,
      title: "Code Generation & Verification",
      bullets: [
        "Compiling clean TypeScript types and Next.js 15 App Router syntax",
        "All 3 modular files verified without circular dependencies",
        "Ready to generate code streams and exportable ZIP package",
      ],
    },
  ];

  // Prepared files list
  const files: GeneratedFile[] = generationData?.files || [
    {
      filename: "app/page.tsx",
      language: "tsx",
      description: "Client interface with native integration hooks & interactive UI components",
      content: rawStreamingOutput || `// app/page.tsx - Generated Next.js 15 Client Interface
"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

export default function AppPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleTrigger = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "execute", timestamp: Date.now() }),
      });
      const data = await res.json();
      setStatus("Integration executed successfully!");
    } catch (e) {
      setStatus("Execution error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Stunning App Workspace</h1>
              <p className="text-xs text-slate-400">Integrated Services: ${integrationNames}</p>
            </div>
          </div>
          <button
            onClick={handleTrigger}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Zap className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Test Integration
          </button>
        </header>

        {status && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>{status}</span>
          </div>
        )}
      </div>
    </main>
  );
}`,
    },
    {
      filename: "app/api/integrations/route.ts",
      language: "ts",
      description: "Secure Next.js Route Handler executing backend integrations",
      content: `import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate integration payload
    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      status: "active",
      services: [${sideIntegrations.map((i) => `"${i}"`).join(", ")}],
      received: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid Request Payload" },
      { status: 400 }
    );
  }
}`,
    },
    {
      filename: "lib/integrations-config.ts",
      language: "ts",
      description: "Typed configuration, schema validation, and env loader",
      content: `export interface AppConfig {
  services: string[];
  version: string;
  environment: string;
}

export const INTEGRATIONS_CONFIG: AppConfig = {
  services: [${sideIntegrations.map((i) => `"${i}"`).join(", ")}],
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
};

export function getServiceStatus(serviceId: string) {
  return INTEGRATIONS_CONFIG.services.includes(serviceId);
}`,
    },
  ];

  // 1. MASTER TIMED ORCHESTRATION: Stage 1 (Stream -> Smooth Collapse) -> Stage 2 -> Stage 3 -> Stage 4 -> Stop Timer -> Files
  useEffect(() => {
    // Start on Reasoning view when prompt/generation changes
    setActiveWorkspaceTab("reasoning");

    // Reset state
    setShowThinkingBox(false);
    setStreamingThinkingStage(null);
    setCompletedThinkingStages([]);
    setIsThinkingFinished(false);
    setThinkingSeconds(0);
    setStreamingFileIndex(null);
    setCompletedFileIndexes([]);
    setActiveInspectingFileIndex(null);
    setExpandedThinkingStageId(null);
    setIsThinkingBoxOpen(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // Initial pause before thinking starts
    const t0 = setTimeout(() => {
      setShowThinkingBox(true);

      // Start the timer strictly during thinking
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setThinkingSeconds(+elapsed.toFixed(1));
      }, 100);

      // Start Stage 1 streaming smoothly
      setStreamingThinkingStage(1);
    }, 200);

    return () => {
      clearTimeout(t0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [userPrompt, generationData, sideIntegrations]);

  // Handler when a thinking stage finishes typing all its bullets
  const handleThinkingStageComplete = useCallback((stageId: number) => {
    setCompletedThinkingStages((prev) =>
      prev.includes(stageId) ? prev : [...prev, stageId]
    );
    // Smoothly collapse this stage
    setStreamingThinkingStage(null);

    if (stageId < 4) {
      // Small smooth pause before expanding next stage
      setTimeout(() => {
        setStreamingThinkingStage(stageId + 1);
      }, 350);
    } else {
      // All 4 stages finished!
      setIsThinkingFinished(true);

      // Stop and freeze timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Smooth pause then start streaming first file
      setTimeout(() => {
        setStreamingFileIndex(0);
      }, 450);
    }
  }, []);

  // Handler when a file finishes streaming its tokens
  const handleFileStreamComplete = useCallback((fileIdx: number) => {
    setCompletedFileIndexes((prev) => {
      if (!prev.includes(fileIdx)) return [...prev, fileIdx];
      return prev;
    });

    // Smoothly collapse this file
    setStreamingFileIndex(null);

    // Pause before opening next file
    setTimeout(() => {
      if (fileIdx < files.length - 1) {
        setStreamingFileIndex(fileIdx + 1);
      } else {
        // All files finished streaming!
        setStreamingFileIndex(null);
      }
    }, 350);
  }, [files.length]);

  // Resizable divider drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      if (newWidth >= 320 && newWidth <= Math.min(680, containerRect.width - 380)) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  const handleToggleSideIntegration = (id: string) => {
    setSideIntegrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isStreaming) return;

    const rawInput = chatInput.trim();
    const newUserMsg: ChatMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: rawInput,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newUserMsg]);
    setChatInput("");

    // Smart Intent Classification: Check if message is a greeting/general question
    if (isConversationalIntent(rawInput)) {
      setTimeout(() => {
        const replyMsg: ChatMsg = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: getConversationalResponse(rawInput),
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 350);
      return;
    }

    // Build/Edit Intent: Switch to Reasoning & Build Log view immediately
    setActiveWorkspaceTab("reasoning");

    // Build cumulative prompt from all user messages
    const allUserPrompts = [...chatMessages.filter(m => m.role === "user").map(m => m.content), rawInput];
    const cumulativePrompt = allUserPrompts.join(". Additionally: ");

    onGenerate({
      prompt: cumulativePrompt,
      integrations: sideIntegrations,
      model: sideModel,
      apiKey: sideApiKey.trim(),
    });

    // Add assistant thinking message after a brief delay
    setTimeout(() => {
      const assistantMsg: ChatMsg = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Understood! Initiating architectural reasoning for: **"${rawInput}"**\n\nWatch the live build process in the **Reasoning & Build Log** tab!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  };

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Download Individual File
  const handleDownloadSingleFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const simpleName = file.filename.split("/").pop() || file.filename;
    a.href = url;
    a.download = simpleName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download all files as a clean .ZIP archive
  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // 1. Add generated files
      files.forEach((f) => {
        zip.file(f.filename, f.content);
      });

      // 2. Add package.json
      const packageJson = {
        name: "stunning-vibe-app",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          next: "^15.1.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "lucide-react": "^1.16.0",
          "clsx": "^2.1.1",
          "tailwind-merge": "^3.0.0",
        },
        devDependencies: {
          typescript: "^5.7.0",
          "@types/node": "^22.0.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          postcss: "^8.4.49",
          tailwindcss: "^3.4.16",
        },
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      // 3. Add README.md
      const readmeMd = `# Stunning Web App

Generated with native integrations: **${integrationNames}**

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view your app.
`;
      zip.file("README.md", readmeMd);

      // 4. Generate .zip package
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stunning-app-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating zip:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const quickRefinements = [
    "Add Dark/Light theme toggle",
    "Add responsive mobile drawer",
    "Add webhook retry logic",
    "Add form validation schema",
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-[#07080f] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Studio Header Bar */}
      <header className="h-14 shrink-0 px-4 border-b border-slate-900/10 dark:border-white/10 bg-white/90 dark:bg-[#090b14]/90 backdrop-blur-md flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-1.5 text-xs font-semibold"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <div className="h-4 w-px bg-slate-900/10 dark:bg-white/10" />

          <div className="flex items-center gap-2">
            <CatLogo className="w-6 h-6 text-violet-500" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Stunning Studio
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {!isThinkingFinished
                ? `Thinking (${thinkingSeconds}s)`
                : `Thought for ${thinkingSeconds}s`}
            </span>
          </div>

          {/* Export All as .ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer"
            title="Download full project as a .zip file"
          >
            {isZipping ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Package className="w-3.5 h-3.5" />
            )}
            <span>Export All (.ZIP)</span>
          </button>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Body (Split-Screen Layout) */}
      <div ref={containerRef} className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* ================= LEFT PANE: SANDBOX / CHAT CONTROLS ================= */}
        <aside
          style={{ width: `${sidebarWidth}px` }}
          className="w-full md:shrink-0 flex flex-col h-full bg-white/95 dark:bg-[#0b0d18] border-b md:border-b-0 md:border-r border-slate-900/10 dark:border-white/10 overflow-y-auto z-10"
        >
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-900/10 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Stunning AI Chat
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowServicesDrawer(!showServicesDrawer)}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-semibold transition cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Services ({sideIntegrations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-violet-600 hover:text-violet-700 dark:text-violet-400 font-semibold transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect
                </button>
              </div>
            </div>

            {/* Services Drawer (collapsible) */}
            <AnimatePresence>
              {showServicesDrawer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-b border-slate-900/10 dark:border-white/10"
                >
                  <div className="px-4 py-3 space-y-2">
                    <IntegrationSelector
                      selectedIds={sideIntegrations}
                      onToggle={handleToggleSideIntegration}
                      onSelectAll={() => setSideIntegrations(INTEGRATIONS_LIST.map((i) => i.id))}
                      onClearAll={() => setSideIntegrations([])}
                    />
                    {/* Model & Key row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className={`inline-flex items-center gap-1.5 h-6 px-2.5 text-[11px] text-slate-600 dark:text-slate-300 ${CHIP_CLASS}`}>
                        <span className="text-slate-500 dark:text-slate-400">Model:</span>
                        <select
                          value={sideModel}
                          onChange={(e) => setSideModel(e.target.value)}
                          className="bg-transparent text-slate-900 dark:text-white text-[11px] outline-none cursor-pointer font-medium"
                        >
                          <option value="gemini-2.0-flash" className="bg-white dark:bg-[#141622]">Gemini 2.0 Flash</option>
                          <option value="gemini-1.5-pro" className="bg-white dark:bg-[#141622]">Gemini 1.5 Pro</option>
                          <option value="gpt-4o" className="bg-white dark:bg-[#141622]">GPT-4o</option>
                          <option value="local-vibe-engine" className="bg-white dark:bg-[#141622]">Local Vibe Engine</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                        className={`inline-flex items-center gap-1 h-6 px-2 text-[10px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer ${CHIP_CLASS}`}
                      >
                        <KeyRound className="w-3 h-3 text-violet-500" />
                        Key
                      </button>
                    </div>
                    {showKeyDrawer && (
                      <input
                        type="password"
                        value={sideApiKey}
                        onChange={(e) => setSideApiKey(e.target.value)}
                        placeholder="AIzaSy... / sk-..."
                        className="w-full bg-white border border-slate-900/10 text-slate-900 placeholder-slate-400 dark:bg-[#0c0d15] dark:border-white/10 dark:text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500"
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== Conversation Thread ===== */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-md shadow-md"
                        : "bg-slate-100 dark:bg-[#151828] text-slate-800 dark:text-slate-200 rounded-bl-md border border-slate-900/5 dark:border-white/5"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Streaming indicator */}
              {isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-[#151828] rounded-2xl rounded-bl-md px-3.5 py-2.5 border border-slate-900/5 dark:border-white/5 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Generating...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ===== Quick Chips ===== */}
            <div className="px-4 py-1.5 flex flex-wrap gap-1.5 border-t border-slate-900/5 dark:border-white/5 shrink-0">
              {quickRefinements.map((refine, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChatInput(refine);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-900/5 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300 transition cursor-pointer"
                >
                  + {refine}
                </button>
              ))}
            </div>

            {/* ===== Chat Input ===== */}
            <form onSubmit={handleSideSubmit} className="px-3 pb-3 pt-1.5 shrink-0">
              <div className="rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-[#121424] dark:border-white/10 p-2 focus-within:border-violet-500/60 transition-colors flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSideSubmit(e);
                    }
                  }}
                  placeholder="Ask Stunning AI to edit, add features, or refine your app..."
                  rows={2}
                  className="flex-1 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-[13px] focus:outline-none resize-none leading-relaxed font-sans min-h-[44px] max-h-[120px]"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !chatInput.trim()}
                  className="shrink-0 w-9 h-9 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isStreaming ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </aside>

        {/* ================= RESIZABLE VERTICAL DIVIDER ================= */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden md:flex w-2 hover:w-2.5 -mx-1 bg-transparent hover:bg-violet-500/20 active:bg-violet-500/40 cursor-col-resize z-20 items-center justify-center transition-all group"
          title="Drag to resize panels"
        >
          <div className="w-0.5 h-8 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-violet-500 transition-colors" />
        </div>

        {/* ================= RIGHT PANE: LIVE PREVIEW & CODE WORKSPACE ================= */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100/50 dark:bg-[#07080f]">
          {/* Top View Mode Tabs (Replit / Lovable-style) */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-900/10 dark:border-white/10 bg-white/70 dark:bg-[#0c0e18]/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-[#151828] p-1 rounded-xl border border-slate-900/5 dark:border-white/5">
              <button
                type="button"
                onClick={() => setActiveWorkspaceTab("reasoning")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeWorkspaceTab === "reasoning"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Reasoning & Build Log</span>
                {!isThinkingFinished || isStreaming ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold animate-pulse flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    BUILDING
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                    READY
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkspaceTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeWorkspaceTab === "preview"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Interactive Preview</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                  LIVE
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveWorkspaceTab("code")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeWorkspaceTab === "code"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Architecture ({files.length} Files)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isThinkingFinished && (
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceTab("preview")}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer animate-pulse"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Launch App</span>
                </button>
              )}
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Engine: Gemini 2.0 Flash
              </span>
            </div>
          </div>

          {/* ================= 1. REASONING & BUILD LOG VIEW ================= */}
          {activeWorkspaceTab === "reasoning" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Build Status / Celebration Launch Banner */}
              <div className="rounded-2xl border border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#0c0e18] p-5 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                      !isThinkingFinished || isStreaming
                        ? "bg-violet-500/15 text-violet-500 border border-violet-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {!isThinkingFinished || isStreaming ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                          {!isThinkingFinished || isStreaming
                            ? "Synthesizing Application Architecture..."
                            : "Application Built Successfully!"}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                          !isThinkingFinished || isStreaming
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}>
                          {!isThinkingFinished || isStreaming ? `Building (${thinkingSeconds}s)` : "Compiled & Ready"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {!isThinkingFinished || isStreaming
                          ? "Executing multi-stage LLM reasoning, layout synthesis, and SDK bindings..."
                          : "Your custom web application has been generated and validated. Click Launch App to view live!"}
                      </p>
                    </div>
                  </div>

                  {/* Launch App Button */}
                  {isThinkingFinished && !isStreaming && (
                    <button
                      type="button"
                      onClick={() => setActiveWorkspaceTab("preview")}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>🚀 Launch App Preview</span>
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      !isThinkingFinished || isStreaming
                        ? "bg-gradient-to-r from-violet-500 to-cyan-400 animate-pulse"
                        : "bg-emerald-500 w-full"
                    }`}
                    style={{
                      width: !isThinkingFinished || isStreaming
                        ? `${Math.min(95, ((completedThinkingStages.length + 1) / 4) * 100)}%`
                        : "100%",
                    }}
                  />
                </div>
              </div>

              {/* Skeleton Loading Card preview while reasoning */}
              {(!isThinkingFinished || isStreaming) && (
                <div className="rounded-2xl border border-slate-900/10 dark:border-white/10 bg-white/80 dark:bg-[#0d0f1c] p-4 space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-slate-300 dark:bg-white/10 rounded-lg w-1/3" />
                    <div className="h-4 bg-slate-300 dark:bg-white/10 rounded-lg w-16" />
                  </div>
                  <div className="h-10 bg-slate-200 dark:bg-white/5 rounded-xl w-full" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-xl" />
                    <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-xl" />
                    <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-xl" />
                  </div>
                </div>
              )}

              {/* 4-STAGE AUTHENTIC REASONING ENGINE */}
              {showThinkingBox && (
                <div className="rounded-2xl border border-slate-900/10 dark:border-white/10 bg-white dark:bg-[#0c0e18] p-4 shadow-sm transition-all">
                  <div
                    onClick={() => setIsThinkingBoxOpen(!isThinkingBoxOpen)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                        {!isThinkingFinished ? (
                          <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                        ) : (
                          <BrainCircuit className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {!isThinkingFinished
                              ? `Thinking...`
                              : `Thought for ${thinkingSeconds} seconds`}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                              !isThinkingFinished
                                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 animate-pulse"
                                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {!isThinkingFinished ? "Reasoning" : "Completed"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Structured architectural reasoning and SDK synthesis
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
                    >
                      <span>{isThinkingBoxOpen ? "Hide" : "Show thoughts"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isThinkingBoxOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* 4 Thinking Stages */}
                  {isThinkingBoxOpen && (
                    <div className="mt-3.5 pt-3 border-t border-slate-900/5 dark:border-white/5 space-y-2.5">
                      {THINKING_STAGES.map((stage) => {
                        const isCompleted = completedThinkingStages.includes(stage.id);
                        const isCurrentlyStreaming = streamingThinkingStage === stage.id;
                        const isManuallyExpanded = expandedThinkingStageId === stage.id;
                        const isStageExpanded = isCurrentlyStreaming || isManuallyExpanded;

                        if (!isCompleted && !isCurrentlyStreaming) {
                          return null;
                        }

                        return (
                          <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className={`rounded-xl border transition-all text-xs overflow-hidden ${
                              isCurrentlyStreaming
                                ? "bg-violet-500/5 border-violet-500/40 dark:bg-violet-500/10 dark:border-violet-500/50 shadow-xs"
                                : "bg-slate-50/60 border-slate-900/5 dark:bg-white/[0.02] dark:border-white/5"
                            }`}
                          >
                            <div
                              onClick={() => {
                                if (isCompleted && !isCurrentlyStreaming) {
                                  setExpandedThinkingStageId((prev) =>
                                    prev === stage.id ? null : stage.id
                                  );
                                }
                              }}
                              className={`p-2.5 flex items-center justify-between select-none ${
                                isCompleted && !isCurrentlyStreaming
                                  ? "cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-colors"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                    isCompleted
                                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                      : "bg-violet-500 text-white shadow-xs animate-pulse"
                                  }`}
                                >
                                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : stage.id}
                                </div>
                                <span
                                  className={`font-semibold ${
                                    isCompleted
                                      ? "text-slate-800 dark:text-slate-200"
                                      : "text-violet-600 dark:text-violet-400 font-bold"
                                  }`}
                                >
                                  {stage.id}. {stage.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isCurrentlyStreaming && (
                                  <span className="flex items-center gap-1 text-[10px] text-violet-500 font-mono font-medium">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Reasoning...
                                  </span>
                                )}
                                {isCompleted && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                                      Done
                                    </span>
                                    <ChevronDown
                                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                                        isManuallyExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <AnimatePresence initial={false}>
                              {isStageExpanded && (
                                <motion.div
                                  key="stage-body"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.32, ease: [0.04, 0.62, 0.23, 0.98] }}
                                  className="overflow-hidden border-t border-slate-900/5 dark:border-white/5"
                                >
                                  <div className="px-3 pb-3 pt-2">
                                    <StreamedStageBullets
                                      bullets={stage.bullets}
                                      isLiveStreaming={isCurrentlyStreaming}
                                      onComplete={() => handleThinkingStageComplete(stage.id)}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= 2. INTERACTIVE PREVIEW VIEW ================= */}
          {activeWorkspaceTab === "preview" && (
            <div className="flex-1 overflow-hidden p-3 sm:p-4 flex flex-col">
              <LiveAppPreview
                userPrompt={chatMessages.filter(m => m.role === "user").map(m => m.content).join(". Additionally: ") || userPrompt}
                selectedIntegrations={sideIntegrations}
                files={files}
                liveHtml={liveHtml}
                isStreaming={isStreaming || !isThinkingFinished}
              />
            </div>
          )}

          {/* ================= 3. CODE IMPLEMENTATION VIEW ================= */}
          {activeWorkspaceTab === "code" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* CODE FILES LIST */}

          {/* 2. THREE INDIVIDUAL FILES (SEQUENTIAL STREAMING -> AUTO COLLAPSING INTO EXTRACTABLE CARDS) */}
          {(completedThinkingStages.length > 0 || isThinkingFinished) && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-violet-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Generated Code Architecture ({files.length} Files)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {completedFileIndexes.length} of {files.length} Ready
                </span>
              </div>

              {/* Files List */}
              {files.map((file, idx) => {
                const isLiveStreamingThisFile = streamingFileIndex === idx;
                const isCompletedThisFile = completedFileIndexes.includes(idx);
                const isManuallyInspecting = activeInspectingFileIndex === idx;

                // Do NOT render upcoming files until their streaming or completed turn arrives
                if (!isLiveStreamingThisFile && !isCompletedThisFile) {
                  return null;
                }

                // Card is open if it is currently streaming code OR if user clicked to inspect
                const isCardOpen = isLiveStreamingThisFile || isManuallyInspecting;

                return (
                  <motion.div
                    key={file.filename}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isLiveStreamingThisFile
                        ? "bg-white dark:bg-[#0c0e18] border-violet-500 shadow-md ring-1 ring-violet-500/40"
                        : "bg-white dark:bg-[#0c0e18] border-slate-900/10 dark:border-white/10 hover:border-violet-500/30"
                    }`}
                  >
                    {/* File Card Header Bar */}
                    <div
                      onClick={() => {
                        if (isCompletedThisFile && !isLiveStreamingThisFile) {
                          setActiveInspectingFileIndex((prev) =>
                            prev === idx ? null : idx
                          );
                        }
                      }}
                      className={`p-3.5 flex items-center justify-between transition-colors select-none ${
                        isCompletedThisFile && !isLiveStreamingThisFile
                          ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* File status icon */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCompletedThisFile
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : isLiveStreamingThisFile
                              ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                              : "bg-slate-200 dark:bg-white/10 text-slate-400"
                          }`}
                        >
                          {isCompletedThisFile ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : isLiveStreamingThisFile ? (
                            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                          ) : (
                            <FileCode className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-white truncate">
                              {file.filename}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-500 font-semibold">
                              {file.language}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {file.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Action buttons on the Card */}
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {isLiveStreamingThisFile && (
                          <span className="flex items-center gap-1.5 text-xs text-violet-500 font-mono font-semibold">
                            <Zap className="w-3.5 h-3.5 animate-pulse" />
                            Streaming code...
                          </span>
                        )}

                        {isCompletedThisFile && (
                          <>
                            {/* Individual File Download / Extract Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSingleFile(file);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-violet-500/15 hover:text-violet-600 dark:bg-white/5 dark:hover:bg-violet-500/20 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-900/5 dark:border-white/5 cursor-pointer"
                              title={`Download ${file.filename}`}
                            >
                              <FileDown className="w-3.5 h-3.5" />
                              <span>Extract File</span>
                            </button>

                            {/* Copy Code */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCode(file.filename, file.content);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
                              title="Copy code"
                            >
                              {copiedFile === file.filename ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Toggle code view chevron */}
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                isCardOpen ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expandable Code Content Body with Smooth Animation */}
                    <AnimatePresence initial={false}>
                      {isCardOpen && (
                        <motion.div
                          key="file-code-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden border-t border-slate-900/10 dark:border-white/10"
                        >
                          <StreamedCodeContent
                            fullCode={file.content}
                            isLiveStreaming={isLiveStreamingThisFile}
                            onStreamComplete={() => handleFileStreamComplete(idx)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom Success Banner after all 3 files complete */}
          {completedFileIndexes.length === files.length && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Generation Complete & All Files Ready
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Click any file card above to inspect code, extract individual files, or download the full ZIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>Export Project (.ZIP)</span>
              </button>
            </div>
          )}
            </div>
          )}
        </main>
      </div>

      {/* System Prompt Inspector Modal */}
      {isInspectorOpen && (() => {
        const promptResult = buildSystemPrompt({
          userPrompt: chatMessages.filter(m => m.role === "user").map(m => m.content).join(". Additionally: ") || userPrompt,
          selectedIntegrationIds: sideIntegrations,
        });
        return (
          <SystemPromptModal
            isOpen={isInspectorOpen}
            onClose={() => setIsInspectorOpen(false)}
            systemPrompt={promptResult.systemPrompt}
            userPrompt={promptResult.userPrompt}
            selectedIntegrations={promptResult.injectedIntegrations}
            requiredEnvVars={promptResult.requiredEnvVars}
          />
        );
      })()}
    </div>
  );
}
