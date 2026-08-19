"use client";

import React from "react";
import {
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
  Check,
  Plus,
} from "lucide-react";
import { Integration } from "@/lib/integrations";

interface IntegrationBadgeProps {
  integration: Integration;
  isSelected: boolean;
  onToggle: (id: string) => void;
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

export function IntegrationBadge({ integration, isSelected, onToggle }: IntegrationBadgeProps) {
  const Icon = ICON_MAP[integration.icon] || Plus;

  return (
    <button
      type="button"
      onClick={() => onToggle(integration.id)}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 select-none border text-left ${
        isSelected
          ? "bg-violet-100/80 text-violet-950 border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.14)] dark:bg-slate-900/90 dark:text-white dark:border-violet-500/80 dark:shadow-[0_0_15px_rgba(139,92,246,0.18)]"
          : "bg-white border-slate-900/10 text-slate-700 hover:bg-slate-50 hover:border-slate-900/20 hover:text-slate-900 dark:bg-slate-900/50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:border-white/20 dark:hover:text-white"
      }`}
      title={`${integration.name}: ${integration.tagline}`}
    >
      {/* Icon with refined background */}
      <div
        className="w-5 h-5 rounded-lg flex items-center justify-center transition-colors bg-slate-900/5 dark:bg-white/[0.06]"
        style={{
          color: integration.accentHex,
        }}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Name */}
      <span className="font-medium text-xs text-slate-900 dark:text-slate-200">{integration.name}</span>

      {/* Check or Plus status */}
      <div
        className={`ml-0.5 w-4 h-4 rounded-md flex items-center justify-center transition-all ${
          isSelected
            ? "bg-violet-600 text-white"
            : "bg-slate-900/5 text-slate-500 dark:bg-white/5 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
        }`}
      >
        {isSelected ? (
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        ) : (
          <Plus className="w-2.5 h-2.5" />
        )}
      </div>
    </button>
  );
}
