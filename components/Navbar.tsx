"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { CatLogo } from "./CatLogo";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4 pointer-events-none transition-all duration-300">
      {/* Apple Glass Pill Container */}
      <div
        className={`w-full max-w-4xl rounded-full border transition-all duration-300 pointer-events-auto px-4 sm:px-6 py-2.5 flex items-center justify-between ${
          scrolled
            ? "bg-white/80 border-slate-900/[0.10] shadow-[0_12px_40px_rgba(15,23,42,0.10),inset_0_1px_0_0_rgba(255,255,255,0.9)] dark:bg-[#0a0c16]/75 dark:border-white/[0.14] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl backdrop-saturate-150"
            : "bg-white/60 border-slate-900/[0.07] shadow-[0_8px_32px_rgba(15,23,42,0.06),inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:bg-[#0b0e1a]/60 dark:border-white/[0.10] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150"
        }`}
      >
        {/* Brand Logo without Vibe Coder pill */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <CatLogo size={28} />
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
              Stunning
            </span>
          </a>
        </div>

        {/* Navigation Links with smooth pill hover effects */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#sandbox"
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-900/[0.05] dark:hover:text-white dark:hover:bg-white/[0.08] transition-all"
          >
            Sandbox
          </a>
          <a
            href="#integrations"
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-900/[0.05] dark:hover:text-white dark:hover:bg-white/[0.08] transition-all"
          >
            Integrations
          </a>
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full hover:text-slate-900 hover:bg-slate-900/[0.05] dark:hover:text-white dark:hover:bg-white/[0.08] transition-all"
          >
            Features
          </a>
          <a
            href="/builder"
            className="px-3 py-1 rounded-full text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 font-semibold transition-all inline-flex items-center gap-1"
          >
            Cloud Builder
          </a>
        </nav>

        {/* Right: Theme Switcher + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="#sandbox"
            className="btn-primary-vibe hidden sm:flex text-xs py-1.5 px-4 rounded-full shadow-sm items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            Build Now
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full bg-slate-900/[0.04] border border-slate-900/[0.10] text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown card with matching Apple glass effect */}
      {mobileMenuOpen && (
        <div className="w-full max-w-4xl mt-2 rounded-2xl border border-slate-900/[0.10] bg-white/90 dark:border-white/[0.12] dark:bg-[#0b0e1a]/85 backdrop-blur-2xl shadow-2xl p-4 space-y-2 pointer-events-auto md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#sandbox"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] font-medium text-sm transition-colors"
          >
            AI Sandbox
          </a>
          <a
            href="#integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] font-medium text-sm transition-colors"
          >
            Integrations Matrix
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] font-medium text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.08] font-medium text-sm transition-colors"
          >
            Architecture
          </a>

          {/* Appearance switcher row */}
          <div className="pt-1 border-t border-slate-900/[0.08] dark:border-white/[0.08]">
            <ThemeToggle variant="row" />
          </div>

          <div className="pt-1">
            <a
              href="#sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary-vibe w-full text-center text-xs py-2.5 rounded-full block"
            >
              Start Building
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
