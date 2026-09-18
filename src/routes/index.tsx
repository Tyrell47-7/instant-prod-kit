import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import {
  AppShell,
  SectionHeader,
  fieldClass,
  labelClass,
  primaryButtonClass,
} from "@/components/AppShell";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Nexus AI" },
      {
        name: "description",
        content:
          "Turn recipient context, purpose and key points into an editable, professionally toned email draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Nexus AI" },
      {
        property: "og:description",
        content: "Generate structured, editable workplace email drafts in seconds.",
      },
    ],
  }),
  component: EmailGeneratorPage,
});

const tones = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof tones)[number];

function EmailGeneratorPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = recipient.trim() !== "" && purpose.trim() !== "" && !loading;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { recipient, purpose, keyPoints, tone } });
      setSubject(result.subject);
      setBody(result.body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Feature 01"
        title="Smart Email Generator"
        subtitle="Turn context into a structured, ready-to-edit draft."
      >
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs font-medium text-ink/55 sm:inline">
            Tone
          </span>
          <div className="flex rounded-full border border-white/70 bg-white/50 p-1">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={
                  t === tone
                    ? "rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full px-3.5 py-1.5 text-xs font-medium text-ink/55"
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </SectionHeader>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={labelClass}>Recipient context</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={fieldClass}
            placeholder="Who are you writing to?"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Purpose / topic</span>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={fieldClass}
            placeholder="What is the email about?"
          />
        </label>
        <label className="block">
          <span className={labelClass}>Key points</span>
          <input
            type="text"
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            className={fieldClass}
            placeholder="3–5 bullet points"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`mt-5 ${primaryButtonClass}`}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Generating…" : "Generate draft"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {(subject || body) && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
              Generated draft · editable
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full bg-mint/40 px-2.5 py-1 text-[11px] font-medium text-ink/70 transition hover:bg-mint/60"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-2 rounded-2xl border border-white/80 bg-white/70 p-4">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/80 bg-white/70 px-3.5 py-2.5 font-display text-sm font-semibold text-ink outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="mt-3 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                Body
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                className="mt-1.5 w-full resize-y rounded-xl bg-mist/60 p-4 text-sm leading-relaxed text-ink/80 outline-none transition focus:ring-2 focus:ring-brand/20"
              />
            </label>
          </div>
        </div>
      )}
    </AppShell>
  );
}
