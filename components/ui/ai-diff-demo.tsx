"use client";

import React from "react";
import Component from "@/components/ui/ai-diff";

export default function DemoOne() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center bg-[#090b12] p-6 rounded-2xl border border-white/10">
      <div className="w-full max-w-xl">
        <Component
          lines={[
            { content: "const shouldReduceMotion = useReducedMotion();", kind: "context", number: 12 },
            { content: "", kind: "context", number: 13 },
            { content: '  transition={{ ease: "easeInOut", duration: 0.6 }}', kind: "removed", number: 14 },
            { content: "  transition={", kind: "added", number: 14 },
            { content: "    shouldReduceMotion", kind: "added", number: 15 },
            { content: "      ? { duration: 0 }", kind: "added", number: 16 },
            { content: '      : { type: "spring", duration: 0.25, bounce: 0.1 }', kind: "added", number: 17 },
            { content: "  }", kind: "added", number: 18 },
            { content: "", kind: "context", number: 19 },
          ]}
          title="components/card.tsx"
        />
      </div>
    </div>
  );
}
