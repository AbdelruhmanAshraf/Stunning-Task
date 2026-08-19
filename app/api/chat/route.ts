import { type UIMessage } from "ai";
import { cookies } from "next/headers";
import { streamLlmResponse } from "@/lib/llm-provider";
import { readRepoMetadata, saveConversationMessages } from "@/lib/repo-storage";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { generateVibeStreamResponse } from "@/lib/vibe-engine-stream";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as {
      messages?: UIMessage[];
      repoId?: string;
      conversationId?: string;
    };

    const { repoId, conversationId } = payload;
    const messages = Array.isArray(payload.messages)
      ? payload.messages
      : undefined;

    if (!repoId || !conversationId) {
      return Response.json(
        { error: "repoId and conversationId are required." },
        { status: 400 },
      );
    }

    if (!messages) {
      return Response.json(
        { error: "messages must be an array." },
        { status: 400 },
      );
    }

    // Read user-provided API key from cookie (prioritized)
    const jar = await cookies();
    const userApiKey = jar.get("user-api-key")?.value;
    const userProvider = jar.get("user-api-provider")?.value;

    // Check if Freestyle cloud VM tools are available
    if (process.env.FREESTYLE_API_KEY && !repoId.startsWith("local-")) {
      try {
        const { getOrCreateIdentitySession } = await import("@/lib/identity-session");
        const { identity } = await getOrCreateIdentitySession();
        const { repositories } = await identity.permissions.git.list({ limit: 200 });
        const hasAccess = repositories.some((repo: { id: string }) => repo.id === repoId);

        if (hasAccess) {
          const metadata = await readRepoMetadata(repoId);
          if (metadata && metadata.vm?.vmId) {
            await saveConversationMessages(repoId, metadata, conversationId, messages);

            const { freestyle } = await import("freestyle-sandboxes");
            const { adorableVmSpec } = await import("@/lib/adorable-vm");
            const { createTools: createVmTools } = await import("@/lib/create-tools");

            const vm = freestyle.vms.ref({
              vmId: metadata.vm.vmId,
              spec: adorableVmSpec,
            });

            const tools = createVmTools(vm, {
              sourceRepoId: metadata.sourceRepoId,
              metadataRepoId: repoId,
            });

            const llm = await streamLlmResponse({
              system: SYSTEM_PROMPT,
              messages,
              tools,
              apiKey: userApiKey,
              providerOverride: userProvider,
            });

            return llm.result.toUIMessageStreamResponse({
              sendReasoning: true,
              originalMessages: messages,
              generateMessageId: () => crypto.randomUUID(),
              onFinish: async ({ messages: finalMessages }) => {
                const latestMetadata = await readRepoMetadata(repoId);
                if (!latestMetadata) return;
                await saveConversationMessages(
                  repoId,
                  latestMetadata,
                  conversationId,
                  finalMessages,
                );
              },
            });
          }
        }
      } catch (vmErr) {
        console.warn("Cloud VM session skipped:", vmErr);
      }
    }

    // If user provided a real custom API key or env key, try streaming from live LLM
    if (userApiKey || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY) {
      try {
        const llm = await streamLlmResponse({
          system: SYSTEM_PROMPT,
          messages,
          apiKey: userApiKey,
          providerOverride: userProvider,
        });

        return llm.result.toUIMessageStreamResponse({
          sendReasoning: true,
          originalMessages: messages,
          generateMessageId: () => crypto.randomUUID(),
          onFinish: async ({ messages: finalMessages }) => {
            const latestMetadata = await readRepoMetadata(repoId);
            if (!latestMetadata) return;
            await saveConversationMessages(
              repoId,
              latestMetadata,
              conversationId,
              finalMessages,
            );
          },
        });
      } catch (llmErr) {
        console.warn("Real LLM call failed, falling back to Vibe Stream:", llmErr);
      }
    }

    // Built-in intelligent stream fallback: always responds instantly with reasoning + code
    return generateVibeStreamResponse({
      messages,
      repoId,
      conversationId,
      onFinish: async (finalMessages) => {
        const latestMetadata = await readRepoMetadata(repoId);
        if (!latestMetadata) return;
        await saveConversationMessages(
          repoId,
          latestMetadata,
          conversationId,
          finalMessages,
        );
      },
    });
  } catch (err: any) {
    console.error("Critical error in /api/chat:", err);
    return Response.json(
      {
        error: err?.message || String(err),
        stack: err?.stack ? String(err.stack) : undefined,
      },
      { status: 500 },
    );
  }
}


