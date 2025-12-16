---
title: High-Level System Architecture
order: 2
---



This document explains how the **frontend**, **backend**, **video pipeline**, and **AI inference engine** fit together.

Below is an ASCII diagram representing the major components.

```
                         ┌───────────────────────────┐
                         │        Frontend UI        │
                         │  (Web App / Dashboard)    │
                         │ - Streams status          │
                         │ - Shows analytics         │
                         │ - Manages devices/models  │
                         └─────────────┬─────────────┘
                                       │ REST / WebSocket
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                Backend Server                                    │
│                        (FastAPI / Python / OpenVINO)                             │
│                                                                                  │
│         ┌─────────────────────────────┬──────────────────────────────────┐       │
│         │ Device & Stream Manager     │ Model Manager                    │       │
│         │ - Add/remove cameras        │ - Load built-in models           │       │
│         │ - Configure pipelines       │ - Load user models               │       │
│         └───────────────┬─────────────┴──────────────────────────────────┘       │
│                         │                           ▲                            │
│                         │                           │ Calls Inference API        │
│                         ▼                           │                            │
│                  ┌───────────────────────────────────────────┐                   │
│                  │         Video Processing Pipeline         │                   │
│                  │       - Decode streams (RTSP/Files)       │                   │
│                  │       - Preprocess frames                 │                   │
│                  │       - Batch scheduling (optional)       │                   │
│                  └─────────────────────┬─────────────────────┘                   │
│                                        │                                         │
│                                        ▼                                         │
│                         ┌──────────────────────────────┐                         │
│                         │      AI Inference Engine     │                         │
│                         │  (Atriva AI – OV Runtime)    │                         │
│                         │ - Executes OpenVINO models   │                         │
│                         │ - Handles CPU / GPU / NPU    │                         │
│                         │ - Post-processing of results │                         │
│                         └──────────────────────────────┘                         │
│                                        │                                         │
│                                        ▼                                         │
│                         ┌──────────────────────────────┐                         │
│                         │   Results / Events / Frames  │                         │
│                         └──────────────────────────────┘                         │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
                            ┌───────────────────────────┐
                            │    Frontend Dashboard     │
                            │ - Object boxes            │
                            │ - Attributes              │
                            │ - Tracking                │
                            │ - Logs / analytics        │
                            └───────────────────────────┘
```

---

# Components Explained

### **1. Frontend**

* Web dashboard (Next.js, React, Svelte, Astro, etc.)
* Displays video overlays, analytics, system status
* Communicates with backend via REST + WebSockets

### **2. Backend API**

* FastAPI or similar framework
* Manages:

  * Video pipeline
  * Models
  * GPU/NPU device selection
  * Stream configuration

### **3. Video Pipeline**

* Pulls frames from camera or file
* Frame decoding (FFmpeg / GStreamer)
* Preprocessing: resize, normalize, color conversion
* Sends frames to inference asynchronously

### **4. AI Inference Engine (Atriva AI – OpenVINO)**

* Loads IR models
* Runs optimized inference on:

  * CPU (x86 / ARM)
  * Intel GPU
  * Intel NPU (Meteor Lake)
* Handles post-processing for:

  * Classification
  * Detection
  * Segmentation
  * Re-ID

### **5. Results Layer**

* Structures inference outputs
* Streams JSON results to frontend
* Can generate thumbnails or overlay frames
