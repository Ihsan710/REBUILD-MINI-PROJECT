# 🏗️ ReBuild: Construction Waste Intelligence & Circular Marketplace

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-ResNet--34-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Accuracy](https://img.shields.io/badge/AI%20Accuracy-99.70%25-brightgreen)](https://github.com/Ihsan-m)

**ReBuild** is an enterprise-grade cyber-physical platform designed to solve the global **Construction & Demolition Waste (CDW)** crisis. Combining custom **PyTorch ResNet-34 Computer Vision**, an **Anti-Spoofing Fraud Filter**, a **B2B Circular Trading Marketplace**, and **ESG Carbon Accounting**, ReBuild diverts salvageable materials directly from landfills into active circular supply chains.

---

## 🌟 Key Platform Features

* **🧠 PyTorch ResNet-34 AI Classifier:** Sub-100ms real-time material classification trained on 1,490 high-resolution physical construction images achieving **99.70% validation accuracy**.
* **🛡️ Dual-Stage Anti-Spoofing Filter:** Rejects fake paperwork, certificates, homework, and non-construction photos using statistical pixel luminance and visual entropy analysis.
* **🧱 7 Core Industrial Materials:** Specialized recognition for **Brick**, **Concrete**, **Drywall**, **Glass**, **Metal**, **Stone**, and **Wood**.
* **🔄 B2B Circular Marketplace:** Enables contractors and recyclers to buy/sell reclaimed aggregates with real-time RFQ bidding.
* **📍 Haversine Proximity Logistics:** Computes exact transit kilometers and transit carbon surcharges between job sites and buyer destinations.
* **🚜 Machinery & Worker Dispatch Pool:** On-demand shared booking for mobile jaw crushers, hydraulic excavators, and certified operators.
* **🌱 Automated ESG Carbon Ledger:** Calculates certified metric tons of $\text{CO}_2\text{e}$ mitigated and tracks the municipal **Landfill Diversion Rate (LDR)**.
* **👥 Multi-Tenant RBAC:** Tailored dynamic portals for **Contractors**, **Procurement Buyers**, and **Governance Admins**.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               ANGULAR 21 FRONTEND (Port 4200)          │
│   Responsive SPA • Slide Pop-up Drawer • Leaflet Maps  │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP (JWT Bearer Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│              NODE.JS REST BACKEND (Port 8000)          │
│   Express • TypeScript • Helmet • Bcrypt-12 • Multer   │
└─────────────┬────────────────────────────┬─────────────┘
              │ Proxy Stream               │ Read/Write
              ▼                            ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│ PYTORCH FASTAPI (Port 5001│  │   PERSISTENCE LAYER     │
│ ResNet-34 (99.7% Accuracy)│  │ Disk Store / MySQL 8.0  │
└───────────────────────────┘  └─────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v18+ (v24 LTS recommended)
* **Python** 3.10+ (with PyTorch, Torchvision, FastAPI, Uvicorn)

### 1. Start the PyTorch AI Inference Service (Port 5001)
```powershell
cd ai_training
py inference_server.py
```

### 2. Start the Node.js REST API Backend (Port 8000)
```powershell
cd backend
npm install
npm run dev
```

### 3. Start the Angular Web Application (Port 4200)
```powershell
cd frontend
npm install
npm start
```
Open **`http://localhost:4200`** in your browser.

---

## 📊 AI Training & Validation Metrics

| Epoch | Train Loss | Train Accuracy | Val Loss | Val Accuracy | Milestone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Epoch 1** | 0.5904 | 82.99% | 0.0953 | 98.80% | Pre-trained feature activation |
| **Epoch 3** | 0.1384 | 96.72% | 0.0435 | 99.10% | Boundary refinement |
| **Epoch 7** | 0.0491 | 99.05% | 0.0231 | 99.70% | Optimal weights checkpoint |
| **Epoch 10** | **0.0298** | **99.48%** | **0.0217** | **99.70%** | **Saved `best_cdw_model.pt`** |

---

## 📄 Documentation & Reports
* Master Technical Specification PDF: [`ReBuild_Project_Full_Report.pdf`](./ReBuild_Project_Full_Report.pdf)
* Presentation Slides: [`ReBuild_50Percent_Project_Presentation.pptx`](./ReBuild_50Percent_Project_Presentation.pptx)

---

## 👨‍💻 Author & Academic Project
* **Lead Developer:** [Ihsan-m](https://github.com/Ihsan-m) (ihsanmuhammedin@gmail.com)
* **Version:** 2.4.0 (Enterprise Academic Release)
* **License:** MIT License
