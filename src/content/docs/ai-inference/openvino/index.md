---
title: OpenVINO Overview
order: 11
---

This section documents how to use the OpenVINO backend inside the Atriva AI Community Runtime.
OpenVINO provides highly optimized inference on Intel CPU, iGPU, and NPU (Meteor Lake/AI Boost).

## Structure

- **Installation**  
  Install OpenVINO, required system packages, and verify hardware support.

- **Model Preparation**  
  Convert models to OpenVINO IR, quantize (INT8/FP16), and validate model compatibility.

- **Runtime API**  
  How Atriva's unified inference runtime loads OpenVINO models, manages tensors, and schedules execution.

- **Architecture**  
  Backend design, device selection logic, async pipelines, and buffer lifecycle.

- **Samples**  
  Minimal working examples for classification, detection, and video analytics.

## Supported Devices

| Hardware | Supported | Notes |
|---------|-----------|-------|
| Intel CPU (x86_64) | Yes | Best performance with FP16/INT8 |
| Intel iGPU | Yes | Uses OpenVINO GPU plugin |
| Intel NPU (Meteor Lake AI Boost) | Yes | Requires OpenVINO 2024.4+ |
| dGPU (Arc) | Yes | Uses Level Zero backend |

## Minimum Requirements
- Python 3.9+
- OpenVINO 2024.4 or newer
- ONNX 1.15+ (for model export)
- Linux (Ubuntu 22.04+) or Windows 11

---

# Quick Start

```bash
pip install openvino-dev
```

# Check device availability:

```
from openvino.runtime import Core
ie = Core()
print(ie.available_devices)
```

Continue with:

➡️ Installation

➡️ Model Preparation

