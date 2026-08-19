"use client";

import React from "react";
import { useAuiState, useAui } from "@assistant-ui/react";

export const useAssistantState = useAuiState;
export const useAssistantApi = useAui;

export function useMessage<T>(selector: (state: any) => T): T {
  return useAuiState((state: any) => selector(state.message ?? state));
}

export function AssistantIf({
  condition,
  children,
}: {
  condition: (state: any) => boolean;
  children: React.ReactNode;
}) {
  const matches = useAuiState((state: any) => {
    try {
      return Boolean(condition(state));
    } catch {
      return false;
    }
  });

  if (!matches) return null;
  return <>{children}</>;
}
