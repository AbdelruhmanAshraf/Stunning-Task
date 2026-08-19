"use client";

import React from "react";
import {
  Zap,
  Layers,
  Terminal,
  ShieldCheck,
  Cpu,
  Workflow,
  Code2,
} from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: Terminal,
      title: "Zero-Latency System Prompt Injection",
      description:
        "Selected integrations are immediately compiled into strict architectural guidelines, API schemas, and security boundaries injected into the LLM system prompt.",
      accent: "text-violet-400",
      border: "border-violet-500/20 hover:border-violet-500/50",
    },
    {
      icon: Layers,
      title: "Interactive Live Sandbox",
      description:
        "Preview generated applications instantly with functioning simulated actions for Stripe checkout, Slack webhooks, and Google Sheets row synchronization.",
      accent: "text-cyan-400",
      border: "border-cyan-500/20 hover:border-cyan-500/50",
    },
    {
      icon: Code2,
      title: "Modular Next.js 15 Full-Stack Scaffolds",
      description:
        "Outputs production-ready App Router pages, Server Actions, route handlers, and type-safe integration configs with zero boilerplate.",
      accent: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/50",
    },
    {
      icon: Cpu,
      title: "Dual-Engine (Live LLM + Offline Vibe Engine)",
      description:
        "Test live with Google Gemini or OpenAI API keys, or run with the built-in High-Fidelity Local Vibe Engine with zero external dependencies.",
      accent: "text-amber-400",
      border: "border-amber-500/20 hover:border-amber-500/50",
    },
  ];

  return (
    <section id="features" className="section-wrapper relative">
      <div className="container-vibe space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            System Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Built for High-Velocity Vibe Coders
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            A unified stack engineered for builders who want to turn natural language intent into functional, integrated software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`glass-panel p-8 border border-slate-900/10 dark:border-white/10 rounded-2xl transition-all duration-300 ${item.border} space-y-4`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-900/10 dark:bg-slate-900 dark:border-white/10 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${item.accent}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
