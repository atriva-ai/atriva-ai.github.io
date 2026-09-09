---
title: "When Cloud Compute Runs Short, Who Owns Your Inference?"
description: "The WSJ reported that 60%+ of planned 2027 data-center capacity hadn't broken ground. If your video analytics depends on cloud inference, that's your SLA problem too."
pubDate: 2026-05-20
author: "Atriva Team"
tags: ["edge ai", "cloud infrastructure", "inference", "deployment", "video analytics"]
---

In May, the Wall Street Journal reported that more than 60% of planned 2027 data-center capacity hadn't yet broken ground. The buildout that was supposed to feed the AI demand surge is behind schedule, and the gap between announced capacity and built capacity is widening.

This isn't a doomsday story. Data centers will get built. But the headline points at something worth thinking through if you're deploying AI at physical sites: cloud inference is a shared resource on someone else's build schedule. Edge inference runs on hardware you own, on a site you control.

## What "shared resource" actually means

When you call a cloud inference API, you're renting time on a GPU cluster that also serves thousands of other customers. During normal conditions, that's fine. During peak load — a new model launch, a viral application, a capacity crunch — you're in a queue.

For most AI applications, a few hundred extra milliseconds of latency doesn't matter. For video analytics at a physical site, it often does.

Consider a fall detection system in a care home. The camera sees a resident fall. The system needs to alert staff within seconds. If your inference pipeline routes video frames to a cloud endpoint, your alert latency is now a function of:

- Your uplink bandwidth (variable)
- Cloud endpoint load (outside your control)
- The round-trip network path (geography-dependent)

Stack those variables and you can see how a real-time safety application becomes unreliable when it depends on someone else's capacity.

## The bandwidth math

Before latency, there's a simpler problem: getting the video to the cloud in the first place.

A single 1080p camera at 30fps, H.264 compressed, runs roughly 2–8 Mbps depending on scene complexity. Eight cameras: 16–64 Mbps sustained upload, continuously, 24 hours a day.

Most commercial internet connections — even fiber — have asymmetric bandwidth. A 500Mbps down / 50Mbps up connection can't stream 8 cameras continuously for real-time cloud inference without either degrading other traffic or dropping frames.

So in practice, systems that claim to do "cloud AI video analytics" are usually doing one of two things: selecting frames to send (losing the continuous observation model) or pre-processing on-site anyway (in which case the "cloud" is only getting a compressed event, not raw video). The edge compute was always there — it just wasn't acknowledged.

## Ownership changes the calculus

When you deploy edge inference on-site, a few things change:

**Latency is deterministic.** The inference runs on hardware in the same building, on the same LAN segment as the cameras. There's no external network in the critical path. Detection latency is measured in milliseconds, not seconds.

**Availability is local.** If your ISP has an outage, the safety monitor still runs. Events are queued locally and synced when connectivity returns. The system degrades gracefully instead of failing completely.

**Capacity is fixed.** The hardware you buy is the hardware you get. No pricing changes, no quota limits, no capacity crunch driven by someone else's demand. You know exactly what the system can process.

**Data stays on-site.** For regulated environments — healthcare, finance, government — footage leaving the building is often a compliance problem before it's a technical one. Local inference means the raw video never leaves the LAN. Only structured events (timestamps, bounding boxes, confidence scores) need to be transmitted.

## Where this matters most

Not every video analytics application needs local inference. If you're running batch analytics on archived footage, cloud works fine. If you're doing nightly aggregation of anonymized metrics, cloud is cheaper.

The case for edge inference is specific: applications that need low latency, need to run continuously without internet dependency, or operate in environments where raw footage leaving the building is a problem.

That covers most of the deployments we work on. Safety monitoring, access control, queue detection, parking occupancy — all of them have a real-time component where the value is in the immediate alert, not the end-of-day report.

## The compute wall is a supply chain signal

The WSJ's reporting isn't predicting a collapse in cloud AI capacity. It's describing the normal messiness of a buildout that's moving faster than construction timelines allow.

But for anyone making architecture decisions today — how should we deploy this video analytics system? — the signal is worth hearing. Cloud capacity is a shared resource with supply constraints. Edge compute is a capital purchase with fixed, predictable behavior.

If your use case requires consistent performance at a physical site, owning the compute changes the risk profile. You're not exposed to queue times, capacity auctions, or your cloud provider's build schedule.

The cameras are already on your site. The server that processes what they see probably should be too.
