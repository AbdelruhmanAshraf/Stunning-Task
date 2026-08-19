"use client";

import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  Check,
  Search,
  FileText,
  BrainCircuit,
  AlertTriangle,
  Code,
  TerminalSquare,
} from "lucide-react";

import { INTEGRATIONS_LIST } from "@/lib/integrations";
import { GenerationResponse } from "@/lib/ai";

export type PlanStepStatus = "pending" | "active" | "success" | "error";

export interface PlanStep {
  id: string;
  title: string;
  content?: React.ReactNode;
  status: PlanStepStatus;
  icon?: React.ReactNode;
  duration?: string;
  defaultExpanded?: boolean;
}

export interface AgentPlanningProps {
  title?: string;
  steps?: PlanStep[];
  className?: string;
  userPrompt?: string;
  selectedIntegrations?: string[];
  generationData?: GenerationResponse | null;
  isStreaming?: boolean;
}

export const DEFAULT_STEPS: PlanStep[] = [
  {
    id: "1",
    title: "Analyze request and extract constraints",
    status: "success",
    duration: "0.4s",
    icon: <Search className="w-3.5 h-3.5" />,
    content: (
      <div className="space-y-2 font-mono text-[11px] text-slate-400 mt-2">
        <div className="flex items-start gap-2 text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>Parsed user intent: Build full-stack vibe application</span>
        </div>
        <div className="grid grid-cols-[90px_1fr] gap-1.5 mt-3 bg-slate-900/60 p-2.5 rounded-md border border-white/10">
          <span className="text-slate-400 font-medium">Framework:</span>
          <span className="text-white">Next.js 15, React 19, TypeScript</span>

          <span className="text-slate-400 font-medium">Styling:</span>
          <span className="text-white">Tailwind CSS (Obsidian / Neon Violet)</span>

          <span className="text-slate-400 font-medium">Constraints:</span>
          <span className="text-amber-400">Context Injection, Mock API Simulation</span>
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: "Search UI knowledge base & Injected SDKs",
    status: "success",
    duration: "1.2s",
    icon: <FileText className="w-3.5 h-3.5" />,
    content: (
      <div className="space-y-3 font-mono text-[11px] mt-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Executing tool:</span>
          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold flex items-center gap-1">
            <TerminalSquare className="w-3 h-3" />
            integration_vector_search
          </span>
        </div>
        <div className="p-3 rounded-md bg-slate-900/80 border border-white/10 shadow-sm text-slate-300">
          <div className="text-emerald-400 mb-2 font-semibold">
            Success: Injected 4 third-party architectural patterns
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-slate-400">
            <li>Stripe PaymentIntent webhooks & checkout flow</li>
            <li>Slack Block Kit rich notification payload</li>
            <li>Tailwind CSS responsive glassmorphism timeline</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "Synthesize full-stack component logic",
    status: "success",
    duration: "1.4s",
    icon: <BrainCircuit className="w-3.5 h-3.5" />,
    defaultExpanded: true,
    content: (
      <div className="space-y-3 font-mono text-[11px] mt-2">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>Synthesized full-stack component tree & API dispatchers</span>
        </div>

        <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 p-3.5 shadow-inner">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-70" />
          <div className="text-slate-300 space-y-1.5 leading-relaxed">
            <div>
              <span className="text-purple-400">const</span>{" "}
              <span className="text-blue-300">appArchitecture</span> ={" "}
              <span className="text-yellow-300">useMemo</span>(...)
            </div>
            <div className="pl-4 text-slate-400">&bull; Injected dynamic API routes at /api/integrations</div>
            <div className="pl-4 text-slate-400">&bull; Compiled live reactive sandbox & telemetry listeners</div>
            <div className="pl-4 text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              All component trees hydrated successfully
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "4",
    title: "Verify security & dependency bounds",
    status: "success",
    duration: "0.5s",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    content: (
      <div className="space-y-2 font-mono text-[11px] mt-2">
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Environment variable schema validated
          </div>
          <div className="text-emerald-300/80 leading-relaxed">
            All required integration keys and fallback mock adapters were correctly injected with zero secret leaks.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "5",
    title: "Execute final rendering in Live Preview Sandbox",
    status: "success",
    duration: "0.3s",
    icon: <Code className="w-3.5 h-3.5" />,
    content: (
      <div className="space-y-2 font-mono text-[11px] mt-2">
        <div className="p-3 rounded-md bg-slate-900/80 border border-white/10">
          <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Live Preview Sandbox Ready
          </div>
          <div className="text-slate-400">
            Rendered interactive UI with live trigger dispatches and zero external credentials needed.
          </div>
        </div>
      </div>
    ),
  },
];

export function buildDynamicSteps({
  userPrompt,
  selectedIntegrations = [],
  generationData,
  isStreaming = false,
}: {
  userPrompt?: string;
  selectedIntegrations?: string[];
  generationData?: GenerationResponse | null;
  isStreaming?: boolean;
}): PlanStep[] {
  const matched = INTEGRATIONS_LIST.filter((i) => selectedIntegrations.includes(i.id));
  const promptText = userPrompt?.trim() || "Full-stack vibe application prototype";
  const appTitle = generationData?.simulatedState?.title || "AI Generated Application";
  const files = generationData?.files || [];
  const envVars = generationData?.envVars || [];

  return [
    {
      id: "1",
      title: "Analyze request & extract architecture constraints",
      status: "success",
      duration: "0.3s",
      icon: <Search className="w-3.5 h-3.5" />,
      defaultExpanded: true,
      content: (
        <div className="space-y-2 font-mono text-[11px] text-slate-300 mt-2">
          <div className="flex items-start gap-2 text-emerald-400 font-medium">
            <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Parsed Prompt: &ldquo;{promptText}&rdquo;</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1.5 mt-2 bg-slate-900/80 p-3 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-400 font-medium">Application:</span>
            <span className="text-white font-semibold">{appTitle}</span>

            <span className="text-slate-400 font-medium">Framework:</span>
            <span className="text-cyan-300">Next.js 15 (App Router), React 19, TypeScript</span>

            <span className="text-slate-400 font-medium">Integrations:</span>
            <span className="text-violet-300">
              {matched.length > 0
                ? matched.map((m) => m.name).join(", ")
                : "Standalone Mode (In-Memory State)"}
            </span>

            <span className="text-slate-400 font-medium">Styling & UX:</span>
            <span className="text-emerald-300">Obsidian & Neon Glassmorphism (Tailwind CSS)</span>
          </div>
        </div>
      ),
    },
    {
      id: "2",
      title: "Search UI knowledge base & Injected SDK blueprints",
      status: "success",
      duration: "0.9s",
      icon: <FileText className="w-3.5 h-3.5" />,
      defaultExpanded: true,
      content: (
        <div className="space-y-3 font-mono text-[11px] mt-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Loaded Blueprint Adapters:</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5">
              <TerminalSquare className="w-3 h-3" />
              {matched.length > 0 ? `${matched.length} Active SDKs Injected` : "Core UI Kit Loaded"}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-white/10 shadow-sm text-slate-300">
            <div className="text-emerald-400 mb-2 font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Architectural injection verified for {matched.length} provider(s):
            </div>
            {matched.length > 0 ? (
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {matched.map((m) => (
                  <li key={m.id}>
                    <span className="text-white font-medium">{m.name}:</span>{" "}
                    <span className="text-slate-400">{m.tagline}</span>{" "}
                    <span className="text-violet-400 text-[10px]">({m.category} Module)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400 text-xs">
                Injected responsive Tailwind layout primitives, reactive client states, and mock event pipelines.
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "3",
      title: isStreaming
        ? "Synthesizing full-stack component logic & routes..."
        : `Synthesized full-stack component logic (${files.length || 3} files)`,
      status: isStreaming ? "active" : "success",
      duration: isStreaming ? "streaming..." : "1.3s",
      icon: <BrainCircuit className="w-3.5 h-3.5" />,
      defaultExpanded: true,
      content: (
        <div className="space-y-3 font-mono text-[11px] mt-2">
          {isStreaming ? (
            <div className="flex items-center gap-2 text-violet-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Streaming token generation & compiling mock dispatchers...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Generated {files.length || 3} production files with typed dispatchers:</span>
            </div>
          )}

          <div className="relative rounded-lg overflow-hidden bg-black/70 border border-white/10 p-3.5 shadow-inner">
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                isStreaming
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500"
              } opacity-80`}
            />
            <div className="space-y-2 text-slate-300 leading-relaxed">
              {files.length > 0 ? (
                files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                    <span className="text-cyan-300 font-semibold">{file.filename}</span>
                    <span className="text-slate-400 text-[11px]">{file.description}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="text-cyan-300 font-semibold">app/page.tsx &bull; Interactive UI & State Container</div>
                  <div className="text-cyan-300 font-semibold">app/api/integrations/route.ts &bull; Dynamic Integration Dispatcher</div>
                  <div className="text-cyan-300 font-semibold">lib/integrations-config.ts &bull; Typed Configuration & Security Schema</div>
                </>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "4",
      title: "Verify security bounds & environment schema",
      status: isStreaming ? "pending" : "success",
      duration: isStreaming ? undefined : "0.4s",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      defaultExpanded: !isStreaming,
      content: (
        <div className="space-y-2 font-mono text-[11px] mt-2">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Environment variables & mock fallbacks verified ({envVars.length} keys)
            </div>
            <div className="text-emerald-300/80 leading-relaxed text-xs">
              {envVars.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {envVars.map((env) => (
                    <span key={env} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      {env}
                    </span>
                  ))}
                </div>
              ) : (
                "Zero external secret dependencies required. All dispatchers run with instant mock adapters."
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "5",
      title: "Execute final rendering in Live Preview Sandbox",
      status: isStreaming ? "pending" : "success",
      duration: isStreaming ? undefined : "0.2s",
      icon: <Code className="w-3.5 h-3.5" />,
      defaultExpanded: !isStreaming,
      content: (
        <div className="space-y-2 font-mono text-[11px] mt-2">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-white/10">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Sandbox Container Mounted & Live
            </div>
            <div className="text-slate-300 text-xs">
              Preview reachable at{" "}
              <span className="text-cyan-300 font-mono">
                https://stunning-app.local/{appTitle.toLowerCase().replace(/\s+/g, "-")}
              </span>
              . Interactive dispatcher is ready for immediate live telemetry testing.
            </div>
          </div>
        </div>
      ),
    },
  ];
}

export const AgentPlanning: React.FC<AgentPlanningProps> = ({
  title,
  steps,
  className = "",
  userPrompt,
  selectedIntegrations,
  generationData,
  isStreaming,
}) => {
  const [isMainExpanded, setIsMainExpanded] = useState(true);

  // Compute effective steps based on incoming project props if custom steps are not passed
  const effectiveSteps = React.useMemo(() => {
    if (steps) return steps;
    if (userPrompt || selectedIntegrations || generationData || isStreaming !== undefined) {
      return buildDynamicSteps({
        userPrompt,
        selectedIntegrations,
        generationData,
        isStreaming,
      });
    }
    return DEFAULT_STEPS;
  }, [steps, userPrompt, selectedIntegrations, generationData, isStreaming]);

  // Track expanded state of individual step details
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(() =>
    effectiveSteps.reduce((acc, step) => {
      acc[step.id] = step.defaultExpanded || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Sync expanded steps whenever effectiveSteps change
  React.useEffect(() => {
    setExpandedSteps((prev) => {
      const next = { ...prev };
      effectiveSteps.forEach((step) => {
        if (next[step.id] === undefined) {
          next[step.id] = step.defaultExpanded || false;
        }
      });
      return next;
    });
  }, [effectiveSteps]);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const toggleStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasActive = effectiveSteps.some((s) => s.status === "active");
  const allSuccess = effectiveSteps.every((s) => s.status === "success");
  const completedCount = effectiveSteps.filter((s) => s.status === "success").length;

  const displayTitle =
    title ||
    (generationData?.simulatedState?.title
      ? `AI Thinking & Planning &bull; ${generationData.simulatedState.title}`
      : "AI Thinking & Planning Phase (Replit / Lovable Mode)");

  const getStatusColor = (status: PlanStepStatus) => {
    switch (status) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30";
      case "active":
        return "bg-violet-500/20 text-violet-400 ring-violet-500/40";
      case "error":
        return "bg-rose-500/20 text-rose-400 ring-rose-500/30";
      case "pending":
        return "bg-slate-800/60 text-slate-400 ring-white/10";
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto my-3 font-sans text-slate-900 dark:text-slate-100 ${className}`}>
      {/* Outer Card Container */}
      <div className="bg-white/90 border border-slate-900/10 shadow-xl dark:bg-[#0b0d17]/90 dark:border-white/10 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300">
        {/* Top Header / Trigger Badge */}
        <div
          onClick={() => setIsMainExpanded(!isMainExpanded)}
          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors select-none ${
            isMainExpanded
              ? "bg-slate-100/60 border-b border-slate-900/10 dark:bg-white/[0.03] dark:border-white/[0.08]"
              : "hover:bg-slate-100/40 dark:hover:bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-5 h-5">
              {hasActive ? (
                <Loader2 className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-spin" />
              ) : allSuccess ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <BrainCircuit className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </div>

            <span className="text-[14px] font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{displayTitle}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                  allSuccess
                    ? "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold"
                    : "bg-violet-500/15 text-violet-800 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30"
                }`}
              >
                {completedCount}/{effectiveSteps.length} completed
              </span>
            </span>
          </div>

          <div className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-900/5 text-slate-500 dark:hover:bg-white/10 dark:text-slate-400 transition-colors">
            {isMainExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Expandable Main Timeline Area */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isMainExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div ref={mainContentRef} className="p-4 sm:p-5 flex flex-col">
              {effectiveSteps.map((step, index) => {
                const isStepExpanded = expandedSteps[step.id];
                const isLast = index === effectiveSteps.length - 1;

                return (
                  <div
                    key={step.id}
                    className={`relative flex gap-4 ${
                      step.status === "pending" ? "opacity-50" : "opacity-100"
                    }`}
                  >
                    {/* Timeline connecting line */}
                    {!isLast && (
                      <div className="absolute left-[11px] top-7 bottom-[-10px] w-[2px] bg-slate-900/10 dark:bg-white/10 z-0" />
                    )}

                    {/* Icon Column */}
                    <div className="relative z-10 flex-none w-6 h-6 mt-0.5">
                      <div
                        className={`flex items-center justify-center w-full h-full rounded-full ring-2 ring-white dark:ring-[#0b0d17] transition-colors duration-300 ${getStatusColor(
                          step.status
                        )}`}
                      >
                        {step.status === "success" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : step.status === "active" ? (
                          <Loader2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 animate-spin" />
                        ) : (
                          step.icon || <TerminalSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 pb-5">
                      {/* Step Header */}
                      <div
                        className={`flex items-center justify-between group rounded-md -mx-2 px-2 py-1 transition-colors ${
                          step.content ? "cursor-pointer hover:bg-slate-900/5 dark:hover:bg-white/[0.04]" : ""
                        }`}
                        onClick={(e) => step.content && toggleStep(step.id, e)}
                      >
                        <span
                          className={`text-[13px] tracking-tight transition-colors duration-200 ${
                            step.status === "active"
                              ? "text-violet-700 dark:text-white font-semibold"
                              : step.status === "error"
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
                              : "text-slate-800 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-white font-medium"
                          }`}
                        >
                          {step.title}
                        </span>

                        <div className="flex items-center gap-3">
                          {step.duration && (
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                              {step.duration}
                            </span>
                          )}
                          {step.content && (
                            <div className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                              {isStepExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step Expanded Content */}
                      {step.content && (
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isStepExpanded ? "grid-rows-[1fr] mt-1.5 opacity-100" : "grid-rows-[0fr] mt-0 opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="pt-1 pb-1">{step.content}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPlanning;
