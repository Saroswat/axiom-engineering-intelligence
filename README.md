# Axiom — Engineering Intelligence

Axiom is an evidence-first AI software-engineering command center. It turns
repository issues into cited implementation plans, proposed patches, validation
results, and human-approved pull requests.

The application is public and account-free. It can run in three modes:

- `demo` — instant deterministic walkthrough; no model or account required.
- `ollama` — real local AI using Ollama; no account, API key, or cloud service.
- `openai` — optional hosted OpenAI model using your own API key.

## One-command Windows setup

After the repository is public, anyone can run this from PowerShell:

```powershell
irm https://raw.githubusercontent.com/Saroswat/axiom-engineering-intelligence/main/scripts/clone_setup_run.ps1 | iex
```

This downloads Axiom, installs missing prerequisites through `winget`, prepares
the local `qwen2.5-coder:7b` model, installs the application, and opens the
development server at `http://localhost:5173`.

The local model is approximately 4.7 GB. For a fast interface-only demo:

```powershell
git clone https://github.com/Saroswat/axiom-engineering-intelligence.git
cd axiom-engineering-intelligence
powershell -ExecutionPolicy Bypass -File .\scripts\run.ps1 -Provider demo
```

## Standard local setup

Requirements:

- Windows 10 or later
- Node.js 22 or later
- Git
- Ollama, only when using local AI

```powershell
git clone https://github.com/Saroswat/axiom-engineering-intelligence.git
cd axiom-engineering-intelligence
.\scripts\run.ps1
```

If script execution is restricted:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run.ps1
```

## Run modes

### Local AI — no signup

```powershell
.\scripts\run.ps1 -Provider ollama
```

Choose a smaller model on lower-memory machines:

```powershell
.\scripts\run.ps1 -Provider ollama -Model qwen2.5-coder:3b
```

### Demo — no model download

```powershell
.\scripts\run.ps1 -Provider demo -SkipInstall -SkipModelPull
```

### OpenAI — optional

Copy `.env.example` to `.env.local`, set `OPENAI_API_KEY`, and use:

```powershell
.\scripts\run.ps1 -Provider openai -SkipModelPull
```

Never commit `.env.local` or an API key.

## Architecture

```text
Browser
  └─ Next.js / React command center
      └─ /api/agent
          ├─ Demo provider (zero setup)
          ├─ Ollama provider (local and private)
          └─ OpenAI Responses API (optional)
```

The current vertical slice includes repository evidence, implementation
planning, patch review, quality-gate results, AI evaluation, and explicit human
approval. Repository mutation remains approval-gated by design.

## Commands

```powershell
npm run dev
npm run build
npm test
npm run lint
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `AI_PROVIDER` | `demo` | `demo`, `ollama`, or `openai` |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Local Ollama endpoint |
| `OLLAMA_MODEL` | `qwen2.5-coder:7b` | Local coding model |
| `OPENAI_API_KEY` | unset | Optional hosted model credential |
| `OPENAI_MODEL` | `gpt-5.6-sol` | Optional hosted model |

## Security model

- Anonymous and public by default.
- No telemetry or account database is required.
- Local Ollama prompts remain on the operator's machine.
- Secrets stay in ignored environment files.
- Code-changing actions require explicit human approval.
- Model output is treated as an untrusted proposal until validation succeeds.

## License

MIT
