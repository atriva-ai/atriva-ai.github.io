---
title: Natural Language Alerts
description: Use an LLM to generate context-aware, human-readable alert messages instead of static templates — making alerts more actionable and easier to act on.
order: 52
---

Static alert templates ("PPE violation detected in Zone B") give responders the bare minimum. An LLM can turn the same event into a message that includes context, suggested action, and severity — without any manual template engineering.

## Static Template vs. LLM-Generated Alert

**Static template:**
> ⚠️ PPE violation detected in loading_dock at 08:32 UTC. Confidence: 91%.

**LLM-generated:**
> Safety alert — loading dock (north warehouse): A worker near the forklift bay appears to be missing a hard hat and high-visibility vest. Confidence is high (91%). This zone has active vehicle traffic. Supervisor on-shift: please verify and remind the worker before operations continue.

The LLM version adapts to the event context, references the camera zone's known risk level, and suggests a concrete action.

## Implementation

### Building the Prompt

Feed the LLM the raw event payload plus any relevant context you maintain (zone risk profiles, shift schedules, recent incident history):

```python
import anthropic

client = anthropic.Anthropic()

ZONE_CONTEXT = {
    "loading_dock": "Active forklift zone. PPE mandatory. High injury risk.",
    "office_entry": "Low-risk zone. PPE not required.",
}

def generate_alert(event: dict, on_call_supervisor: str) -> str:
    zone = event["zone"]
    zone_info = ZONE_CONTEXT.get(zone, "No additional zone context.")

    prompt = f"""
You are a workplace safety alert system. Write a concise, actionable alert message
for the on-call supervisor. Use plain language. Be direct. Max 3 sentences.

Event:
- Type: {event['type']}
- Zone: {zone} — {zone_info}
- Missing PPE: {event['metadata'].get('missing_ppe', [])}
- Time: {event['timestamp']}
- Confidence: {event['confidence']}
- On-call supervisor: {on_call_supervisor}

Write only the alert message, no preamble.
"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # use Haiku for low-latency, cost-efficient alerts
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text
```

> Use `claude-haiku-4-5-20251001` for alert generation — it is fast and cheap enough to run on every event. Reserve `claude-sonnet-4-6` for VLM analysis where image understanding is needed.

### Sending to Slack

```python
import httpx

def send_slack_alert(webhook_url: str, message: str, event: dict):
    httpx.post(webhook_url, json={
        "text": message,
        "attachments": [
            {
                "color": "#E53E3E",
                "fields": [
                    {"title": "Zone", "value": event["zone"], "short": True},
                    {"title": "Confidence", "value": f"{event['confidence']:.0%}", "short": True},
                ],
                "image_url": event.get("snapshot_url"),
            }
        ],
    })
```

## Consistent Tone with a System Prompt

For production deployments, use a system prompt to enforce tone, length, and format across all alerts:

```python
response = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=200,
    system=(
        "You are a safety alert system for an industrial facility. "
        "Write clear, calm, professional alerts. "
        "Always include: what happened, where, and what to do. "
        "Never exceed 3 sentences. Do not use markdown."
    ),
    messages=[{"role": "user", "content": event_prompt}],
)
```

## Multi-Language Alerts

If your workforce spans multiple languages, add a language parameter:

```python
language = get_supervisor_language(on_call_supervisor)  # e.g., "Spanish"
prompt += f"\nWrite the alert in {language}."
```

## Escalation Scoring

Ask the LLM to also return a severity score alongside the message:

```python
prompt = """
...event context...

Respond as JSON:
{
  "message": "Alert text here",
  "severity": "low" | "medium" | "high" | "critical",
  "suggested_action": "One-sentence action for the supervisor"
}
"""
```

Then route the alert based on severity: `critical` triggers a phone call, `high` sends to Slack, `medium` logs to the dashboard, `low` is silently recorded.
