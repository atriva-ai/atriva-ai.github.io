---
title: "Building a VLM-Augmented Safety Monitor with Atriva"
description: "A practical tutorial: wire Atriva's edge AI safety detection to a VLM to get automated incident reports, severity scoring, and natural-language alerts — with real code."
pubDate: 2026-03-25
author: "Atriva Team"
tags: ["tutorial", "vlm", "safety", "edge ai", "python", "claude", "openai"]
---

This is a hands-on tutorial. By the end you'll have a working system where:

1. Atriva detects safety violations on-device in real time
2. Each violation triggers a VLM (Claude or GPT-4V) to analyze the snapshot
3. The VLM generates a structured incident report with severity scoring
4. The report is routed to Slack and logged to a database

No custom model training required. You're composing existing tools.

## What You'll Need

- An Atriva deployment with the Safety Monitor (see [quickstart](/docs/quickstart))
- Python 3.11+
- An Anthropic or OpenAI API key
- A Slack webhook URL (optional but recommended)
- ~30 minutes

## Step 1: Understand the Event Schema

When Atriva detects a safety violation, it POSTs a webhook to your configured endpoint. A PPE violation event looks like this:

```json
{
  "event_id": "evt_01J9XABCDEF",
  "type": "ppe_violation",
  "confidence": 0.91,
  "timestamp": "2026-04-26T08:32:11Z",
  "camera_id": "cam_warehouse_north",
  "zone": "loading_dock",
  "snapshot_url": "http://192.168.1.50/snapshots/evt_01J9XABCDEF.jpg",
  "metadata": {
    "missing_ppe": ["helmet", "high_vis_vest"],
    "worker_count": 1
  }
}
```

The `snapshot_url` is served directly from the edge device on your local network. Other event types follow the same structure — `fall`, `intrusion`, `crowd_surge` — with type-specific metadata fields.

## Step 2: Set Up the Webhook Receiver

Install dependencies:

```bash
pip install fastapi uvicorn anthropic httpx python-dotenv
```

Create `server.py`:

```python
from fastapi import FastAPI, Request, BackgroundTasks
from dotenv import load_dotenv
import httpx, anthropic, base64, json, os
from datetime import datetime

load_dotenv()

app = FastAPI()
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
SLACK_WEBHOOK = os.environ.get("SLACK_WEBHOOK_URL")

ZONE_PROFILES = {
    "loading_dock": {"risk": "high", "context": "Active forklift operations. PPE mandatory at all times."},
    "assembly_floor": {"risk": "medium", "context": "Rotating machinery present. Hard hat and safety boots required."},
    "office_entry": {"risk": "low", "context": "Administrative area. PPE not required."},
}

@app.post("/atriva/webhook")
async def receive_event(request: Request, background: BackgroundTasks):
    event = await request.json()

    # Filter: only process high-confidence, actionable events
    if event["confidence"] >= 0.80 and event["type"] in ("ppe_violation", "fall", "intrusion"):
        background.add_task(process_event, event)

    return {"status": "ok"}

async def process_event(event: dict):
    report = await analyze_with_vlm(event)
    await log_incident(event, report)

    if report["severity"] in ("high", "critical"):
        await send_slack_alert(event, report)
```

## Step 3: VLM Analysis

```python
async def analyze_with_vlm(event: dict) -> dict:
    # Fetch snapshot from edge device
    async with httpx.AsyncClient() as http:
        response = await http.get(event["snapshot_url"], timeout=10)
    img_b64 = base64.standard_b64encode(response.content).decode()

    zone = event["zone"]
    zone_info = ZONE_PROFILES.get(zone, {"risk": "unknown", "context": "No zone profile available."})
    missing = event["metadata"].get("missing_ppe", [])

    prompt = f"""
You are a workplace safety analyst reviewing an AI-detected safety incident.

Incident details:
- Type: {event['type']}
- Zone: {zone} (base risk: {zone_info['risk']})
- Zone context: {zone_info['context']}
- Missing PPE detected: {', '.join(missing) if missing else 'N/A'}
- Detection confidence: {event['confidence']:.0%}
- Time: {event['timestamp']}

Analyze the image and respond as JSON with exactly these fields:
{{
  "violation_confirmed": true | false,
  "severity": "low" | "medium" | "high" | "critical",
  "worker_activity": "Brief description of what the worker appears to be doing",
  "immediate_risk": "Description of the immediate physical risk",
  "incident_log_entry": "One-sentence log entry for the compliance record",
  "recommended_action": "One clear action for the shift supervisor"
}}
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": "image/jpeg", "data": img_b64},
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )

    # Parse the JSON response
    raw = response.content[0].text
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: extract JSON block if LLM wrapped it in markdown
        import re
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        return json.loads(match.group()) if match else {"severity": "medium", "incident_log_entry": raw}
```

## Step 4: Slack Alert

```python
async def send_slack_alert(event: dict, report: dict):
    if not SLACK_WEBHOOK:
        return

    severity_colors = {
        "low": "#36a64f",
        "medium": "#ff9900",
        "high": "#E53E3E",
        "critical": "#6B0000",
    }
    color = severity_colors.get(report.get("severity", "medium"), "#ff9900")

    payload = {
        "text": f"*Safety Alert — {event['zone']}*",
        "attachments": [
            {
                "color": color,
                "fields": [
                    {"title": "Incident", "value": report.get("incident_log_entry", ""), "short": False},
                    {"title": "Action Required", "value": report.get("recommended_action", ""), "short": False},
                    {"title": "Severity", "value": report.get("severity", "").upper(), "short": True},
                    {"title": "Camera", "value": event["camera_id"], "short": True},
                ],
                "image_url": event.get("snapshot_url"),
                "footer": f"Atriva Safety Monitor • {event['timestamp']}",
            }
        ],
    }

    async with httpx.AsyncClient() as http:
        await http.post(SLACK_WEBHOOK, json=payload)
```

## Step 5: Incident Log

```python
import sqlite3
from pathlib import Path

DB_PATH = Path("incidents.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            timestamp TEXT,
            camera_id TEXT,
            zone TEXT,
            event_type TEXT,
            confidence REAL,
            severity TEXT,
            vlm_confirmed INTEGER,
            log_entry TEXT,
            recommended_action TEXT,
            raw_event TEXT,
            raw_report TEXT
        )
    """)
    conn.commit()
    conn.close()

async def log_incident(event: dict, report: dict):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR IGNORE INTO incidents VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        (
            event["event_id"],
            event["timestamp"],
            event["camera_id"],
            event["zone"],
            event["type"],
            event["confidence"],
            report.get("severity"),
            int(report.get("violation_confirmed", False)),
            report.get("incident_log_entry"),
            report.get("recommended_action"),
            json.dumps(event),
            json.dumps(report),
        ),
    )
    conn.commit()
    conn.close()

init_db()
```

## Step 6: Run It

```bash
# Set environment variables
export ANTHROPIC_API_KEY=sk-ant-...
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8080
```

Configure Atriva to POST safety events to `http://your-server:8080/atriva/webhook`.

## What You Built

Every safety violation Atriva detects now triggers:
1. A VLM visual confirmation (not just model confidence — actual visual reasoning)
2. A severity score that accounts for zone risk context
3. A natural-language log entry for compliance records
4. An automatically routed Slack alert for high/critical incidents
5. A persistent audit trail in SQLite

## Next Steps

- Replace SQLite with Postgres for production
- Add a dashboard that queries incidents by zone, shift, and severity
- Use Claude's extended thinking for ambiguous edge cases where the VLM is less confident
- Implement the [multi-agent pattern](/docs/agentic-patterns/multi-agent-spaces) to correlate incidents across cameras
