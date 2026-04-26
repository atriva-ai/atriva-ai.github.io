---
title: Agentic Patterns
description: Recipes for connecting Atriva's edge AI event stream to LLMs, VLMs, and autonomous agents.
order: 50
---

Atriva is designed to work alongside LLMs and AI agents, not replace them. The key insight behind the hybrid edge-AI architecture is that **continuous cloud inference is impractical**: sending every camera frame to a VLM costs too much, introduces unacceptable latency, and creates privacy exposure.

The correct architecture is:

```
[Camera] → [Atriva Edge Pipeline] → [Structured Event] → [LLM / VLM / Agent]
```

Atriva handles the high-frequency, low-latency perception layer. Agents handle the low-frequency, high-reasoning layer. Together they form a cost-effective, privacy-first system that can autonomously observe, investigate, and act.

## Core Concepts

### Events as Agent Tool Inputs

Every detection Atriva makes can be emitted as a typed JSON event — a structured signal that an agent can receive as a tool call result or webhook payload. An event carries:

- `type` — what was detected (e.g., `fall`, `ppe_violation`, `crowd_surge`)
- `confidence` — model confidence score
- `timestamp` — ISO 8601 UTC
- `camera_id` — source camera
- `zone` — configured zone within the camera view
- `snapshot_url` — link to the captured frame (optional, on-device or secure storage)
- `metadata` — detection-specific fields (e.g., `{ "missing_ppe": ["helmet", "vest"] }`)

This event schema is the handoff point between Atriva and your agent.

### The Pre-Filter Principle

Atriva acts as a **pre-filter**: it discards the 99% of frames where nothing meaningful happens and surfaces only the events that warrant higher-level reasoning. This means your LLM or VLM is invoked tens or hundreds of times per day, not millions — keeping inference costs manageable.

### Agent Action Patterns

Once an event reaches an agent, common action patterns include:

| Pattern | Description |
|---|---|
| VLM investigation | Pass snapshot to GPT-4V / Claude claude-sonnet-4-6 for deeper visual analysis |
| Report generation | LLM writes a structured incident report in natural language |
| Alert routing | Agent determines who to notify and through which channel |
| Evidence packaging | Agent collects snapshot, event metadata, and camera context into a record |
| Escalation decision | Agent decides whether to escalate based on severity and history |

## Patterns in This Section

- [Event-Triggered VLM](/docs/agentic-patterns/event-triggered-vlm) — Call a VLM when an Atriva event fires
- [Natural Language Alerts](/docs/agentic-patterns/natural-language-alerts) — LLM-generated alert messages vs. static templates
- [Multi-Agent Smart Spaces](/docs/agentic-patterns/multi-agent-spaces) — Per-camera agents with a supervisor agent

## Compatible Frameworks

Atriva events work with any LLM or agent framework that can receive a webhook or call a REST API:

- **LangGraph** — model events as graph nodes that trigger tool calls
- **CrewAI** — assign a safety agent task when a violation event fires
- **AutoGen** — multi-agent conversation triggered by event data
- **Custom agents** — consume the event webhook with any HTTP client
