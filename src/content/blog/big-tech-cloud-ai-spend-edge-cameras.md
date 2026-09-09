---
title: "Big Tech Is Spending $725B on Cloud AI. Your Cameras Are Already On-Site."
description: "While hyperscalers race to centralize compute in data centers, the cameras at your physical sites aren't moving. Here's what that means for where the intelligence should run."
pubDate: 2026-04-15
author: "Atriva Team"
tags: ["edge ai", "cloud ai", "video analytics", "deployment", "infrastructure"]
---

Earlier this year, analysts revised their 2026 hyperscaler capex guidance upward to roughly $725 billion. Microsoft, Google, Amazon, and Meta are all building more data centers, more GPU clusters, and more network capacity to centralize AI compute.

It's real infrastructure for a real demand curve. We're not arguing against it.

But there's a category of AI that this spending doesn't solve — and it's the one that runs at physical sites.

## The data gravity problem

A modern IP camera generates roughly 1–4 GB of raw video per hour at 1080p. Eight cameras on a single floor generates 8–32 GB per hour. Twenty cameras across a mid-size retail store or warehouse: you can do the math.

Sending all of that upstream to a cloud API isn't a routing problem. It's a physics problem. The bandwidth cost, the latency introduced, the privacy exposure of streaming footage offsite — none of it gets cheaper as you add cameras.

Cloud AI is optimized for the assumption that the data is already in the cloud, or can get there cheaply. For text, for documents, for structured records, that's often true. For continuous video from physical sites, it almost never is.

## What centralized compute misses

The $725B buildout is funding more capacity in a small number of locations. Virginia, Iowa, Singapore, Dublin. That's where the GPUs are. Your warehouse in Guadalajara, your retail floor in Manchester, your parking structure in Osaka — those are thousands of kilometers away from the inference cluster.

That distance has real consequences for video analytics:

- **Latency.** A fall detection alert that takes 800ms to round-trip to a cloud endpoint and back isn't useful to the person watching the floor. The event happened. You need inference in tens of milliseconds, not hundreds.
- **Bandwidth.** Even compressed, continuous video at scale is too expensive to ship upstream for real-time analysis. You'd be selecting frames to send, which means you've already lost the continuous observation model.
- **Availability.** Cloud endpoints go down. Network links go down. A safety system that stops working when the internet is slow is a liability, not an asset.

## The cameras are already there

Here's what's true at almost every physical site we've deployed at: the cameras are installed. The cable is run. The network is in place.

What's missing is local compute that can run useful inference on the video stream and emit structured events — a fall detected, a shelf empty, a vehicle in a restricted zone — rather than raw footage.

That compute fits in a 1U server, often smaller. It sits in the same rack as the NVR. It talks to the cameras on the same LAN segment. The inference happens in the same building as the event, in the same second.

No cloud dependency. No bandwidth bill. No latency. The result — a JSON event with a confidence score, a timestamp, and a snapshot — goes wherever you need it: a dashboard, a webhook, a ticket system.

## Where cloud still fits

We use cloud-side LLMs for specific things: generating incident summaries, natural-language alerting, post-event analysis of flagged snapshots. These are asynchronous, low-frequency, and involve small payloads — the right use case for a remote API call.

Real-time continuous inference stays on-site. Cloud gets the structured output, not the raw stream.

The split isn't ideological. It's just what works at the actual latency and bandwidth constraints of a physical site.

## The practical implication

$725B in cloud capex is going to make a lot of AI applications better and cheaper. It's good for the industry.

It's not going to make a camera smarter. The camera is on your site. The compute that processes what it sees should be too.

That's been true for three years, and the hyperscaler spend doesn't change it. If anything, as cloud AI becomes table stakes, on-site inference becomes the differentiator — the thing that lets you operate when the network is degraded, keep footage on-premises for compliance, and hit the latency targets that a physical environment actually requires.

The cameras are already there. The question is just whether you put the intelligence next to them.
