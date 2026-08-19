"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const LINE_STAGGER = 0.02;
const WIPE_DURATION = 0.28;
const FLASH_DURATION = 0.35;
const SUCCESS_TINT = "rgba(16, 185, 129, 0.18)";
const DANGER_TINT = "rgba(244, 63, 94, 0.18)";

export type AIDiffLineKind = "added" | "removed" | "context";

export type AIDiffLine = {
  content: string;
  kind: AIDiffLineKind;
  /** Line number in the file. Omit for tabular data rather than code. */
  number?: number;
};

export type AIDiffProps = {
  className?: string;
  lines: AIDiffLine[];
  onAccept?: () => void;
  onReject?: () => void;
  /** File path or a description of what is being changed. */
  title?: string;
};

const PREFIX: Record<AIDiffLineKind, string> = {
  added: "+",
  context: " ",
  removed: "-",
};

const AIDiff = ({
  className,
  lines,
  onAccept,
  onReject,
  title,
}: AIDiffProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accept = () => {
    setDecision("accepted");
    onAccept?.();
  };

  const reject = () => {
    setDecision("rejected");
    onReject?.();
  };

  const added = lines.filter((line) => line.kind === "added").length;
  const removed = lines.filter((line) => line.kind === "removed").length;

  if (!mounted) {
    return (
      <div className={cn("w-full overflow-hidden rounded-xl border border-slate-900/10 bg-white dark:border-white/10 dark:bg-[#0d0f18]", className)}>
        <div className="flex items-center gap-2 border-slate-900/10 dark:border-white/10 border-b px-3 py-2 bg-slate-100 dark:bg-slate-900/60 text-xs">
          {title && <span className="font-mono text-slate-900 dark:text-white text-xs font-semibold">{title}</span>}
        </div>
        <pre className="p-3 font-mono text-xs text-slate-800 dark:text-slate-300">
          {lines.map((l, i) => (
            <div key={i}>{PREFIX[l.kind]} {l.content}</div>
          ))}
        </pre>
      </div>
    );
  }

  return (
    <motion.div
      animate={
        decision && !shouldReduceMotion
          ? {
              backgroundColor: [
                decision === "accepted" ? SUCCESS_TINT : DANGER_TINT,
                "rgba(0, 0, 0, 0)",
              ],
            }
          : undefined
      }
      className={cn(
        "w-full overflow-hidden rounded-xl border border-slate-900/10 bg-white dark:border-white/10 dark:bg-[#0d0f18]",
        className
      )}
      layout={!shouldReduceMotion}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              backgroundColor: { duration: FLASH_DURATION, ease: EASE_OUT },
              layout: SPRING_DEFAULT,
            }
      }
    >
      <div className="flex items-center gap-2 border-slate-900/10 dark:border-white/10 border-b px-3 py-2 bg-slate-100 dark:bg-slate-900/60">
        {title ? (
          <span className="min-w-0 truncate font-mono text-slate-900 dark:text-white text-xs font-semibold">
            {title}
          </span>
        ) : null}
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs tabular-nums font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{added}</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold">-{removed}</span>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {decision !== "rejected" && (
          <motion.div
            className="overflow-hidden"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { height: 0, opacity: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          >
            <pre className="overflow-x-auto py-1.5 font-mono text-xs leading-relaxed">
              {lines.map((line, index) => (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { clipPath: "inset(0 0% 0 0)" }
                  }
                  className={cn(
                    "flex gap-3 px-3 py-0.5",
                    line.kind === "added" && "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
                    line.kind === "removed" && "bg-rose-500/10 text-rose-800 dark:text-rose-300",
                    line.kind === "context" && "text-slate-800 dark:text-slate-300"
                  )}
                  initial={
                    line.kind === "added" && !shouldReduceMotion
                      ? { clipPath: "inset(0 100% 0 0)" }
                      : false
                  }
                  key={index}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          delay: index * LINE_STAGGER,
                          duration: WIPE_DURATION,
                          ease: EASE_OUT,
                        }
                  }
                >
                  {line.number !== undefined && (
                    <span className="w-6 shrink-0 select-none text-right text-slate-400 dark:text-slate-500 tabular-nums">
                      {line.number}
                    </span>
                  )}
                  <span
                    className={cn(
                      "w-2 shrink-0 select-none font-bold",
                      line.kind === "added" && "text-emerald-600 dark:text-emerald-400",
                      line.kind === "removed" && "text-rose-600 dark:text-rose-400",
                      line.kind === "context" && "text-slate-400 dark:text-slate-600"
                    )}
                  >
                    {PREFIX[line.kind]}
                  </span>
                  <span className="whitespace-pre">
                    {line.content}
                  </span>
                </motion.div>
              ))}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {(onAccept || onReject) && !decision && (
        <div className="flex items-center justify-end gap-2 border-slate-900/10 dark:border-white/10 border-t px-3 py-2 bg-slate-100/80 dark:bg-slate-900/40">
          {onReject ? (
            <button
              className="cursor-pointer rounded-lg px-2.5 py-1 text-slate-600 dark:text-slate-400 text-xs transition-colors hover:bg-slate-900/10 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white font-medium"
              onClick={reject}
              type="button"
            >
              Reject
            </button>
          ) : null}
          {onAccept ? (
            <button
              className="cursor-pointer rounded-lg bg-violet-600 hover:bg-violet-500 px-3 py-1 text-white text-xs font-medium transition-colors"
              onClick={accept}
              type="button"
            >
              Accept
            </button>
          ) : null}
        </div>
      )}

      {decision ? (
        <motion.p
          animate={{ opacity: 1 }}
          className={cn(
            "border-white/10 border-t px-3 py-2 text-xs capitalize font-medium",
            decision === "accepted" ? "text-emerald-400 bg-emerald-500/5" : "text-rose-400 bg-rose-500/5"
          )}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: EASE_OUT }
          }
        >
          Diff status: {decision}
        </motion.p>
      ) : null}
    </motion.div>
  );
};

export default AIDiff;
