"use client";

import React from "react";
import { Terminal, FileText, Cpu } from "lucide-react";
import { CatLogo } from "./CatLogo";

export function Footer() {
  return (
    <footer className="border-t border-slate-900/10 bg-slate-100/90 dark:border-white/10 dark:bg-[#07080f] py-12 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="container-vibe space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <CatLogo size={28} showGlow={false} />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Stunning Vibe Coder</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Candidate Task &bull; Full-Stack Vibe Coder (Builder Mindset)
              </p>
            </div>
          </div>

          {/* Submission Documentation Badges */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#sandbox"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 hover:border-violet-500/40 text-slate-700 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white transition"
            >
              <Terminal className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              Live AI Builder
            </a>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
              <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              DECISIONS.md
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-900/10 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              TECH.md
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900/10 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-600 dark:text-slate-400">
            Crafted for <span className="text-slate-900 dark:text-white font-semibold">Stunning.so</span> by Candidate. Built with Next.js 15, React 19, TypeScript & Tailwind CSS.
          </p>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Submission Date: August 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
