import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createOpenAI,
  type OpenAIResponsesProviderOptions,
} from "@ai-sdk/openai";
import {
  stepCountIs,
  streamText,
  type UIMessage,
  type ToolSet,
  convertToModelMessages,
} from "ai";

export type LlmProviderName = "gemini" | "openai" | "anthropic";

const getProviderName = (override?: string): LlmProviderName => {
  const value = (override ?? process.env["LLM_PROVIDER"])?.toLowerCase().trim();
  if (value === "anthropic" || value === "claude") return "anthropic";
  if (value === "openai" || value === "gpt") return "openai";
  return "gemini";
};

type StreamLlmResponseParams = {
  system: string;
  messages: UIMessage[];
  tools?: ToolSet;
  apiKey?: string;
  providerOverride?: string;
};

type StreamLlmResponseResult = {
  result: ReturnType<typeof streamText>;
  provider: LlmProviderName;
};

export const streamLlmResponse = async ({
  system,
  messages,
  tools = {},
  apiKey,
  providerOverride,
}: StreamLlmResponseParams): Promise<StreamLlmResponseResult> => {
  const provider = getProviderName(providerOverride);
  const modelMessages = await convertToModelMessages(messages);

  // 1. Google Gemini (Default in Dev & Production)
  if (provider === "gemini") {
    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    const google = createGoogleGenerativeAI({
      apiKey: effectiveApiKey,
    });

    const result = streamText({
      system,
      model: google("gemini-2.0-flash") as any,
      messages: modelMessages,
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      stopWhen: stepCountIs(100),
    });

    return {
      result,
      provider,
    };
  }

  // 2. OpenAI
  if (provider === "openai") {
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY || "";
    const openaiProvider = createOpenAI({ apiKey: effectiveApiKey });
    const result = streamText({
      system,
      model: openaiProvider.responses("gpt-4o"),
      messages: modelMessages,
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        } satisfies OpenAIResponsesProviderOptions,
      },
      stopWhen: stepCountIs(100),
    });

    return {
      result,
      provider,
    };
  }

  // 3. Anthropic Claude
  const effectiveApiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
  const anthropicProvider = createAnthropic({ apiKey: effectiveApiKey });
  const result = streamText({
    system,
    model: anthropicProvider("claude-3-5-sonnet-latest"),
    messages: modelMessages,
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    stopWhen: stepCountIs(100),
  });

  return {
    result,
    provider,
  };
};

