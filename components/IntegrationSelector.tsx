"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { INTEGRATIONS_LIST, Integration } from "@/lib/integrations";
import {
  Search,
  Check,
  Layers,
  Sparkles,
  X,
  Plus,
  CreditCard,
  ShoppingBag,
  Mail,
  MessageSquare,
  Table,
  Database,
  GitBranch,
  Share2,
  CheckCircle2,
} from "lucide-react";

interface IntegrationSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

// Icon Helper mapping each integration to its authentic Lucide icon
export function getIntegrationIcon(id: string, className: string = "w-4 h-4") {
  switch (id) {
    case "stripe":
      return <CreditCard className={className} />;
    case "shopify":
      return <ShoppingBag className={className} />;
    case "gmail":
      return <Mail className={className} />;
    case "slack":
      return <MessageSquare className={className} />;
    case "sheets":
      return <Table className={className} />;
    case "supabase":
      return <Database className={className} />;
    case "github":
      return <GitBranch className={className} />;
    case "hubspot":
      return <Share2 className={className} />;
    default:
      return <Layers className={className} />;
  }
}

export function IntegrationSelector({
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
}: IntegrationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "payments", label: "Payments" },
    { id: "database", label: "Database" },
    { id: "e-commerce", label: "E-Commerce" },
    { id: "communication", label: "Communication" },
    { id: "productivity", label: "Productivity" },
    { id: "devops", label: "DevOps" },
  ];

  const filtered = INTEGRATIONS_LIST.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const selectedIntegrations = INTEGRATIONS_LIST.filter((i) =>
    selectedIds.includes(i.id)
  );

  const modalContent = isOpen && mounted ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Centered Dialog Box (Never clipped by any parent) */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d0f1a] border border-slate-900/10 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-scaleUp">
        {/* Header */}
        <div className="p-5 border-b border-slate-900/10 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/15 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Select Integrations & Services
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose native SDKs, APIs, and schemas to inject into the AI code generator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 bg-slate-50 dark:bg-[#111322] border-b border-slate-900/10 dark:border-white/5 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations (e.g. Stripe, Shopify, Supabase, Slack)..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0a0b12] border border-slate-900/10 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
              autoFocus
            />
          </div>

          {/* Categories & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? "bg-violet-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              <button
                type="button"
                onClick={onSelectAll}
                className="hover:text-violet-600 dark:hover:text-violet-400 transition"
              >
                Select All
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={onClearAll}
                className="hover:text-red-500 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="p-4 overflow-y-auto max-h-[380px] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-[#0d0f1a]">
          {filtered.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  isSelected
                    ? "bg-violet-500/10 border-violet-500/50 dark:bg-violet-500/15 dark:border-violet-500/60 shadow-sm ring-1 ring-violet-500/30"
                    : "bg-slate-50/50 dark:bg-[#121424] border-slate-900/10 dark:border-white/5 hover:border-violet-500/30 hover:bg-white dark:hover:bg-[#16182c]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Clean Rendered Lucide Icon */}
                  <div
                    style={{ backgroundColor: `${item.accentHex}20`, color: item.accentHex }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-xs"
                  >
                    {getIntegrationIcon(item.id, "w-5 h-5")}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ml-2 transition ${
                    isSelected
                      ? "bg-violet-600 border-violet-600 text-white shadow-xs"
                      : "border-slate-300 dark:border-slate-600 bg-white dark:bg-black/20"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#111322] border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {selectedIds.length} integration{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div>
      {/* Trigger Pills & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full text-xs font-semibold bg-violet-500/15 hover:bg-violet-500/25 text-violet-700 dark:text-violet-300 border border-violet-500/30 transition shadow-xs cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-violet-500" />
          <span>
            {selectedIds.length === 0 ? "+ Add Integrations" : "Manage Integrations"}
          </span>
          <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
            {selectedIds.length}
          </span>
        </button>

        {/* Selected Quick Badges */}
        {selectedIntegrations.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-700 dark:text-slate-300 shadow-xs"
          >
            <span style={{ color: item.accentHex }}>
              {getIntegrationIcon(item.id, "w-3.5 h-3.5")}
            </span>
            <span>{item.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(item.id);
              }}
              className="hover:text-red-500 ml-0.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full p-0.5 transition"
              title={`Remove ${item.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Render Dialog in Portal directly onto document.body */}
      {mounted && typeof document !== "undefined" && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </div>
  );
}
