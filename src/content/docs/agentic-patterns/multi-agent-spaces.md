---
title: Multi-Agent Smart Spaces
description: Architecture pattern for deploying per-camera observer agents coordinated by a supervisor agent — enabling autonomous monitoring of complex multi-camera environments.
order: 53
---

A single agent handling events from 30 cameras simultaneously creates a bottleneck and conflates unrelated contexts. The multi-agent pattern solves this by giving each camera (or zone) its own **observer agent**, coordinated by a **supervisor agent** that sees the big picture.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Supervisor Agent                      │
│  - Cross-camera correlation                              │
│  - Escalation decisions                                  │
│  - Shift summaries and daily reports                     │
│  - Coordinating responses across zones                   │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
    ┌────────▼───┐  ┌───────▼────┐  ┌─────▼──────┐
    │  Observer   │  │  Observer  │  │  Observer  │
    │  Agent:     │  │  Agent:    │  │  Agent:    │
    │  Cam 01     │  │  Cam 02    │  │  Cam 03    │
    │  (entrance) │  │  (dock)    │  │  (floor)   │
    └────────┬───┘  └───────┬────┘  └─────┬──────┘
             │              │              │
    ┌────────▼───┐  ┌───────▼────┐  ┌─────▼──────┐
    │   Atriva   │  │   Atriva   │  │   Atriva   │
    │  Pipeline  │  │  Pipeline  │  │  Pipeline  │
    └────────────┘  └────────────┘  └────────────┘
```

## Observer Agent

Each observer agent has a narrow, stateful responsibility: monitor its camera's event stream, maintain local context (e.g., how many violations have occurred this shift), and report upward to the supervisor.

```python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class ObserverAgent:
    camera_id: str
    zone: str
    violation_count: int = 0
    last_event_time: datetime | None = None
    recent_events: list = field(default_factory=list)

    def receive_event(self, event: dict) -> dict | None:
        self.violation_count += 1
        self.last_event_time = datetime.fromisoformat(event["timestamp"])
        self.recent_events.append(event)

        # Keep a rolling window of the last 10 events
        self.recent_events = self.recent_events[-10:]

        # Only escalate to supervisor if threshold crossed
        if self.violation_count >= 3:
            return self._build_escalation_report()
        return None

    def _build_escalation_report(self) -> dict:
        return {
            "camera_id": self.camera_id,
            "zone": self.zone,
            "violation_count": self.violation_count,
            "recent_events": self.recent_events,
            "summary": f"{self.violation_count} violations in {self.zone} this session",
        }
```

## Supervisor Agent

The supervisor agent receives escalation reports from observers and makes cross-camera decisions: Is this a coordinated incident? Does it warrant an emergency response? What should the shift summary say?

```python
import anthropic
import json

client = anthropic.Anthropic()

def supervisor_analyze(escalation_reports: list[dict]) -> str:
    reports_json = json.dumps(escalation_reports, indent=2, default=str)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=(
            "You are a facility safety supervisor AI. "
            "You receive escalation reports from camera observer agents. "
            "Your job: identify patterns, assess overall risk, and recommend coordinated actions. "
            "Be concise and decisive."
        ),
        messages=[
            {
                "role": "user",
                "content": f"""
Multiple observer agents have escalated the following reports:

{reports_json}

Analyze:
1. Are any incidents correlated across zones?
2. What is the overall facility risk level right now?
3. What immediate actions should the operations team take?
4. Are any cameras showing systemic issues vs. isolated incidents?

Respond in structured JSON with keys: risk_level, correlated_incidents, immediate_actions, systemic_issues.
""",
            }
        ],
    )
    return response.content[0].text


def run_supervisor_cycle(observer_agents: dict[str, ObserverAgent], new_events: list[dict]):
    escalations = []

    for event in new_events:
        agent = observer_agents.get(event["camera_id"])
        if agent:
            report = agent.receive_event(event)
            if report:
                escalations.append(report)

    if escalations:
        analysis = supervisor_analyze(escalations)
        print("Supervisor analysis:", analysis)
        # Route to Slack, dashboard, or incident system
```

## Shift Summary

At end of shift, the supervisor agent can synthesize all observer state into a natural language shift report:

```python
def generate_shift_summary(observer_agents: dict[str, ObserverAgent]) -> str:
    agent_states = [
        {
            "camera": agent.camera_id,
            "zone": agent.zone,
            "violations": agent.violation_count,
            "last_event": str(agent.last_event_time),
        }
        for agent in observer_agents.values()
    ]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[
            {
                "role": "user",
                "content": f"""
Write a concise end-of-shift safety report for the facility manager.
Observer agent data: {json.dumps(agent_states, indent=2)}

Include: total violations by zone, highest-risk area, trend vs. yesterday if known, recommended focus for next shift.
""",
            }
        ],
    )
    return response.content[0].text
```

## Scaling Considerations

- **One observer per camera** works for up to ~50 cameras on a single backend process. Beyond that, shard observer agents across worker processes.
- **Supervisor polling interval**: run the supervisor cycle every 60–300 seconds. Real-time supervisor calls are rarely necessary — escalation thresholds handle urgency.
- **State persistence**: store observer state in Redis or a lightweight DB so it survives restarts and provides shift-over-shift history.
- **Cost**: observer agents use no LLM calls unless they escalate. Only the supervisor calls an LLM, and only when escalations arrive. Total LLM cost scales with incident rate, not camera count.
