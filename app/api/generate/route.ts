import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/prompt-builder";
import { generateWithAI, buildLocalVibeResponse } from "@/lib/ai";
import { INTEGRATIONS_LIST } from "@/lib/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, integrations = [], model = "gemini-2.0-flash", apiKey, stream = true } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string." }, { status: 400 });
    }

    // 1. Build System Prompt with Injected Integrations Context
    const promptData = buildSystemPrompt({
      userPrompt: prompt,
      selectedIntegrationIds: Array.isArray(integrations) ? integrations : [],
      model,
    });

    const selectedIntegrations = INTEGRATIONS_LIST.filter((i) =>
      integrations.includes(i.id)
    );

    // 2. If client requests structured JSON instead of SSE stream
    if (!stream) {
      const structuredData = buildLocalVibeResponse(prompt, selectedIntegrations);
      return NextResponse.json({
        success: true,
        data: {
          ...structuredData,
          systemPrompt: promptData.systemPrompt,
          injectedIntegrationCount: selectedIntegrations.length,
          requiredEnvVars: promptData.requiredEnvVars,
        },
      });
    }

    // 3. Generate with AI (streaming) with bulletproof fallback
    let streamResponse: ReadableStream<Uint8Array>;
    try {
      streamResponse = await generateWithAI({
        userPrompt: prompt,
        selectedIntegrations,
        systemPrompt: promptData.systemPrompt,
        model,
        apiKey,
      });
    } catch (err) {
      console.warn("AI generation failed, returning dynamic Vibe Engine stream:", err);
      const fallbackData = buildLocalVibeResponse(prompt, selectedIntegrations);
      const encoder = new TextEncoder();
      streamResponse = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fallbackData.rawOutput));
          controller.close();
        },
      });
    }

    return new Response(streamResponse, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Injected-Integrations": selectedIntegrations.map((i) => i.name).join(", "),
      },
    });
  } catch (error) {
    console.error("API /api/generate error:", error);
    const fallbackData = buildLocalVibeResponse("App Blueprint", []);
    return new Response(fallbackData.rawOutput, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
