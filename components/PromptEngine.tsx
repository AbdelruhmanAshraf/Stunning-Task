"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Terminal,
  Layers,
  Zap,
  ArrowRight,
  Eye,
  KeyRound,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { INTEGRATIONS_LIST, STARTER_PRESETS } from "@/lib/integrations";
import { IntegrationBadge } from "./IntegrationBadge";
import { SystemPromptModal } from "./SystemPromptModal";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptEngineProps {
  onGenerate: (data: {
    prompt: string;
    integrations: string[];
    model: string;
    apiKey: string;
  }) => void;
  isLoading: boolean;
}

export function PromptEngine({ onGenerate, isLoading }: PromptEngineProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const handleToggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectPreset = (preset: (typeof STARTER_PRESETS)[0]) => {
    setPrompt(preset.prompt);
    setSelectedIntegrations(preset.integrations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate({
      prompt: prompt.trim(),
      integrations: selectedIntegrations,
      model,
      apiKey: apiKey.trim(),
    });
  };

  const currentPromptData = buildSystemPrompt({
    userPrompt: prompt,
    selectedIntegrationIds: selectedIntegrations,
    model,
  });

  return (
    <section id="builder" className="section-wrapper relative">
      <div className="container-vibe">
        {/* Card Wrapper with BorderBeam */}
        <div className="glass-panel p-6 sm:p-8 lg:p-10 border border-slate-900/10 dark:border-white/10 shadow-2xl relative overflow-hidden rounded-2xl transition-colors">
          {/* Subtle Ambient Top Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 opacity-90" />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900/10 dark:border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                Vibe Prompt Engine
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Describe your application idea below and select your target dummy integrations.
              </p>
            </div>

            {/* Inspect System Prompt CTA */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsInspectorOpen(true)}
                className="btn-secondary-vibe text-xs py-2 px-3.5"
                title="View how integrations modify the system prompt"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Inspect System Prompt
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-violet-600/15 text-violet-800 dark:bg-violet-600/30 dark:text-violet-300 text-[10px] font-mono border border-violet-500/30 font-semibold">
                  {selectedIntegrations.length} Active
                </span>
              </button>
            </div>
          </div>

          {/* Skeleton loading state while generating */}
          {isLoading ? (
            <div className="mt-6 space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 border border-violet-200 dark:bg-violet-950/30 dark:border-violet-500/30 text-xs text-violet-800 dark:text-violet-300">
                <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>
                  <strong>Compiling System Context:</strong> Ingesting architectural guidelines for {selectedIntegrations.join(", ")} and synthesizing full-stack scaffold...
                </span>
              </div>

              {/* Skeleton Input Box */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>

              {/* Skeleton Presets */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>

              {/* Skeleton Badges */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="flex flex-wrap gap-2.5">
                  <Skeleton className="h-9 w-28 rounded-xl" />
                  <Skeleton className="h-9 w-32 rounded-xl" />
                  <Skeleton className="h-9 w-24 rounded-xl" />
                  <Skeleton className="h-9 w-36 rounded-xl" />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* 1. Prompt Input Box with BorderBeam */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label
                    htmlFor="prompt-input"
                    className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    What do you want to build?
                  </label>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {prompt.length} chars
                  </span>
                </div>

                <div className="relative group rounded-xl overflow-hidden">
                  <textarea
                    id="prompt-input"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Build an AI Subscription platform with Stripe billing, automated confirmation receipts via Gmail, and real-time conversion broadcasts on Slack..."
                    className="w-full bg-slate-50 border border-slate-900/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:bg-[#0c0e17] dark:border-white/15 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all resize-y min-h-[110px]"
                  />
                </div>
              </div>

              {/* 2. Starter Preset Templates */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                  Quick Starter Presets
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {STARTER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-900/10 hover:border-violet-500/40 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 dark:border-white/5 dark:hover:border-violet-500/40 text-left transition group flex flex-col justify-between shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-violet-700 dark:text-violet-300">
                          {preset.highlight}
                        </span>
                        <Zap className="w-3 h-3 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mt-1 font-normal">
                        {preset.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Dummy Integration Selector */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Select Dummy Integrations
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 lowercase">
                      (Injected into System Prompt)
                    </span>
                  </label>

                  {/* Clear / Select All */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => setSelectedIntegrations(INTEGRATIONS_LIST.map((i) => i.id))}
                      className="hover:text-slate-900 dark:hover:text-white transition"
                    >
                      Select All
                    </button>
                    <span>&bull;</span>
                    <button
                      type="button"
                      onClick={() => setSelectedIntegrations([])}
                      className="hover:text-slate-900 dark:hover:text-white transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Integration Badges Grid */}
                <div className="flex flex-wrap gap-2.5">
                  {INTEGRATIONS_LIST.map((integration) => (
                    <IntegrationBadge
                      key={integration.id}
                      integration={integration}
                      isSelected={selectedIntegrations.includes(integration.id)}
                      onToggle={handleToggleIntegration}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Model & Key Config */}
              <div className="pt-2 border-t border-slate-900/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Model Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Model:</span>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="bg-white border border-slate-900/10 dark:bg-slate-900 dark:border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-violet-500"
                    >
                      <option value="gemini-2.0-flash" className="bg-white dark:bg-[#141622]">Gemini 2.0 Flash (Recommended)</option>
                      <option value="gemini-1.5-pro" className="bg-white dark:bg-[#141622]">Gemini 1.5 Pro (Deep Reasoning)</option>
                      <option value="gemini-1.5-flash" className="bg-white dark:bg-[#141622]">Gemini 1.5 Flash</option>
                      <option value="gpt-4o" className="bg-white dark:bg-[#141622]">OpenAI GPT-4o</option>
                      <option value="local-vibe-engine" className="bg-white dark:bg-[#141622]">Local High-Fidelity Vibe Engine</option>
                    </select>
                  </div>

                  {/* API Key Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    {showKeyInput ? "Hide API Key" : "Custom API Key (Optional)"}
                  </button>
                </div>

                {/* Injected Status Pill */}
                <div className="text-xs text-cyan-700 dark:text-cyan-400/90 font-mono flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  {selectedIntegrations.length} Active System Context Rules
                </div>
              </div>

              {/* Optional API Key Input */}
              {showKeyInput && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-slate-950/80 dark:border-white/10 space-y-2 animate-fadeIn">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                    Custom AI API Key (Gemini or OpenAI)
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Optional. If left blank, the system automatically uses your server environment variables or our intelligent built-in streaming simulation engine!
                  </p>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy... / sk-..."
                    className="w-full bg-white border border-slate-900/10 text-slate-900 dark:bg-slate-900 dark:border-white/10 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-violet-500"
                  />
                </div>
              )}

              {/* 5. Submit Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  ⚡ Automatically synthesizes code, schema, and interactive mock state.
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="btn-primary-vibe w-full sm:w-auto px-8 py-3.5 text-sm font-bold tracking-wide shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Code2 className="w-4 h-4 text-cyan-300" />
                  Generate Full-Stack App
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* System Prompt Inspector Modal */}
      <SystemPromptModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        systemPrompt={currentPromptData.systemPrompt}
        userPrompt={prompt}
        selectedIntegrations={currentPromptData.injectedIntegrations}
        requiredEnvVars={currentPromptData.requiredEnvVars}
      />
    </section>
  );
}
