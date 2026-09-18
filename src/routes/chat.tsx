import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppShell, SectionHeader } from "@/components/AppShell";
import { chatReply } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Nexus AI" },
      {
        name: "description",
        content:
          "Chat with a workplace assistant for drafting, planning and prioritising. Session-only history.",
      },
      { property: "og:title", content: "AI Chatbot — Nexus AI" },
      {
        property: "og:description",
        content: "A general workplace assistant for drafting, planning and prioritising work.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(chatReply);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi — I can help you draft, plan, prioritise or summarise work. What are you working on?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const { reply } = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The assistant could not reply. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Feature 03"
        title="AI Chatbot"
        subtitle="Your general workplace assistant. History lasts for this session only."
      />

      <div className="mt-7 rounded-2xl border border-white/80 bg-white/70 p-4">
        <div ref={scrollRef} className="flex max-h-[52vh] min-h-[280px] flex-col gap-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md bg-gradient-to-r from-brand to-brand-soft px-4 py-2.5 text-sm leading-relaxed text-white"
                  : "max-w-[85%] self-start whitespace-pre-wrap rounded-2xl rounded-bl-md bg-mist/70 px-4 py-2.5 text-sm leading-relaxed text-ink/80"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-md bg-mist/70 px-4 py-2.5 text-sm text-ink/55">
              <Loader2 className="size-3.5 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask the assistant…"
            className="min-w-0 flex-1 rounded-xl border border-white/80 bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder-ink/35 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || input.trim() === ""}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-brand to-brand-soft text-white shadow-lg shadow-brand/30 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs text-ink/50">
        Replies are AI-generated and may contain errors — review anything before acting on it.
      </p>
    </AppShell>
  );
}
