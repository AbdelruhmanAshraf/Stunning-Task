"use client";

import React from "react";
import { AgentPlanning } from "@/components/ui/agent-planning";

export default function AIPlanningDemo() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center bg-black p-4 sm:p-8">
      <AgentPlanning />
    </div>
  );
}

export { AIPlanningDemo };
