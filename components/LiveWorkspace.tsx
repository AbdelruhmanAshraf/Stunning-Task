"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  GitGraph,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Activity,
  FileCode,
  Sparkles,
  Eye,
  KeyRound,
  ChevronDown,
  Send,
  Download,
} from "lucide-react";
import { INTEGRATIONS_LIST } from "@/lib/integrations";
import { GenerationResponse, GeneratedFile } from "@/lib/ai";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentPlanning } from "@/components/ui/agent-planning";
import { SystemPromptModal } from "./SystemPromptModal";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { IntegrationBadge } from "./IntegrationBadge";

interface LiveWorkspaceProps {
  generationData: GenerationResponse | null;
  rawStreamingOutput: string;
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
  onReset: () => void;
}

const CHIP_CLASS =
  "rounded-[36px] bg-slate-900/[0.04] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:bg-white/[0.05] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.08)]";

export function LiveWorkspace({
  generationData,
  rawStreamingOutput,
  isStreaming,
  selectedIntegrations,
  userPrompt,
  selectedModel,
  apiKey,
  onGenerate,
  onReset,
}: LiveWorkspaceProps) {
  // Tabs: Code Stream (default), AI Thinking & Planning, Architecture Flow, Raw Stream
  const [activeTab, setActiveTab] = useState<"code" | "planning" | "architecture" | "prompt">("code");
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);

  // Right-side Chat Sandbox Controls State
  const [sidePrompt, setSidePrompt] = useState<string>(userPrompt);
  const [sideIntegrations, setSideIntegrations] = useState<string[]>(selectedIntegrations);
  const [sideModel, setSideModel] = useState<string>(selectedModel || "gemini-2.0-flash");
  const [sideApiKey, setSideApiKey] = useState<string>(apiKey || "");
  const [showKeyDrawer, setShowKeyDrawer] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  useEffect(() => {
    setSidePrompt(userPrompt);
    setSideIntegrations(selectedIntegrations);
    if (selectedModel) setSideModel(selectedModel);
  }, [userPrompt, selectedIntegrations, selectedModel]);

  const matchedIntegrations = INTEGRATIONS_LIST.filter((i) =>
    sideIntegrations.includes(i.id)
  );

  const files: GeneratedFile[] = generationData?.files || [
    {
      filename: "app/page.tsx",
      language: "tsx",
      description: "Frontend page with injected integrations",
      content: rawStreamingOutput || "// Synthesizing Next.js scaffold...",
    },
  ];

  const handleToggleSideIntegration = (id: string) => {
    setSideIntegrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidePrompt.trim() || isStreaming) return;
    onGenerate({
      prompt: sidePrompt.trim(),
      integrations: sideIntegrations,
      model: sideModel,
      apiKey: sideApiKey.trim(),
    });
  };

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadZip = () => {
    const combined = files.map(f => `// ======================================\n// FILE: ${f.filename}\n// ======================================\n\n${f.content}`).join("\n\n");
    const blob = new Blob([combined], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stunning-vibe-app-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentPromptData = buildSystemPrompt({
    userPrompt: sidePrompt,
    selectedIntegrationIds: sideIntegrations,
    model: sideModel,
  });

  const quickRefinements = [
    "Add Stripe Subscription Checkout",
    "Inject Real-time Slack Webhook",
    "Add Supabase Database Storage",
    "Enable Dark & Light Theme Switcher",
  ];

  return (
    <section className="section-wrapper pt-4 pb-16 relative" id="workspace">
      <div className="container-vibe max-w-[1440px] mx-auto px-3 sm:px-6">
        {/* Studio Top Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-900/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {generationData?.simulatedState?.title || "Full-Stack AI Studio Workspace"}
                </h2>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                    isStreaming
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
                  {isStreaming ? "Synthesizing Tokens..." : "Generation Complete"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 max-w-xl">
                {userPrompt}
              </p>
            </div>
          </div>

          {/* Action buttons on top */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDownloadZip}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-900/10 hover:bg-slate-50 text-slate-700 dark:bg-white/[0.05] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 transition flex items-center gap-1.5 shadow-sm"
              title="Export all generated files"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Code</span>
            </button>
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-900/10 hover:bg-slate-50 text-slate-700 dark:bg-white/[0.05] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 transition flex items-center gap-1.5 shadow-sm"
              title="Start over with a brand new blueprint"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Blueprint</span>
            </button>
          </div>
        </div>

        {/* SPLIT STUDIO LAYOUT: Left = Code & Output Stage (70%), Right = Chat/Controls Sandbox (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT / MAIN CODE & OUTPUT AREA (8 cols / ~68%) ================= */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="glass-panel border border-slate-900/10 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden transition-all bg-white/95 dark:bg-[#0c0e18]">
              {/* Output Tabs Bar */}
              <div className="flex items-center justify-between border-b border-slate-900/10 dark:border-white/10 bg-slate-100/90 dark:bg-[#0a0c16] px-4 sm:px-6 gap-2 overflow-x-auto">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "code"
                        ? "border-violet-600 text-violet-700 bg-white dark:border-violet-400 dark:text-white dark:bg-white/5 shadow-xs"
                        : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    Multi-File Code Stream ({files.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("planning")}
                    className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "planning"
                        ? "border-violet-600 text-violet-700 bg-white dark:border-violet-400 dark:text-white dark:bg-white/5 shadow-xs"
                        : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-pulse" />
                    AI Thinking & Planning
                  </button>

                  <button
                    onClick={() => setActiveTab("architecture")}
                    className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "architecture"
                        ? "border-violet-600 text-violet-700 bg-white dark:border-violet-400 dark:text-white dark:bg-white/5 shadow-xs"
                        : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <GitGraph className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Architecture Flow
                  </button>

                  <button
                    onClick={() => setActiveTab("prompt")}
                    className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                      activeTab === "prompt"
                        ? "border-violet-600 text-violet-700 bg-white dark:border-violet-400 dark:text-white dark:bg-white/5 shadow-xs"
                        : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Raw AI Stream
                  </button>
                </div>
              </div>

              {/* ================= TAB 1: MULTI-FILE CODE STREAM VIEWER ================= */}
              {activeTab === "code" && (
                <div className="bg-slate-50 dark:bg-[#070913] flex flex-col md:flex-row min-h-[560px] transition-colors">
                  {/* File Sidebar */}
                  <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-slate-900/10 dark:border-white/10 p-3 space-y-1.5 bg-white/80 dark:bg-slate-950/60">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3 py-1.5">
                      Project Files
                    </div>
                    {files.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFileIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition ${
                          activeFileIndex === idx
                            ? "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30 font-semibold shadow-xs"
                            : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <FileCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <span className="truncate">{file.filename}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          {file.language}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Code Display Area */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900/10 dark:border-white/10 bg-slate-100/90 dark:bg-slate-900/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900 dark:text-white font-bold">
                          {files[activeFileIndex]?.filename}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] hidden sm:inline">
                          &bull; {files[activeFileIndex]?.description}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(files[activeFileIndex]?.content || "")}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 hover:bg-slate-50 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        {copiedFile ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        {copiedFile ? "Copied" : "Copy File"}
                      </button>
                    </div>

                    <div className="p-5 overflow-auto max-h-[620px] bg-slate-900 dark:bg-slate-950 font-mono text-xs leading-relaxed text-slate-200 dark:text-slate-300">
                      {isStreaming ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-cyan-400 text-xs mb-4">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Synthesizing file token stream...
                          </div>
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ) : (
                        <pre className="whitespace-pre">
                          <code>{files[activeFileIndex]?.content}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: AI THINKING & PLANNING ================= */}
              {activeTab === "planning" && (
                <div className="p-5 sm:p-7 bg-slate-50 dark:bg-[#070913] space-y-6 transition-colors">
                  <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Agent Thinking & Step-by-Step Planning Tree
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Step-by-step reasoning tree modeled after Lovable and Replit agent workflows.
                    </p>
                  </div>

                  <AgentPlanning
                    userPrompt={userPrompt}
                    selectedIntegrations={sideIntegrations}
                    generationData={generationData}
                    isStreaming={isStreaming}
                  />
                </div>
              )}

              {/* ================= TAB 3: ARCHITECTURE FLOW ================= */}
              {activeTab === "architecture" && (
                <div className="p-6 sm:p-8 bg-slate-50 dark:bg-[#070913] space-y-6 transition-colors">
                  <div className="text-center max-w-2xl mx-auto space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Full-Stack System Architecture Pipeline
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      How prompt inputs and third-party integrations synthesize into production-ready Next.js 15 apps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-2xl bg-white border border-slate-900/10 shadow-xs dark:bg-slate-900/80 dark:border-white/10">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-xs mb-2.5">
                        01
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">User Prompt & Intent</h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Captures requirements, styling preferences, and business workflows.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-violet-500/40 shadow-xs dark:bg-slate-900/80 dark:border-violet-500/40">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-xs mb-2.5">
                        02
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">System Prompt Injection</h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Injects {matchedIntegrations.length} third-party schemas, endpoints, and env variables.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-900/10 shadow-xs dark:bg-slate-900/80 dark:border-white/10">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs mb-2.5">
                        03
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">AI Multi-File Streaming</h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Synthesizes modular Next.js components, API route handlers, and type contracts.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-900/10 shadow-xs dark:bg-slate-900/80 dark:border-white/10">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs mb-2.5">
                        04
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">Full-Stack Scaffolding</h5>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Provides clean, fully-typed and production-ready code ready to copy or export.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: RAW AI STREAM ================= */}
              {activeTab === "prompt" && (
                <div className="p-5 sm:p-7 bg-slate-50 dark:bg-[#070913] space-y-4 transition-colors">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Full Markdown AI Output
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-900/20 dark:bg-slate-950 dark:border-white/10 font-mono text-xs max-h-[480px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                    {rawStreamingOutput || generationData?.rawOutput || "No output generated yet."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE PANEL / CHAT SANDBOX (4 cols / ~32%) ================= */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="glass-panel border border-slate-900/10 dark:border-white/10 shadow-2xl rounded-2xl p-5 bg-white/95 dark:bg-[#0d0f1b] backdrop-blur-xl space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">AI Sandbox & Chat</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect ({sideIntegrations.length})
                </button>
              </div>

              {/* Chat / Prompt Input Form */}
              <form onSubmit={handleSideSubmit} className="space-y-3.5">
                <div className="rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-[#131525] dark:border-white/10 p-3 space-y-2.5 focus-within:border-violet-500/60 transition-colors">
                  <textarea
                    value={sidePrompt}
                    onChange={(e) => setSidePrompt(e.target.value)}
                    placeholder="Enter refinement or new prompt..."
                    rows={3}
                    className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none resize-y min-h-[65px]"
                  />

                  {/* Model Selector & Key */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900/10 dark:border-white/5 text-xs">
                    <div className={`inline-flex items-center gap-1.5 h-6 px-2.5 text-[11px] text-slate-600 dark:text-slate-300 ${CHIP_CLASS}`}>
                      <span className="text-slate-500 dark:text-slate-400">Model:</span>
                      <select
                        value={sideModel}
                        onChange={(e) => setSideModel(e.target.value)}
                        className="bg-transparent text-slate-900 dark:text-white text-[11px] outline-none cursor-pointer font-medium"
                      >
                        <option value="gemini-2.0-flash" className="bg-white dark:bg-[#141622]">Gemini 2.0 Flash</option>
                        <option value="gemini-1.5-pro" className="bg-white dark:bg-[#141622]">Gemini 1.5 Pro</option>
                        <option value="gemini-1.5-flash" className="bg-white dark:bg-[#141622]">Gemini 1.5 Flash</option>
                        <option value="gpt-4o" className="bg-white dark:bg-[#141622]">GPT-4o</option>
                        <option value="local-vibe-engine" className="bg-white dark:bg-[#141622]">Local Vibe Engine</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                      className={`inline-flex items-center gap-1 h-6 px-2 text-[10px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition ${CHIP_CLASS}`}
                    >
                      <KeyRound className="w-3 h-3 text-violet-500" />
                      Key
                    </button>
                  </div>
                </div>

                {/* Optional Key Input */}
                {showKeyDrawer && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-[#131525] dark:border-white/10 text-xs space-y-1.5">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">API Key (Gemini or OpenAI)</span>
                    <input
                      type="password"
                      value={sideApiKey}
                      onChange={(e) => setSideApiKey(e.target.value)}
                      placeholder="AIzaSy... / sk-..."
                      className="w-full bg-white border border-slate-900/10 text-slate-900 placeholder-slate-400 dark:bg-[#0c0d15] dark:border-white/10 dark:text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-violet-500"
                    />
                  </div>
                )}

                {/* Injected Integrations Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Injected Integrations ({sideIntegrations.length})
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <button
                        type="button"
                        onClick={() => setSideIntegrations(INTEGRATIONS_LIST.map((i) => i.id))}
                        className="hover:text-slate-900 dark:hover:text-white transition"
                      >
                        All
                      </button>
                      <span>&bull;</span>
                      <button
                        type="button"
                        onClick={() => setSideIntegrations([])}
                        className="hover:text-slate-900 dark:hover:text-white transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {INTEGRATIONS_LIST.map((integration) => (
                      <IntegrationBadge
                        key={integration.id}
                        integration={integration}
                        isSelected={sideIntegrations.includes(integration.id)}
                        onToggle={handleToggleSideIntegration}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Refinements Suggestions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Quick Refinements
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickRefinements.map((refine, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSidePrompt((prev) => `${prev}. ${refine}`)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-900/5 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 dark:text-slate-300 transition text-left"
                      >
                        + {refine}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit / Iterate CTA */}
                <button
                  type="submit"
                  disabled={isStreaming || !sidePrompt.trim()}
                  className="w-full btn-primary-vibe text-xs py-3 px-4 font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isStreaming ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Synthesizing Web App...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Regenerate / Iterate Web App
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompt Inspector Modal */}
      <SystemPromptModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        systemPrompt={currentPromptData.systemPrompt}
        userPrompt={sidePrompt}
        selectedIntegrations={currentPromptData.injectedIntegrations}
        requiredEnvVars={currentPromptData.requiredEnvVars}
      />
    </section>
  );
}
