const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Calls the Lovable AI Gateway Responses API with a structured system +
 * user prompt and returns the accumulated plain-text output.
 */
export async function runPrompt(system: string, user: string): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError("AI service is not configured.", 500);

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    const message =
      response.status === 429
        ? "Too many requests right now. Please wait a moment and try again."
        : response.status === 402
          ? "AI usage limit reached for this workspace."
          : `The assistant could not complete that request. ${detail.slice(0, 200)}`;
    throw new AiError(message, response.status || 500);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const event = JSON.parse(payload) as {
          type?: string;
          delta?: string;
        };
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
          text += event.delta;
        }
      } catch {
        // ignore keep-alive / partial frames
      }
    }
  }

  const trimmed = text.trim();
  if (!trimmed) throw new AiError("The assistant returned an empty response.", 502);
  return trimmed;
}
