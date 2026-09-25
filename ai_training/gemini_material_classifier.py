"""
================================================================================
GEMINI MULTIMODAL MATERIAL RECOGNITION & AUTO-LABELING PIPELINE
================================================================================
Uses Google Gemini 1.5 Pro / Flash Multimodal Vision to inspect construction debris,
classify material class, estimate reuse/recycling condition, and output structured JSON.
================================================================================
"""

import os
import json
import base64
import argparse
from typing import Dict, Any

try:
    import google.generativeai as genai
except ImportError:
    print("[Notice] google-generativeai package not installed. Run: pip install google-generativeai")

SYSTEM_PROMPT = """
You are an expert Senior Construction & Demolition Waste (CDW) Materials Engineer and Computer Vision Auditor for the ReBuild Circular Marketplace.
Analyze the uploaded image of construction site debris or salvaged material.

Classify the primary material into EXACTLY ONE of these standard categories:
- Brick
- Concrete
- Wood
- Metal
- Drywall
- Plastic
- Asphalt
- Ceramic
- Mixed

Determine:
1. Primary material category
2. AI Confidence score (0.0 to 100.0)
3. Secondary material if mixed
4. Recommended Condition: 'Reusable' (structurally sound), 'Recyclable' (requires crushing/re-melting), or 'Landfill-only' (contaminated/hazardous)
5. Construction Phase source ('Demolition', 'Excavation', 'Structural', 'Finishing', 'Fit-out')
6. Key observable visual features (e.g., terracotta color, rebar ribbing, wood grain, chalky core)
7. Estimated density and circular recycling potential

You MUST respond strictly in valid JSON format matching this schema:
{
  "material": "Brick",
  "confidence": 94.2,
  "condition": "Reusable",
  "phase": "Demolition",
  "secondary_material": "Concrete",
  "secondary_confidence": 4.8,
  "visual_features": [
    "Stacked terracotta rectangular clay masonry",
    "Clean mortar separation",
    "High re-use structural integrity"
  ],
  "recycling_pathway": "Direct masonry salvage or aggregate crushing",
  "embodied_carbon_saved_per_ton_kg": 280.0
}
"""

def classify_with_gemini(image_path: str, api_key: str = None) -> Dict[str, Any]:
    api_key = api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # Check local key file if available
        if os.path.exists("../gemini api key.txt"):
            with open("../gemini api key.txt", "r") as f:
                content = f.read()
                for line in content.splitlines():
                    if "AIza" in line or "api_key" in line:
                        api_key = line.split("=")[-1].strip().strip('"').strip("'")
                        break

    if not api_key:
        print("[Error] No Gemini API key provided. Set GEMINI_API_KEY environment variable.")
        return {}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Load image
    with open(image_path, "rb") as img_file:
        img_data = img_file.read()

    print(f"[Gemini Vision AI] Analyzing material sample: {image_path}...")
    response = model.generate_content([
        SYSTEM_PROMPT,
        {"mime_type": "image/jpeg", "data": img_data},
        "Classify this construction debris image and return structured JSON."
    ])

    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.endswith("```"):
        text = text[:-3]

    result = json.loads(text.strip())
    print("\n[AI Inference Result]")
    print(json.dumps(result, indent=2))
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Classify Construction Waste Image with Gemini Multimodal Vision")
    parser.add_argument("--image", type=str, default="../frontend/public/assets/materials/brick.jpg", help="Path to image")
    parser.add_argument("--api_key", type=str, default=None, help="Gemini API Key")
    args = parser.parse_args()

    classify_with_gemini(args.image, args.api_key)
