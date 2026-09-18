import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { AppShell, SectionHeader, labelClass, primaryButtonClass } from "@/components/AppShell";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Nexus AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get an editable summary with action items, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Nexus AI" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into a clean, editable recap in seconds.",
      },
    ],
  }),
  component: MeetingNotesPage,
});

type Summary = {
  summary: string;
  actionItems: string;
  decisions: string;
  deadlines: string;
};

const sections: Array<{ key: keyof Summary; label: string; rows: number }> = [
  { key: "summary", label: "Summary", rows: 4 },
  { key: "actionItems", label: "Action items", rows: 5 },
  { key: "decisions", label: "Decisions made", rows: 4 },
  { key: "deadlines", label: "Deadlines", rows: 4 },
];

function MeetingNotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSummarize() {
    setLoading(true);
    setError(null);
    try {
      setResult(await run({ data: { notes } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Feature 02"
        title="Meeting Notes Summarizer"
        subtitle="Paste raw notes and get a clean, editable recap."
      />

      <label className="mt-7 block">
        <span className={labelClass}>Raw meeting notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={12}
          placeholder="Paste your notes, transcript fragments or bullet points here…"
          className="mt-1.5 w-full resize-y rounded-2xl border border-white/80 bg-white/70 p-4 text-sm leading-relaxed text-ink placeholder-ink/35 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
      </label>

      <button
        type="button"
        onClick={handleSummarize}
        disabled={notes.trim() === "" || loading}
        className={`mt-5 ${primaryButtonClass}`}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Summarizing…" : "Summarize notes"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/40">
            Summary output · editable
          </p>
          <div className="mt-2 grid gap-4 lg:grid-cols-2">
            {sections.map(({ key, label, rows }) => (
              <div key={key} className="rounded-2xl border border-white/80 bg-white/70 p-4">
                <p className="font-display text-sm font-semibold">{label}</p>
                <textarea
                  value={result[key]}
                  onChange={(e) => setResult({ ...result, [key]: e.target.value })}
                  rows={rows}
                  className="mt-3 w-full resize-y rounded-xl bg-mist/60 p-4 text-sm leading-relaxed text-ink/80 outline-none transition focus:ring-2 focus:ring-brand/20"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
