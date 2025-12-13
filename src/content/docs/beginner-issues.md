---
title: Beginner Issues
order: 5
---

This document lists beginner‑friendly issues intended for new contributors joining the Atriva AI Inference (OpenVINO) project. These are specifically chosen to help new grads understand the structure, codebase, and workflow with minimal complexity.

Each issue includes:

* Goal
* Location in repo
* Expected difficulty
* Skills learned

---

## 1. Add Comments to Test Scripts

**Goal:** Improve readability of `/tests/test_image_classification.py` and `/tests/test_detection.py`.

**Skills:** Python, reading inference code.

---

## 2. Improve Logging in Inference API

**Goal:** Add `INFO` logs when model loads, preprocess runs, and inference completes.

**Skills:** Python logging, tracing pipelines.

---

## 3. Add Model Validation Check

**Goal:** Modify model loader to verify `model.xml` and `model.bin` exist before loading.

**Skills:** Python error handling.

---

## 4. Add Simple Timing Utility

**Goal:** Create a small utility to measure inference latency inside the API.

**Skills:** Python decorators or `time` module.

---

## 5. Add a New Test Script for Segmentation

**Goal:** Add `/tests/test_segmentation.py` with basic inference flow.

**Skills:** Understanding inference classes.

---

## 6. Add Docstrings to Core Modules

**Goal:** Add docstrings to `inference_engine.py` and `model_loader.py`.

**Skills:** Documentation, Python readability.

---

## 7. Add Error Handling for Unsupported Model Types

**Goal:** If user loads a non-IR model, the system should return a clear error.

**Skills:** Validation, Python exceptions.

---

## 8. Create Basic Unit Test for Model Loader

**Goal:** Add a simple test to verify model loads in CI or local test.

**Skills:** pytest basics.

---

## 9. Add Example of Custom Model Path in Tests

**Goal:** Update test script to show how to load a model from `/models/custom`.

**Skills:** Model paths, filesystem.

---

## 10. Clean Up `requirements.txt`

**Goal:** Remove unused packages and pin minimum versions.

**Skills:** Package management.

