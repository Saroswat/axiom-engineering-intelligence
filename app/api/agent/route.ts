import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Axiom, a senior software-engineering agent. Produce a concise,
evidence-grounded implementation plan. Cite repository file paths supplied in the request.
Separate observations from proposals, preserve existing interfaces, identify risks, and define
verification steps. Never claim to have executed code or opened a pull request.`;

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => ({}));
  const issue = typeof payload.issue === "string" ? payload.issue.slice(0, 4000) : "";

  if (!issue) {
    return NextResponse.json({ error: "An issue description is required." }, { status: 400 });
  }

  const provider = (process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? "openai" : "demo")).toLowerCase();

  if (provider === "ollama") {
    const ollamaUrl = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
    const model = process.env.OLLAMA_MODEL || "qwen2.5-coder:7b";
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: issue },
        ],
        options: { temperature: 0.2 },
      }),
    }).catch(() => null);

    if (!response?.ok) {
      return NextResponse.json({
        error: "The local Ollama model is unavailable.",
        hint: `Run: ollama pull ${model}`,
      }, { status: 503 });
    }

    const data = await response.json();
    return NextResponse.json({
      mode: "local",
      model,
      output: data.message?.content || "",
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (provider === "demo" || !apiKey) {
    return NextResponse.json({
      mode: "demo",
      model: "built-in",
      message: "A deterministic demonstration is active. No account or API key is required.",
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
      instructions: SYSTEM_PROMPT,
      input: issue,
      reasoning: { effort: "medium" },
      text: {
        format: {
          type: "json_schema",
          name: "implementation_plan",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              risks: { type: "array", items: { type: "string" } },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    rationale: { type: "string" },
                    files: { type: "array", items: { type: "string" } },
                    verification: { type: "string" },
                  },
                  required: ["title", "rationale", "files", "verification"],
                },
              },
            },
            required: ["summary", "risks", "steps"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json({ error: "Planning request failed.", details: details.slice(0, 500) }, { status: 502 });
  }

  const data = await response.json();
  return NextResponse.json({ mode: "live", responseId: data.id, output: data.output_text });
}
