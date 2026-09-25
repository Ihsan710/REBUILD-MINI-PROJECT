# 🧠 ReBuild — AI Material Recognition Training Guide
### Construction & Demolition Waste (CDW) Computer Vision Model

This guide explains step-by-step how to add images, train, evaluate, export, and deploy the AI Computer Vision model used by ReBuild to automatically classify construction materials (*Brick, Concrete, Metal, Wood, Drywall, Ceramic, Asphalt, Glass, Plastic, Cabling, Roofing, Stone*).

---

## 🏗️ 1. Architecture Overview
- **Backbone**: `ResNet-34` / `MobileNetV3-Large` pre-trained on ImageNet.
- **Transfer Learning Head**: Dropout(0.3) $\rightarrow$ Linear(512 $\rightarrow$ 256) $\rightarrow$ ReLU $\rightarrow$ BatchNorm $\rightarrow$ Dropout(0.2) $\rightarrow$ Linear(256 $\rightarrow$ 7 Classes).
- **Target Material Classes (7 Core CDW Classes)**:
  1. `Brick` (Clay masonry, paver bricks, terracotta)
  2. `Concrete` (Crushed aggregate, rubble, cement slab pieces)
  3. `Metal` (Rebar, structural steel beams, pipes, iron scraps)
  4. `Wood` (Formwork planks, timber beams, plywood)
  5. `Drywall` (Gypsum plasterboard panels, sheetrock)
  6. `Glass` (Architectural float glass, curtain wall panes)
  7. `Stone` (Natural granite blocks, limestone, marble curbs)

---

## 📸 2. How to Add More Images to the Dataset

### Method A: Automated Ingestion Tool (Fastest & Easiest)
Use the included CLI tool to add single photos or entire folders. It automatically creates train/validation splits:

```bash
# 1. View current image counts across all 12 classes
node ai_training/add_images.js

# 2. Add a single photo to a class (e.g. Concrete)
node ai_training/add_images.js --class Concrete --file "C:/path/to/my_concrete_rubble.jpg"

# 3. Add an entire folder of photos (auto-splits 80% train / 20% val)
node ai_training/add_images.js --class Brick --folder "C:/path/to/downloaded_brick_photos/"
node ai_training/add_images.js --class Metal --folder "C:/path/to/scrap_metal_photos/"
```

### Method B: Drag & Drop Directly into Folders
You can copy & paste `.jpg`, `.png`, `.webp`, or `.bmp` images directly into:
```
ai_training/dataset/
├── train/
│   ├── Brick/
│   ├── Concrete/
│   ├── Metal/
│   ├── Wood/
│   ├── Drywall/
│   ├── Ceramic/
│   ├── Asphalt/
│   ├── Glass/
│   ├── Plastic/
│   ├── Cabling/
│   ├── Roofing/
│   └── Stone/
└── val/
    ├── Brick/
    └── ... (same 12 classes)
```

> **High Quality Free CDW Datasets to Download:**
> - **Roboflow Universe**: [Construction Demolition Waste (CDW) Dataset](https://universe.roboflow.com/search?q=construction+demolition+waste)
> - **Kaggle**: [Construction Material Identification Dataset](https://www.kaggle.com/datasets?search=construction+waste)
> - **Mendeley Data**: [C&D Waste Images Classification Dataset](https://data.mendeley.com/datasets/k5p869n823/1)

---

## ⚡ 3. Installation & Requirements

Install the required Python dependencies:

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install fastapi uvicorn pillow scikit-learn onnx
```

---

## 🚀 4. How to Train the Model

To begin model training with cosine annealing learning rate scheduler, transfer learning, and automatic checkpointing:

```bash
cd ai_training
python train_model.py --data_dir ./dataset --epochs 25 --batch_size 32 --lr 0.0003 --model resnet34
```

### What Happens During Training:
1. **Data Augmentations**: Applied on the fly (Random Crops, 15° Rotations, Color Jitters, Horizontal Flips) to simulate harsh construction site lighting and dust.
2. **Validation Loop**: Runs after every epoch; calculates loss and accuracy.
3. **Best Weights**: Automatically saved to `best_cdw_model.pt`.
4. **ONNX Export**: Automatically generates `cdw_model.onnx` for sub-40ms high-speed inference.

---

## 🌐 5. Deploying the Trained Model to ReBuild

Run the inference microservice or use the built-in Express backend:

```bash
python ai_training/inference_server.py
```

The server listens on `http://localhost:8000/api/classify`.
Whenever a site engineer or contractor drags-and-drops a photo in **[`/waste`](http://localhost:4200/waste)** on the ReBuild web platform, the image is automatically classified and anti-spoof verified!

