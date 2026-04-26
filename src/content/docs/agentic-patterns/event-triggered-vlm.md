---
title: Event-Triggered VLM
description: How to call a VLM (GPT-4V, Claude, Gemini) when an Atriva edge event fires — for deeper visual analysis without continuous cloud inference.
order: 51
---

The core pattern: Atriva detects an event on-device → your backend receives the event webhook → you call a VLM with the event snapshot → the VLM provides richer analysis.

This keeps VLM costs proportional to actual incidents, not camera uptime.

## Architecture

```
Camera
  └─▶ Atriva Pipeline (on-device)
        └─▶ Detection: PPE violation (confidence 0.91)
              └─▶ POST /webhook → Your Backend
                    ├─▶ Fetch snapshot from Atriva
                    └─▶ Call VLM API with snapshot + prompt
                          └─▶ VLM response → Store / Alert / Report
```

## Event Payload

When Atriva fires a webhook, the payload looks like:

```json
{
  "event_id": "evt_01J9X...",
  "type": "ppe_violation",
  "confidence": 0.91,
  "timestamp": "2025-04-26T08:32:11Z",
  "camera_id": "cam_warehouse_north",
  "zone": "loading_dock",
  "snapshot_url": "http://edge-device/snapshots/evt_01J9X.jpg",
  "metadata": {
    "missing_ppe": ["helmet", "high_vis_vest"],
    "worker_count": 1
  }
}
```

## Calling a VLM

### Python example (Claude claude-sonnet-4-6)

```python
import anthropic
import httpx
import base64

def handle_atriva_event(event: dict) -> str:
    # Fetch snapshot from the edge device
    img_bytes = httpx.get(event["snapshot_url"]).content
    img_b64 = base64.standard_b64encode(img_bytes).decode()

    client = anthropic.Anthropic()

    prompt = f"""
You are a workplace safety analyst. An AI system detected a PPE violation.

Event details:
- Type: {event['type']}
- Zone: {event['zone']}
- Missing PPE: {event['metadata']['missing_ppe']}
- Confidence: {event['confidence']}

Analyze the image and:
1. Confirm whether the violation is visible
2. Describe the worker's location and activity
3. Assess the immediate safety risk (low / medium / high)
4. Write one sentence for the incident log
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": img_b64,
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )
    return response.content[0].text
```

### Python example (OpenAI GPT-4o)

```python
import openai, httpx, base64

def handle_atriva_event(event: dict) -> str:
    img_bytes = httpx.get(event["snapshot_url"]).content
    img_b64 = base64.standard_b64encode(img_bytes).decode()

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Analyze this PPE violation event: {event}"},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}},
                ],
            }
        ],
        max_tokens=512,
    )
    return response.choices[0].message.content
```

## Webhook Receiver (FastAPI)

```python
from fastapi import FastAPI, Request
import asyncio

app = FastAPI()

@app.post("/atriva/webhook")
async def receive_event(request: Request):
    event = await request.json()

    # Only call VLM for high-confidence, actionable events
    if event["confidence"] >= 0.85 and event["type"] in ("ppe_violation", "fall", "intrusion"):
        analysis = handle_atriva_event(event)
        await store_incident(event, analysis)
        await route_alert(event, analysis)

    return {"status": "ok"}
```

## Tips

- **Cache snapshots locally** before passing to the VLM — the edge device snapshot URL may expire.
- **Batch low-urgency events** (e.g., queue depth analytics) and send to the VLM hourly rather than in real time.
- **Gate by confidence** — only invoke the VLM when Atriva's confidence exceeds your threshold (e.g., 0.85+).
- **Use structured output** — ask the VLM to respond in JSON so downstream systems can parse risk level and log entry programmatically.
