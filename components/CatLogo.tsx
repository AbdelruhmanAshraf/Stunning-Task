"use client";

import React from "react";

interface CatLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export function CatLogo({ className = "w-8 h-8", size = 32, showGlow = true }: CatLogoProps) {
  const pixelSize = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        minWidth: pixelSize,
        minHeight: pixelSize,
        maxWidth: pixelSize,
        maxHeight: pixelSize,
      }}
    >
      {showGlow && (
        <div className="absolute inset-0 bg-violet-600/50 blur-sm rounded-xl -z-10 group-hover:bg-violet-500/70 transition-all" />
      )}
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full rounded-[22%] shadow-sm block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="catBgGradReact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#8b24f5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="glassGradReact" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#181335" />
            <stop offset="100%" stopColor="#0a0718" />
          </linearGradient>
        </defs>

        {/* Purple Rounded Badge */}
        <rect width="200" height="200" rx="44" fill="url(#catBgGradReact)" />

        {/* Cat Silhouette */}
        <g id="cat-body-group">
          {/* Left Ear */}
          <polygon points="56,38 78,82 42,76" fill="#FFFFFF" />
          {/* Right Ear */}
          <polygon points="144,38 158,76 122,82" fill="#FFFFFF" />

          {/* Cat Head & Torso */}
          <path
            d="M 44,80 C 44,60 156,60 156,80 C 162,105 166,135 168,200 L 32,200 C 34,135 38,105 44,80 Z"
            fill="#FFFFFF"
          />

          {/* Cool Sunglasses Wraparound Frame */}
          <path
            d="M 36,92 C 36,82 164,82 164,92 C 164,118 135,134 105,124 C 102,123 98,123 95,124 C 65,134 36,118 36,92 Z"
            fill="url(#glassGradReact)"
            stroke="#1e1838"
            strokeWidth="3"
          />

          {/* Highlights */}
          <path
            d="M 48,90 Q 75,88 92,98"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 108,98 Q 125,88 152,90"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cat Nose */}
          <path d="M 96,138 L 104,138 L 100,143 Z" fill="#120c24" />

          {/* Cat Mouth */}
          <path
            d="M 100,143 L 100,147 M 94,149 Q 97,146 100,147 Q 103,146 106,149"
            stroke="#120c24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default CatLogo;
