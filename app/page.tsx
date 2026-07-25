"use client";

import { useMemo, useState } from "react";

type Stage = "idle" | "planning" | "ready" | "running" | "complete";

const steps = [
  { id: "01", name: "Understand", detail: "Index repository & issue context" },
  { id: "02", name: "Plan", detail: "Build an evidence-backed approach" },
  { id: "03", name: "Implement", detail: "Generate a scoped patch" },
  { id: "04", name: "Verify", detail: "Run tests, lint & security checks" },
  { id: "05", name: "Review", detail: "Human approval before pull request" },
];

const evidence = [
  { file: "src/verinli/pipeline.py", lines: "L42–88", score: "98%", tag: "Primary flow" },
  { file: "src/verinli/retrieval.py", lines: "L17–76", score: "94%", tag: "Ranking logic" },
  { file: "tests/test_pipeline.py", lines: "L12–61", score: "91%", tag: "Test contract" },
  { file: "src/verinli/models.py", lines: "L9–43", score: "87%", tag: "Data schema" },
];

const checks = [
  { name: "Unit tests", value: "142 passed", tone: "green" },
  { name: "Type checks", value: "0 errors", tone: "green" },
  { name: "Security scan", value: "No findings", tone: "green" },
  { name: "Coverage", value: "91.4%", tone: "amber" },
];

function Mark({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`mark mark-${tone}`}>{children}</span>;
}

export default function Home() {
  const [enteredDemo, setEnteredDemo] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [activeTab, setActiveTab] = useState<"plan" | "diff" | "checks">("plan");
  const [approved, setApproved] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const activeStep = useMemo(() => {
    if (stage === "idle") return 0;
    if (stage === "planning") return 1;
    if (stage === "ready") return 2;
    if (stage === "running") return 3;
    return 4;
  }, [stage]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  async function runAnalysis() {
    setStage("planning");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setStage("ready");
    showToast("Plan generated from 4 repository sources");
  }

  async function runPatch() {
    setStage("running");
    setActiveTab("checks");
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setStage("complete");
    showToast("Patch validated in an isolated workspace");
  }

  if (!enteredDemo) {
    return (
      <main className="welcome">
        <header className="welcome-nav">
          <div className="brand welcome-brand">
            <div className="brand-mark">A</div>
            <div><strong>Axiom</strong><span>Engineering intelligence</span></div>
          </div>
          <div className="welcome-nav-actions">
            <span className="no-login-badge"><i /> No account required</span>
            <a className="text-link" href="https://github.com/Saroswat/axiom-engineering-intelligence">View source ↗</a>
          </div>
        </header>

        <section className="welcome-hero">
          <div className="welcome-copy">
            <div className="welcome-kicker"><span>✦</span> AI SOFTWARE ENGINEERING, WITH EVIDENCE</div>
            <h1>See the work.<br /><em>Trust the result.</em></h1>
            <p>Axiom turns repository issues into grounded implementation plans, validated patches, and review-ready pull requests—with a human in control.</p>
            <div className="welcome-actions">
              <button className="demo-cta" onClick={() => setEnteredDemo(true)}>
                <span>▶</span><div><strong>Try the interactive demo</strong><small>No sign-in · Takes 2 minutes</small></div><b>→</b>
              </button>
              <a className="chatgpt-cta" href="https://github.com/Saroswat/axiom-engineering-intelligence">
                <span className="chatgpt-mark">⌘</span><div><strong>Run locally with PowerShell</strong><small>Open source · Local AI · No account</small></div>
              </a>
            </div>
            <div className="privacy-note"><span>✓</span> Explore anonymously or run the entire stack locally. No signup, cloud account, or API key is required.</div>
          </div>

          <div className="welcome-product" aria-label="Axiom workflow preview">
            <div className="product-glow" />
            <div className="mini-window">
              <div className="mini-top"><div className="mini-logo">A</div><span>Axiom / Command center</span><div><i /><i /><i /></div></div>
              <div className="mini-body">
                <div className="mini-eyebrow">ISSUE #24 · ENHANCEMENT</div>
                <h2>Improve evidence ranking for ambiguous claims</h2>
                <div className="mini-pipeline">
                  {["Understand", "Plan", "Implement", "Verify", "Review"].map((item, index) => <div key={item} className={index < 3 ? "lit" : ""}><span>{index < 2 ? "✓" : index + 1}</span><small>{item}</small></div>)}
                </div>
                <div className="mini-grid">
                  <div className="mini-card">
                    <small>GROUNDING EVIDENCE</small>
                    {["pipeline.py", "retrieval.py", "test_pipeline.py"].map((file, index) => <div className="mini-file" key={file}><span>{index === 2 ? "T" : "Py"}</span><b>{file}</b><em>{98 - index * 4}%</em></div>)}
                  </div>
                  <div className="mini-card mini-plan">
                    <small>IMPLEMENTATION PLAN</small>
                    <strong>Calibrated hybrid evidence ranking</strong>
                    <p><i>1</i> Add a configurable hybrid score</p>
                    <p><i>2</i> Expose ranking diagnostics</p>
                    <p><i>3</i> Add adversarial regression tests</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-proof proof-one"><span>✓</span><div><small>QUALITY GATES</small><strong>142 tests passed</strong></div></div>
            <div className="floating-proof proof-two"><span>94%</span><div><small>CONTEXT</small><strong>High confidence</strong></div></div>
          </div>
        </section>

        <section className="trust-strip">
          <span>Grounded in your codebase</span><i />
          <span>Human approval required</span><i />
          <span>Tests before pull requests</span><i />
          <span>Transparent cost & confidence</span>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div><strong>Axiom</strong><span>Engineering intelligence</span></div>
        </div>

        <nav aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <button className="nav-item active"><span>⌁</span> Command center</button>
          <button className="nav-item"><span>◇</span> Repositories <b>3</b></button>
          <button className="nav-item"><span>◎</span> Agent runs <b>12</b></button>
          <button className="nav-item"><span>✓</span> Evaluations</button>
          <p className="nav-label second">Manage</p>
          <button className="nav-item"><span>◫</span> Team</button>
          <button className="nav-item"><span>⚙</span> Settings</button>
        </nav>

        <div className="sidebar-foot">
          <div className="usage-head"><span>Monthly usage</span><strong>68%</strong></div>
          <div className="usage-track"><i /></div>
          <span>34.2k / 50k credits</span>
          <div className="profile">
            <div className="avatar">LV</div>
            <div><strong>Local visitor</strong><span>Anonymous session</span></div>
            <button aria-label="Profile menu">•••</button>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="repo-select"><span className="repo-icon">◆</span><div><small>Repository</small><strong>Saroswat / explainable-nli-hallucination-verifier</strong></div><span>⌄</span></div>
          <div className="top-actions">
            <div className="live"><i /> Systems operational</div>
            <button className="icon-button" aria-label="Notifications">♢<b>2</b></button>
            <button className="primary" onClick={() => showToast("Repository connection flow ready")}>＋ Connect repo</button>
          </div>
        </header>

        <div className="content">
          <div className="hero-row">
            <div>
              <div className="eyebrow"><Mark tone="blue">ISSUE #24</Mark><span>Enhancement</span></div>
              <h1>Improve evidence ranking for<br />ambiguous technical claims</h1>
              <p>Analyze the issue, trace the relevant code paths, and prepare a tested implementation.</p>
            </div>
            <div className="confidence">
              <div className="confidence-ring"><span>94<small>%</small></span></div>
              <div><small>Repository context</small><strong>High confidence</strong><span>1,847 files indexed</span></div>
            </div>
          </div>

          <section className="pipeline" aria-label="Agent workflow">
            {steps.map((step, index) => (
              <div className={`pipeline-step ${index <= activeStep ? "done" : ""} ${index === activeStep ? "current" : ""}`} key={step.id}>
                <div className="step-num">{index < activeStep ? "✓" : step.id}</div>
                <div><strong>{step.name}</strong><span>{step.detail}</span></div>
                {index < steps.length - 1 && <i className="connector" />}
              </div>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="panel evidence-panel">
              <div className="panel-head">
                <div><small>REPOSITORY INTELLIGENCE</small><h2>Grounding evidence</h2></div>
                <Mark tone="green">4 sources</Mark>
              </div>
              <div className="search">
                <span>⌕</span>
                <input aria-label="Search repository evidence" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search indexed code…" />
                <kbd>⌘ K</kbd>
              </div>
              <div className="evidence-list">
                {evidence.filter((item) => item.file.toLowerCase().includes(query.toLowerCase())).map((item, index) => (
                  <button className="evidence-item" key={item.file} onClick={() => showToast(`${item.file} opened at ${item.lines}`)}>
                    <span className="file-icon">{index === 2 ? "T" : "Py"}</span>
                    <div><strong>{item.file}</strong><span>{item.lines} · {item.tag}</span></div>
                    <Mark tone={index < 2 ? "green" : "neutral"}>{item.score}</Mark>
                    <span className="arrow">›</span>
                  </button>
                ))}
              </div>
              <div className="architecture-note">
                <span>⌬</span><div><strong>Architecture insight</strong><p>The ranking stage is isolated behind <code>EvidenceRetriever</code>. The change can remain backward-compatible and be covered by the existing pipeline fixtures.</p></div>
              </div>
            </section>

            <section className="panel execution-panel">
              <div className="tabs" role="tablist">
                {(["plan", "diff", "checks"] as const).map((tab) => (
                  <button role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>
                    {tab === "plan" ? "Implementation plan" : tab === "diff" ? "Proposed diff" : "Validation"}
                    {tab === "checks" && stage === "complete" && <i />}
                  </button>
                ))}
              </div>

              <div className="tab-body">
                {activeTab === "plan" && (
                  <>
                    <div className="plan-summary">
                      <div className="spark">✦</div>
                      <div><small>AI-GENERATED PLAN</small><h2>Calibrated hybrid evidence ranking</h2><p>Blend semantic similarity with NLI confidence while preserving the current retriever interface.</p></div>
                    </div>
                    <ol className="plan-list">
                      <li><span>1</span><div><strong>Add a configurable hybrid score</strong><p>Combine cosine similarity and entailment probability with normalized weights.</p><code>src/verinli/retrieval.py</code></div></li>
                      <li><span>2</span><div><strong>Expose ranking diagnostics</strong><p>Return score components for explainability without changing default output.</p><code>src/verinli/models.py</code></div></li>
                      <li><span>3</span><div><strong>Add adversarial regression tests</strong><p>Cover ambiguous claims, score ties, and empty evidence collections.</p><code>tests/test_retrieval.py</code></div></li>
                    </ol>
                    <div className="risk-row"><div><small>Estimated change</small><strong>3 files · ~86 lines</strong></div><div><small>Risk assessment</small><Mark tone="green">Low risk</Mark></div><div><small>Expected runtime</small><strong>~2 minutes</strong></div></div>
                  </>
                )}

                {activeTab === "diff" && (
                  <div className="diff-view">
                    <div className="diff-head"><span>src/verinli/retrieval.py</span><Mark tone="green">+31</Mark><Mark tone="red">−8</Mark></div>
                    <pre><span className="muted">  42</span>  def rank_evidence(self, claim, evidence):{"\n"}<span className="minus">- 43    return sorted(evidence, key=self._similarity)</span>{"\n"}<span className="plus">+ 43    scored = [self._score(claim, item) for item in evidence]</span>{"\n"}<span className="plus">+ 44    return sorted(scored, key=lambda item: item.total, reverse=True)</span>{"\n"}{"\n"}<span className="plus">+ 47  def _score(self, claim, evidence):</span>{"\n"}<span className="plus">+ 48    semantic = self.encoder.similarity(claim, evidence.text)</span>{"\n"}<span className="plus">+ 49    entailment = self.nli.predict(claim, evidence.text)</span>{"\n"}<span className="plus">+ 50    total = 0.65 * semantic + 0.35 * entailment</span></pre>
                  </div>
                )}

                {activeTab === "checks" && (
                  <div className="checks-view">
                    <div className={`validation-hero ${stage === "running" ? "loading" : ""}`}>
                      <div>{stage === "complete" ? "✓" : "↻"}</div>
                      <h2>{stage === "complete" ? "All quality gates passed" : "Ready to validate"}</h2>
                      <p>{stage === "complete" ? "Patch verified in an isolated execution environment." : "Generate the patch to run the complete verification suite."}</p>
                    </div>
                    <div className="check-grid">
                      {checks.map((check) => <div key={check.name}><span>{check.name}</span><strong className={check.tone}>{stage === "complete" ? check.value : "Pending"}</strong></div>)}
                    </div>
                    <div className="eval-card"><div><small>AI EVALUATION</small><strong>Groundedness & patch quality</strong></div><span>{stage === "complete" ? "96 / 100" : "—"}</span></div>
                  </div>
                )}
              </div>

              <div className="action-bar">
                {stage === "idle" || stage === "planning" ? (
                  <button className="run-button" disabled={stage === "planning"} onClick={runAnalysis}>{stage === "planning" ? "Analyzing repository…" : "✦ Generate implementation plan"}</button>
                ) : stage === "ready" ? (
                  <><button className="secondary" onClick={() => setStage("idle")}>Revise plan</button><button className="run-button" onClick={runPatch}>▶ Generate & validate patch</button></>
                ) : stage === "running" ? (
                  <button className="run-button" disabled>Running quality gates…</button>
                ) : !approved ? (
                  <><span className="approval-note">Human approval required</span><button className="run-button" onClick={() => { setApproved(true); showToast("Patch approved for draft pull request"); }}>✓ Approve patch</button></>
                ) : (
                  <button className="run-button" onClick={() => showToast("Draft pull request prepared")}>↗ Open draft pull request</button>
                )}
              </div>
            </section>
          </div>

          <footer className="audit">
            <div><span>◉</span><strong>Audit trail active</strong><p>Every agent action, source citation, and approval is recorded.</p></div>
            <div><span>Model <strong>GPT-5.6 Sol</strong></span><span>Mode <strong>Balanced</strong></span><span>Est. cost <strong>$0.42</strong></span></div>
          </footer>
        </div>
      </section>
      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
