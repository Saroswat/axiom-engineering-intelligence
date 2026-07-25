import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the Axiom command center", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    context,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Axiom — Engineering Intelligence<\/title>/i);
  assert.match(html, /Try the interactive demo/);
  assert.match(html, /No account required/);
  assert.match(html, /Run locally with PowerShell/);
  assert.match(html, /No signup, cloud account, or API key is required/);
  assert.match(html, /github\.com\/Saroswat\/axiom-engineering-intelligence/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("agent endpoint validates its input", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    }),
    env,
    context,
  );

  assert.equal(response.status, 400);
  const json = await response.json();
  assert.equal(json.error, "An issue description is required.");
});

test("agent endpoint provides a safe demo when no API key is configured", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ issue: "Improve evidence ranking." }),
    }),
    env,
    context,
  );

  assert.equal(response.status, 200);
  const json = await response.json();
  assert.equal(json.mode, "demo");
  assert.equal(json.model, "built-in");
});
