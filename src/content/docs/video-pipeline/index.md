---
title: Atrvia Video Pipeline Service
order: 20
---

The video pipeline orchestrates data flow from input to output.

It connects:
- Sources (RTSP, RTMP, files)
- Decoding and frame extraction
- Inference services
- Analytics and sinks

Pipelines are configurable and reusable.

## Implementations

| Platform | Status | Description |
|----------|--------|-------------|
| [FFmpeg x86](./ffmpeg-x86/README.md) | ✅ Active | FFmpeg-based pipeline for x86/x64 Linux |

## Coming Soon

- Rockchip MPP pipeline
- Jetson multimedia pipeline
- Hardware-accelerated ARM pipelines
