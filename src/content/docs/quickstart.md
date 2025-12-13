---
title: Quickstart Guide
order: 1
---

This quickstart focuses **only** on the core repo:
[https://github.com/atriva-ai/ai-inference-ov](https://github.com/atriva-ai/ai-inference-ov)

It walks beginners through:

1. Running inference locally with Python venv using built‑in models
2. Running inference inside Docker using built‑in models
3. Running inference with your own custom OpenVINO-ready models

It also references the **test apps** inside the `/tests` directory, since we do not yet have full example applications.

---

## 1. Local Testing (Python venv)

### **Prerequisites**

* Python 3.10+
* OpenVINO installed (or let the repo install dependencies)
* Git
* macOS / Linux / Windows

### **Steps**

```bash
git clone https://github.com/atriva-ai/ai-inference-ov.git
cd ai-inference-ov
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **Run the built-in test app**

Inside the repo:

```
/tests/
    test_yolov8_openvino.py
    test_vehicle_trackign.py
    test_api.py
```

Example:

```bash
python tests/test_yolov8_openvino.py
```

This will automatically load one of the built-in OpenVINO IR models under `/models`.

You should see console output showing:

* Model loaded successfully
* Inference time
* Final prediction

---

## 2. Testing Via Docker

If you prefer containerized inference:

```bash
docker build -t atriva-ai-inference .
docker run --rm atriva-ai-inference
```

The Docker container will:

* Install OpenVINO
* Copy the repo
* Run the same test scripts located in `/tests`

To run a specific test:

```bash
docker run --rm atriva-ai-inference python tests/test_detection.py
```

---

## 3. Use Your Own Models

OpenVINO requires IR format:

* `model.xml`
* `model.bin`

### Place your model:

```
/models/custom/<your_model_folder>/model.xml
/models/custom/<your_model_folder>/model.bin
```

### Update your test script

Modify one of the test scripts to:

```python
MODEL_PATH = "models/custom/your_model/model.xml"
```

Run:

```bash
python tests/test_image_classification.py
```

