"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Terminal,
  Eye,
  ShieldAlert,
  Cpu,
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
  Layers,
} from "lucide-react";
import { Integration } from "@/lib/integrations";

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemPrompt: string;
  userPrompt: string;
  selectedIntegrations: Integration[];
  requiredEnvVars: string[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
};

export function SystemPromptModal({
  isOpen,
  onClose,
  systemPrompt,
  userPrompt,
  selectedIntegrations,
  requiredEnvVars,
}: SystemPromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md dark:bg-black/80 animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[85vh] bg-white border border-slate-900/15 dark:bg-[#0c0e17] dark:border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900/10 bg-slate-100/80 dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                System Prompt Inspector
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 border border-cyan-500/30 font-semibold dark:bg-cyan-500/20 dark:text-cyan-300">
                  {selectedIntegrations.length} Injected Integration{selectedIntegrations.length === 1 ? "" : "s"}
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Transparent view of how selected integrations alter the LLM&apos;s system context.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 hover:bg-slate-50 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? "Copied Prompt" : "Copy Prompt"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white border border-slate-900/10 hover:bg-slate-100 text-slate-500 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 dark:hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Summary Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-slate-900/50 dark:border-white/5">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active Integrations</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {selectedIntegrations.length > 0 ? (
                  selectedIntegrations.map((i) => {
                    const Icon = ICON_MAP[i.icon] || Layers;
                    return (
                      <span
                        key={i.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-md bg-white border border-slate-900/10 text-slate-800 dark:bg-white/[0.05] dark:border-white/10 dark:text-slate-200 font-medium"
                      >
                        <Icon className="w-3 h-3" style={{ color: i.accentHex }} />
                        {i.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-500 italic">None selected (Zero-dep mode)</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-slate-900/50 dark:border-white/5">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Injected Environment Keys</div>
              <div className="mt-1 text-xs text-indigo-700 dark:text-indigo-300 font-mono font-semibold">
                {requiredEnvVars.length > 0 ? `${requiredEnvVars.length} variables defined` : "None"}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-900/10 dark:bg-slate-900/50 dark:border-white/5">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Injection Status</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Verified Active & Live
              </div>
            </div>
          </div>

          {/* User Prompt Context */}
          <div>
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              User Prompt (Payload)
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-900/10 text-slate-800 dark:bg-slate-950/80 dark:border-white/10 dark:text-slate-300 font-mono text-xs leading-relaxed">
              {userPrompt || "<No prompt entered yet>"}
            </div>
          </div>

          {/* Full Injected System Prompt */}
          <div>
            <label className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
              Exact Injected System Prompt (Sent to LLM)
            </label>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-900 text-violet-200 border border-slate-900/20 dark:bg-slate-950 dark:border-violet-500/20 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[340px] overflow-y-auto">
                {systemPrompt}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-900/10 bg-slate-100/90 dark:border-white/10 dark:bg-slate-900/80 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
          <span>Stunning Prompt Builder &bull; Dynamic Context Injection</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
