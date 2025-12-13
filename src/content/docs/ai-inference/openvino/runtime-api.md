---
title: OpenVINO Inference API
order: 15
---

This page documents how the Atriva AI Inference Runtime integrates with OpenVINO and provides a unified API across CPU/GPU/NPU backends.

The API abstracts device selection, memory formats, async execution, and tensor lifecycle so you can run any OpenVINO IR model with minimal boilerplate.

---

# 1. Initialize Runtime

```python
from atriva_inference import InferenceRuntime

runtime = InferenceRuntime(backend="openvino")
```

Available backends:

| Name          | Devices                     |
| ------------- | --------------------------- |
| `openvino`    | CPU, GPU, NPU (Meteor Lake) |
| `onnxruntime` | CPU / CUDA                  |
| `tensorrt`    | NVIDIA GPU                  |

# 2. Load a Model

```python
model = runtime.load_model(
    model_path="ir/model.xml",
    device="AUTO"  # CPU / GPU / NPU / AUTO
)
```

Device Options

- "AUTO" → Prefer GPU → NPU → CPU
- "CPU" → FP32/FP16/INT8
- "GPU" → iGPU or Arc
- "NPU" → Meteor Lake AI Boost

# 3. Prepare Input Tensors

d into a runtime tensor:

```python
tensor = runtime.tensor_from_numpy(
    np_array, layout="NCHW"
)
```

The runtime will:

- Normalize dtype
- Convert layout when needed
- Allocate device-optimized memory

# 4. Execute Synchronously

```python
output = model.run({"input": tensor})
```
Output is a dict mapping output names → tensors.

Convert to numpy:

```python
output_np = output["output"].to_numpy()
```

# 5. Execute Asynchronously

For pipelines (video analytics), async mode is preferred:

```python
request = model.create_async_request()

request.start({"input": tensor})
result = request.wait()
```

wait() blocks until inference completes.

# 6. Reusable Execution Stream (Performance Recommended)

```python
stream = model.create_stream()

for frame in frames:
    inp = runtime.tensor_from_numpy(frame)
    out = stream.run({"input": inp})
```

Stream keeps the model compiled and reuses device buffers.

# 7. Working With Dynamic Shapes

If your IR model has dynamic inputs:

```python
tensor = runtime.tensor_from_numpy(
    np_array,
    shape_override=(1, 3, h, w)
)
```

OpenVINO compiles a new shape on first use, then caches it.

# 8. Performance Profiling
```python
profile = model.get_profiling()
print(profile)
```

Typical metrics:
- Layer execution time
- Memory transfers
- Device overhead

# 9. Error Handling
```python
try:
    output = model.run(inputs)
except InferenceRuntimeError as e:
    print("Inference error:", e)
```

Next Step
➡️ Continue to Architecture