"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StudioWorkspace } from "@/components/StudioWorkspace";
import { IntegrationShowcase } from "@/components/IntegrationShowcase";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";
import { GenerationResponse, buildLocalVibeResponse } from "@/lib/ai";
import { INTEGRATIONS_LIST } from "@/lib/integrations";

/**
 * Extracts the HTML content from the LLM's markdown output.
 * Gemini is instructed to wrap the app in ```html ... ``` fences.
 */
function extractHtmlFromLLMOutput(raw: string): string | null {
  // Try to find ```html ... ``` block
  const htmlBlockMatch = raw.match(/```html\s*([\s\S]*?)(?:```|$)/i);
  if (htmlBlockMatch && htmlBlockMatch[1]) {
    return htmlBlockMatch[1].trim();
  }
  // Fallback: if the raw output starts with <!DOCTYPE or <html, use it directly
  const trimmed = raw.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    return trimmed;
  }
  return null;
}

export default function Home() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [generationData, setGenerationData] = useState<GenerationResponse | null>(null);
  const [rawStreamingOutput, setRawStreamingOutput] = useState<string>("");
  const [liveHtml, setLiveHtml] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [currentIntegrations, setCurrentIntegrations] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>("gemini-2.0-flash");
  const [currentApiKey, setCurrentApiKey] = useState<string>("");
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const handleGenerate = async ({
    prompt,
    integrations,
    model,
    apiKey,
  }: {
    prompt: string;
    integrations: string[];
    model: string;
    apiKey: string;
  }) => {
    setIsGenerating(true);
    setIsStreaming(true);
    setCurrentPrompt(prompt);
    setCurrentIntegrations(integrations);
    setCurrentModel(model);
    setCurrentApiKey(apiKey);
    setRawStreamingOutput("");
    setLiveHtml(""); // clear old preview
    setHasGenerated(true);

    // Build the scaffold data immediately (for code files tab)
    const matched = INTEGRATIONS_LIST.filter((i) => integrations.includes(i.id));
    const structuredState = buildLocalVibeResponse(prompt, matched);
    setGenerationData(structuredState);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          integrations,
          model,
          apiKey: apiKey || undefined,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
      }

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setRawStreamingOutput(accumulated);

          // Try to extract live HTML as it streams in and update preview
          const extractedHtml = extractHtmlFromLLMOutput(accumulated);
          if (extractedHtml && extractedHtml.length > 200) {
            setLiveHtml(extractedHtml);
          }
        }

        // Final extraction after stream ends
        const finalHtml = extractHtmlFromLLMOutput(accumulated);
        if (finalHtml) {
          setLiveHtml(finalHtml);
        } else if (!accumulated.trim()) {
          // If Gemini returned nothing, use the local vibe engine template
          setLiveHtml("");
        }
      }
    } catch (err) {
      console.warn("Stream generation error:", err);
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  const handleBackToHome = () => {
    setHasGenerated(false);
    setGenerationData(null);
    setRawStreamingOutput("");
    setLiveHtml("");
  };

  return (
    <AnimatePresence mode="wait">
      {hasGenerated ? (
        <motion.div
          key="studio-view"
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.99 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <StudioWorkspace
            generationData={generationData}
            rawStreamingOutput={rawStreamingOutput}
            liveHtml={liveHtml}
            isStreaming={isStreaming}
            selectedIntegrations={currentIntegrations}
            userPrompt={currentPrompt}
            selectedModel={currentModel}
            apiKey={currentApiKey}
            onGenerate={handleGenerate}
            onBackToHome={handleBackToHome}
          />
        </motion.div>
      ) : (
        <motion.main
          key="landing-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {/* Sticky Navbar */}
          <Navbar />

          {/* Hero Section containing the Uncluttered Sandbox */}
          <Hero onGenerate={handleGenerate} isLoading={isGenerating} />

          {/* Integrations Catalog & Injections Matrix */}
          <IntegrationShowcase />

          {/* Features & Architecture Highlights */}
          <FeaturesGrid />

          {/* Footer */}
          <Footer />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
