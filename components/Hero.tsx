"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  ArrowRight,
  Eye,
  KeyRound,
  ChevronDown,
  Sparkles,
  Layers,
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { STARTER_PRESETS, INTEGRATIONS_LIST } from "@/lib/integrations";
import { IntegrationSelector } from "./IntegrationSelector";
import { SystemPromptModal } from "./SystemPromptModal";
import { buildSystemPrompt } from "@/lib/prompt-builder";

interface HeroProps {
  onGenerate: (data: {
    prompt: string;
    integrations: string[];
    model: string;
    apiKey: string;
  }) => void;
  isLoading: boolean;
}

const CHIP_CLASS =
  "rounded-[36px] bg-slate-900/[0.04] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:bg-white/[0.05] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_0_rgba(255,255,255,0.08)]";

export function Hero({ onGenerate, isLoading }: HeroProps) {
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
    <section
      id="sandbox"
      className="relative pt-24 sm:pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-[#07070d] transition-colors duration-300"
    >
      {/* Top-Right Spotlight Light Beam */}
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-violet-500/10 via-purple-500/[0.04] to-transparent dark:from-violet-500/15 dark:via-purple-600/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-violet-500/[0.08] dark:bg-violet-600/[0.12] blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="container-vibe flex flex-col items-center">
        {/* Crisp Clean Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 dark:from-violet-400 dark:via-purple-300 dark:to-cyan-400">
              Stunning
            </span>{" "}
            websites effortlessly
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Generate production-grade Next.js applications with native SDK integrations & live streamed code.
          </p>
        </div>

        {/* HERO SANDBOX: Uncluttered, Elegant Capsule Input Box */}
        <div className="w-full max-w-3xl mx-auto">
          <BorderBeam size="md" colorVariant="colorful">
            <div className="w-full rounded-3xl bg-white/95 border border-slate-900/[0.07] dark:bg-[#0d0e17]/90 dark:border-white/[0.12] shadow-2xl backdrop-blur-xl p-4 sm:p-5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Clean Prompt Area */}
                <div className="rounded-2xl bg-slate-50 border border-slate-900/[0.07] dark:bg-[#131522] dark:border-white/[0.09] p-4 space-y-3 focus-within:border-violet-500/60 transition-colors">
                  {/* Top Bar with Minimal Header & Inspector */}
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-900/[0.05] dark:border-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-violet-500/15 text-violet-600 dark:text-violet-300">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                        Describe your dream web app
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsInspectorOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-700 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Prompt ({selectedIntegrations.length})</span>
                    </button>
                  </div>

                  {/* Textarea Prompt */}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Type your idea (e.g. Build an AI-powered SaaS dashboard with Stripe subscriptions)..."
                    rows={3}
                    className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none resize-none min-h-[70px] leading-relaxed"
                  />

                  {/* Clean Integrations Picker Row */}
                  <div className="pt-2 border-t border-slate-900/[0.05] dark:border-white/[0.05]">
                    <IntegrationSelector
                      selectedIds={selectedIntegrations}
                      onToggle={handleToggleIntegration}
                      onSelectAll={() =>
                        setSelectedIntegrations(INTEGRATIONS_LIST.map((i) => i.id))
                      }
                      onClearAll={() => setSelectedIntegrations([])}
                    />
                  </div>
                </div>

                {/* Optional Custom API Key Drawer */}
                {showKeyInput && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-900/[0.07] dark:bg-[#131522] dark:border-white/[0.08] text-xs space-y-1.5 animate-fadeIn">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Custom API Key (Gemini or OpenAI)
                    </span>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="AIzaSy... / sk-..."
                      className="w-full bg-white border border-slate-900/10 text-slate-900 placeholder-slate-400 dark:bg-[#0c0d15] dark:border-white/10 dark:text-white dark:placeholder-slate-600 rounded-lg px-3 py-2 text-xs outline-none focus:border-violet-500"
                    />
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Model Selector Chip */}
                    <div
                      className={`inline-flex items-center gap-1.5 h-8 px-3 text-xs text-slate-600 dark:text-slate-300 ${CHIP_CLASS}`}
                    >
                      <span className="text-slate-500 dark:text-slate-400">Model:</span>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="bg-transparent text-slate-900 dark:text-white text-xs outline-none cursor-pointer font-medium"
                      >
                        <option value="gemini-2.0-flash" className="bg-white dark:bg-[#141622]">
                          Gemini 2.0 Flash
                        </option>
                        <option value="gemini-1.5-pro" className="bg-white dark:bg-[#141622]">
                          Gemini 1.5 Pro
                        </option>
                        <option value="gemini-1.5-flash" className="bg-white dark:bg-[#141622]">
                          Gemini 1.5 Flash
                        </option>
                        <option value="gpt-4o" className="bg-white dark:bg-[#141622]">
                          GPT-4o
                        </option>
                        <option value="local-vibe-engine" className="bg-white dark:bg-[#141622]">
                          Local Vibe Engine
                        </option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>

                    {/* API Key Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowKeyInput(!showKeyInput)}
                      className={`inline-flex items-center gap-1 h-8 px-3 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition ${CHIP_CLASS}`}
                    >
                      <KeyRound className="w-3 h-3 text-violet-500 dark:text-violet-400" />
                      <span>{showKeyInput ? "Hide Key" : "Custom Key"}</span>
                    </button>
                  </div>

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="btn-primary-vibe text-xs py-2.5 px-6 font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Code2 className="w-4 h-4 text-cyan-300" />
                        <span>Generate Web App</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </BorderBeam>
        </div>

        {/* Preset Starter Ideas */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {STARTER_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-violet-500/40 dark:hover:border-violet-500/40 hover:bg-slate-50 dark:hover:bg-white/10 transition shadow-xs"
            >
              {preset.title}
            </button>
          ))}
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
