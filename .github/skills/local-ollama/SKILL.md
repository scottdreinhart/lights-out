---
name: local-ollama
description: "Local Ollama"
---

# Local Ollama

## When to Use

- Working with local model endpoints or offline inference helpers
- Checking whether the local Ollama runtime is available before use
- Troubleshooting local-model integration behavior

## Authority

- `AGENTS.md` § 0, § 22, § 29
- Local Ollama runtime conventions

## Core Responsibilities

- Prefer local models when the task and environment allow it
- Verify endpoint availability before relying on a model response
- Avoid assuming a specific model or tag exists locally

## Definition of Done

- The local model endpoint is known and validated before use
- Fallback behavior is explicit when the model is unavailable
- Users can reproduce the endpoint check deterministically

- use local models only when possible
- endpoint: http://localhost:11434/v1
- never assume model exists
- verify availability
