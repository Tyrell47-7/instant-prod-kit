import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const toneSchema = z.enum(["Formal", "Friendly", "Persuasive"]);

const emailInput = z.object({
  recipient: z.string().trim().min(1).max(600),
  purpose: z.string().trim().min(1).max(600),
  keyPoints: z.string().trim().max(2000).default(""),
  tone: toneSchema,
});

const notesInput = z.object({
  notes: z.string().trim().min(1).max(20000),
});

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(40),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailInput.parse(data))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai.server");

    const system = [
      "You are a professional workplace email writer.",
      "Write one complete business email based strictly on the structured fields provided.",
      "Never invent facts, names, dates, figures or commitments that are not in the fields.",
      "Output format, exactly:",
      "SUBJECT: <one line subject>",
      "BODY:",
      "<email body with greeting, 1-3 short paragraphs, optional bullet list using '- ', and a sign-off>",
      "Do not add commentary, markdown headings or code fences.",
    ].join("\n");

    const user = [
      `TONE: ${data.tone}`,
      `RECIPIENT CONTEXT: ${data.recipient}`,
      `PURPOSE / TOPIC: ${data.purpose}`,
      `KEY POINTS: ${data.keyPoints || "(none supplied)"}`,
    ].join("\n");

    const output = await runPrompt(system, user);
    const match = output.match(/SUBJECT:\s*(.*?)\s*(?:\n+BODY:\s*)([\s\S]*)$/i);

    return {
      subject: match ? match[1].trim() : "Draft email",
      body: match ? match[2].trim() : output,
    };
  });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => notesInput.parse(data))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai.server");

    const system = [
      "You summarize raw meeting notes for busy professionals.",
      "Use only information present in the notes. If a section has nothing, write '- None identified'.",
      "Output format, exactly these four labelled sections in this order and nothing else:",
      "SUMMARY:",
      "<2-4 sentence paragraph>",
      "ACTION ITEMS:",
      "- <action> (owner if stated)",
      "DECISIONS:",
      "- <decision>",
      "DEADLINES:",
      "- <item> — <date or timeframe>",
      "No markdown headings, no code fences, no extra commentary.",
    ].join("\n");

    const output = await runPrompt(system, `MEETING NOTES:\n${data.notes}`);

    const section = (label: string, next: string | null) => {
      const pattern = next
        ? new RegExp(`${label}:\\s*([\\s\\S]*?)\\n\\s*${next}:`, "i")
        : new RegExp(`${label}:\\s*([\\s\\S]*)$`, "i");
      const found = output.match(pattern);
      return found ? found[1].trim() : "";
    };

    const summary = section("SUMMARY", "ACTION ITEMS");
    return {
      summary: summary || output,
      actionItems: section("ACTION ITEMS", "DECISIONS"),
      decisions: section("DECISIONS", "DEADLINES"),
      deadlines: section("DEADLINES", null),
    };
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chatInput.parse(data))
  .handler(async ({ data }) => {
    const { runPrompt } = await import("./ai.server");

    const system = [
      "You are a concise workplace productivity assistant.",
      "Help with drafting, planning, prioritising, summarising and professional communication.",
      "Answer in plain text, at most ~180 words, using short paragraphs or '- ' bullets.",
      "Ask one clarifying question when the request is ambiguous.",
      "Say plainly when you do not know something; never fabricate company facts.",
      "Decline anything outside workplace productivity assistance.",
    ].join("\n");

    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`)
      .join("\n\n");

    const reply = await runPrompt(
      system,
      `CONVERSATION SO FAR:\n${transcript}\n\nWrite only the next ASSISTANT reply.`,
    );
    return { reply };
  });
