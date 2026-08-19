"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  /** "pill" = compact icon button for the nav bar. "row" = full-width labelled row for the mobile menu. */
  variant?: "pill" | "row";
  className?: string;
}

export function ThemeToggle({ variant = "pill", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";
  const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={nextLabel}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] transition-colors ${className}`}
      >
        <span className="flex items-center gap-2.5">
          {mounted && isDark ? (
            <Moon className="w-4 h-4 text-violet-500 dark:text-violet-300" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          Appearance
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {mounted ? (isDark ? "Dark" : "Light") : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      title={nextLabel}
      aria-pressed={mounted ? isDark : undefined}
      className={`relative w-8 h-8 shrink-0 inline-flex items-center justify-center rounded-full border border-slate-900/[0.10] bg-slate-900/[0.04] text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.08] dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.12] transition-colors ${className}`}
    >
      {/* Both icons are rendered so the swap is a pure CSS cross-fade — no layout shift, no hydration mismatch. */}
      <Sun
        className="absolute w-4 h-4 text-amber-500 transition-all duration-300 rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0"
        aria-hidden="true"
      />
      <Moon
        className="absolute w-4 h-4 text-violet-300 transition-all duration-300 rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
