---
title: OpenVINO Backend Architecture
order: 12
---

This document provides a high-level technical overview of how the Atriva AI Runtime integrates with OpenVINO.

# 1. Overview

The Atriva Runtime implements a unified inference abstraction layer with pluggable backends for Atriva Core API.
The OpenVINO backend provides CPU/GPU/NPU execution using the OpenVINO Runtime API.

User API → Atriva Runtime → OpenVINO Backend → Device Plugin (CPU/GPU/NPU)

# 2. Components

### **1. Frontend API**
- Model loading
- Tensor creation
- Stream (pipeline) execution
- Async engine

### **2. Backend Driver (OpenVINO)**
- Manages OpenVINO `Core`
- Compiles models
- Caches dynamic shapes
- Manages async inference requests

### **3. Device Manager**
Responsible for automatic device selection:
- AUTO (GPU → NPU → CPU priority)
- Explicit device selection
- Device validation and fallback

### **4. Memory Manager**
- Maps numpy → OpenVINO `Tensor`
- Controls FP16 conversion
- Ensures pinned device memory for GPU/NPU

# 3. Execution Flow

load_model()
↓ read_model()
↓ compile_model(device)
↓ return CompiledModelHandle

### Inference

run(inputs)
↓ preprocess tensors
↓ start infer request
↓ wait for completion
↓ return outputs

# 4. Async Pipeline (Recommended for Video)

Atriva wraps OpenVINO async requests:

```python
create_async_request()
start(inputs)
wait()
```

This allows:
- Preprocessing next frame during inference
- NPU/GPU overlap with CPU tasks
- Zero-copy buffer reuse

# 5. Device Plugins

| Device | Plugin | Notes |
|--------|--------|-------|
| CPU | `CPU` | Best INT8 performance |
| GPU | `GPU` | Level Zero + oneAPI |
| NPU | `NPU` | Meteor Lake AI Boost |

Device plugin capabilities are detected using:

```python
ie.available_devices
```

# 6. Dynamic Shape Caching
OpenVINO can compile new shapes on demand.

Atriva caches each compiled subgraph:

```scss
scss
(shape_signature) → compiled_model
```

This ensures:
- Fast warm-up after first inference
- Dynamic resolution support for video analytics

# 7. Zero-Copy Strategy
Atriva tries to minimize memory copies:
- For CPU → always zero-copy
- For GPU/NPU → staging buffers reused
- Conversion to FP16 done once during stream initialization

# 8. Future Enhancements

- Graph rewriting for NPU-optimized subgraphs
- Multi-device inference (split workloads)
- Hardware-aware quantization interface

Next Step
➡️ Proceed to Samples for working code examples.