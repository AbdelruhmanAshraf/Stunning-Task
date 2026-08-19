"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
  Layers,
  CheckCircle2,
  Code,
  Key,
} from "lucide-react";
import { INTEGRATIONS_LIST, Integration } from "@/lib/integrations";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
};

export function IntegrationShowcase() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration>(
    INTEGRATIONS_LIST[0]
  );

  const Icon = ICON_MAP[selectedIntegration.icon] || CreditCard;

  return (
    <section id="integrations" className="section-wrapper relative">
      <div className="container-vibe space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Integrations Catalog & System Injections
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Pre-Engineered Integrations Ready to Inject
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Click any integration below to inspect the architectural constraints, system prompt guidelines, and mock payloads injected into the AI builder.
          </p>
        </div>

        {/* Integration Selector Grid & Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Integration Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {INTEGRATIONS_LIST.map((item) => {
              const ItemIcon = ICON_MAP[item.icon] || CreditCard;
              const isSelected = selectedIntegration.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedIntegration(item)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-white border-violet-500 shadow-md text-slate-900 dark:bg-slate-900 dark:border-violet-500/60 dark:text-white"
                      : "bg-white/80 hover:bg-white border-slate-900/10 hover:border-slate-900/20 text-slate-700 dark:bg-slate-900/40 dark:border-white/10 dark:hover:bg-slate-900/70 dark:hover:border-white/20 dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/5 border border-slate-900/10 dark:bg-white/5 dark:border-white/10"
                      style={{ color: item.accentHex }}
                    >
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    {item.envVars.length} keys
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Deep Dive Inspector (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 border border-slate-900/10 dark:border-white/10 rounded-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-900/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-900/5 border border-slate-900/10 dark:bg-white/5 dark:border-white/10"
                  style={{ color: selectedIntegration.accentHex }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedIntegration.name} Integration
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      ({selectedIntegration.category})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedIntegration.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Injected Guidelines */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                Injected Architectural Guidelines (System Prompt Rule)
              </span>
              <pre className="p-4 rounded-xl bg-slate-900 text-violet-200 border border-slate-900/20 dark:bg-slate-950 dark:border-white/10 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {selectedIntegration.systemPromptSnippet}
              </pre>
            </div>

            {/* Injected Environment Keys */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                Injected Environment Schema (.env.local)
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedIntegration.envVars.map((envKey, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-900/10 text-cyan-800 dark:bg-slate-950 dark:border-white/10 text-xs font-mono dark:text-cyan-300"
                  >
                    {envKey}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview Capabilities & Sample Payload */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Live Mock Sandbox Payload
              </span>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 border border-slate-900/20 dark:bg-slate-950 dark:border-white/10 font-mono text-xs leading-relaxed overflow-x-auto">
                {JSON.stringify(selectedIntegration.samplePayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
