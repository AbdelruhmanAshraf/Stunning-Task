"use client";

import React from "react";

export type BorderBeamSize = "sm" | "md" | "line" | "pulse-outside" | "pulse-inner";
export type BorderBeamTheme = "dark" | "light";
export type BorderBeamColorVariant = "colorful" | "mono" | "ocean" | "sunset";

export interface BorderBeamProps {
  children?: React.ReactNode;
  size?: BorderBeamSize;
  colorVariant?: BorderBeamColorVariant;
  borderWidth?: number;
  borderRadius?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function BorderBeam({
  children,
  colorVariant = "colorful",
  className = "",
  style,
}: BorderBeamProps) {
  return (
    <div className={`relative rounded-2xl p-[1.5px] overflow-hidden group ${className}`} style={style}>
      {/* Animated Glowing Conic Gradient Beam */}
      <div
        className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            colorVariant === "colorful"
              ? "conic-gradient(from 0deg at 50% 50%, #9333ea 0deg, #f43f5e 60deg, #06b6d4 140deg, #10b981 220deg, #8b24f5 300deg, #9333ea 360deg)"
              : "conic-gradient(from 0deg at 50% 50%, #8b24f5 0deg, #c084fc 120deg, #6366f1 240deg, #8b24f5 360deg)",
        }}
      />
      {/* Inner Container */}
      <div className="relative z-10 w-full h-full rounded-[15px] bg-[#0c0d15]">
        {children}
      </div>
    </div>
  );
}

export default BorderBeam;
