---
title: OpenVINO Inference Samples
order: 16
---

This section provides minimal working examples for classification, object detection, and video processing using the Atriva OpenVINO backend.

# 1. Classification Example (CPU/GPU/NPU)

```python
import numpy as np
from atriva_inference import InferenceRuntime

runtime = InferenceRuntime("openvino")

model = runtime.load_model("models/resnet50.xml", device="AUTO")

img = np.random.rand(1, 3, 224, 224).astype("float32")
tensor = runtime.tensor_from_numpy(img)

output = model.run({"input": tensor})
print(output["prob"].to_numpy())
```

# 2. Object Detection Example (YOLOv8-OpenVINO)

```python
frame = np.random.rand(1, 3, 640, 640).astype("float32")

inp = runtime.tensor_from_numpy(frame)
out = model.run({"images": inp})

boxes = out["output0"].to_numpy()
print(boxes.shape)
```

# 3. Async Inference

```python
stream = model.create_stream()

for frame in video_frames:
    t = runtime.tensor_from_numpy(frame)
    out = stream.run({"input": t})
```

Benefits:
- Full pipeline overlap
- Best throughput for retail analytics

# 4. Video Pipeline Integration

```python
for frame in camera:
    resized = preprocess(frame)
    t = runtime.tensor_from_numpy(resized)
    det = stream.run({"input": t})
    draw(det)
```

# 5. Multi-Device Example

Force NPU:

```python
model = runtime.load_model("model.xml", device="NPU")
```
Force iGPU:

```python
model = runtime.load_model("model.xml", device="GPU")
```

CPU fallback:

```python
model = runtime.load_model("model.xml", device="CPU")
```

# 6. INT8 Model Loading

```python
model = runtime.load_model("models/int8/model.xml", device="CPU")
```

# 7. Working With Dynamic Shapes

```python
h, w = resized.shape[2:]
tensor = runtime.tensor_from_numpy(resized, shape_override=(1, 3, h, w))
result = model.run({"input": tensor})
```

More Coming
- Future samples:
- Person Re-ID
- Multi-stream video
- Atriva Tracking + OpenVINO detection
