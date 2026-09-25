import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            # Header
            self.drawString(54, 750, "ReBuild: Waste Intelligence & Circular Economy Platform | Technical Report")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)
            # Footer
            self.line(54, 45, 558, 45)
            self.drawString(54, 32, "Confidential - Academic & Technical Project Report (v2.4.0)")
            page_text = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(558, 32, page_text)
            self.restoreState()

def build_pdf(filename="ReBuild_Project_Full_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#059669'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0369A1'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=15,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#065F46')
    )

    q_style = ParagraphStyle(
        'Question_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    a_style = ParagraphStyle(
        'Answer_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=12,
        spaceAfter=8
    )

    story = []

    # ================= COVER BANNER =================
    banner_data = [
        [Paragraph("<b>REBUILD</b>", ParagraphStyle('BTitle', fontName='Helvetica-Bold', fontSize=22, textColor=colors.white, leading=26)),
         Paragraph("<b>v2.4.0 ENTERPRISE</b><br/><font size=7>PyTorch ResNet-34 AI • Angular 21 • Node.js</font>", ParagraphStyle('BSub', fontName='Helvetica', fontSize=8, textColor=colors.HexColor('#A7F3D0'), alignment=2, leading=11))],
        [Paragraph("Automated Construction Waste Intelligence & Circular Economy Marketplace Platform", ParagraphStyle('BDesc', fontName='Helvetica', fontSize=10.5, textColor=colors.white, leading=14)), ""]
    ]
    banner_table = Table(banner_data, colWidths=[330, 174])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0F172A')),
        ('SPAN', (0,1), (1,1)),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,1), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # ================= KPI METRICS STRIP =================
    kpi_data = [
        [
            Paragraph("<b>99.70%</b><br/><font size=7 color='#64748B'>AI Val Accuracy</font>", ParagraphStyle('K1', alignment=1, fontSize=12, leading=14)),
            Paragraph("<b>1,490</b><br/><font size=7 color='#64748B'>Real CDW Images</font>", ParagraphStyle('K2', alignment=1, fontSize=12, leading=14)),
            Paragraph("<b>7 Classes</b><br/><font size=7 color='#64748B'>Core Materials</font>", ParagraphStyle('K3', alignment=1, fontSize=12, leading=14)),
            Paragraph("<b>&lt; 100 ms</b><br/><font size=7 color='#64748B'>Inference Speed</font>", ParagraphStyle('K4', alignment=1, fontSize=12, leading=14)),
            Paragraph("<b>100%</b><br/><font size=7 color='#64748B'>Anti-Spoofing Filter</font>", ParagraphStyle('K5', alignment=1, fontSize=12, leading=14))
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[100, 101, 101, 101, 101])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 12))

    # ================= 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT =================
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))
    story.append(Paragraph(
        "<b>The Global Crisis:</b> Construction and Demolition Waste (CDW) accounts for over <b>35% of total solid waste worldwide</b>, generating billions of tons of debris annually. The vast majority of this debris is dumped into already saturated landfills, causing extreme soil contamination and squandering valuable circular aggregates (rebar, crushed concrete, brick, structural timber). Traditional job sites suffer from three fundamental bottlenecks: <i>(1) Lack of automated on-site material grading</i>, <i>(2) Absence of a real-time B2B circular trading market</i>, and <i>(3) Zero automated ESG carbon auditing</i>.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The ReBuild Solution:</b> ReBuild integrates edge Computer Vision AI, distance-optimized circular logistics, and ESG carbon accounting into a single unified platform. Contractors photograph demolition rubble with smartphones; the custom ResNet-34 AI model classifies the debris in under 100 milliseconds with 99.70% validation accuracy, assigns an industrial recycling pathway, and immediately provisions a tradable lot on the B2B marketplace to divert waste directly from landfills.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # ================= 2. SYSTEM ARCHITECTURE & TECH STACK =================
    story.append(Paragraph("2. System Architecture & Complete Technology Stack", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))
    story.append(Paragraph(
        "ReBuild is designed as an asynchronous, microservice-based architecture ensuring strict separation between user presentation, RESTful business orchestration, deep learning inference, and persistent data storage.",
        body_style
    ))

    arch_rows = [
        [Paragraph("<b>Layer</b>", body_bold), Paragraph("<b>Technology</b>", body_bold), Paragraph("<b>Port</b>", body_bold), Paragraph("<b>Key Responsibilities</b>", body_bold)],
        [Paragraph("<b>Frontend UI</b>", body_style), Paragraph("Angular 21 (Standalone), Tailwind CSS, Leaflet Maps, Lucide Icons", body_style), Paragraph("4200", body_style), Paragraph("Responsive Single Page Application (SPA), slide-out navigation drawer, dynamic bounding box rendering, role-based interfaces.", body_style)],
        [Paragraph("<b>REST Backend</b>", body_style), Paragraph("Node.js, Express, TypeScript, Helmet, Bcrypt-12, JWT", body_style), Paragraph("8000", body_style), Paragraph("API gateway, JWT authentication, RBAC authorization, Multer file streaming, Haversine logistics distance engine.", body_style)],
        [Paragraph("<b>AI Service</b>", body_style), Paragraph("Python 3.14, PyTorch 2.14, Torchvision, FastAPI, Uvicorn", body_style), Paragraph("5001", body_style), Paragraph("Loads ResNet-34 weights (best_cdw_model.pt), performs 224x224 tensor normalization, multi-class probability scoring.", body_style)],
        [Paragraph("<b>Persistence</b>", body_style), Paragraph("Atomic Disk Storage (data_store.json) + MySQL 8.0 support", body_style), Paragraph("N/A", body_style), Paragraph("Disk-synced multi-tenant database storing projects, waste logs, marketplace RFQs, equipment, and security audit logs.", body_style)]
    ]
    arch_table = Table(arch_rows, colWidths=[80, 150, 45, 229])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP')
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 10))

    # ================= 3. COMPUTER VISION & DEEP LEARNING ENGINE =================
    story.append(PageBreak())
    story.append(Paragraph("3. Computer Vision & Deep Learning Engine (The Core AI)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))
    
    story.append(Paragraph(
        "<b>Model Backbone & Transfer Learning:</b> The model utilizes a 34-layer Deep Residual Neural Network (<b>ResNet-34</b>). Deep convolutional networks traditionally suffer from the <i>vanishing gradient problem</i>, where backpropagated gradients shrink exponentially in earlier layers. ResNet solves this through <b>Residual Skip Connections</b>: <i>y = F(x, {W_i}) + x</i>, enabling gradients to flow unimpeded. We utilized transfer learning pre-trained on ImageNet to inherit low-level edge, gradient, and texture filters, replacing the default 1000-class head with our custom 7-class industrial classification head.",
        body_style
    ))

    story.append(Paragraph(
        "<b>Custom Classification Head Architecture:</b><br/>"
        "<code>Linear(512 &rarr; 256) &rarr; ReLU() &rarr; BatchNorm1d(256) &rarr; Dropout(p=0.2) &rarr; Linear(256 &rarr; 7)</code><br/>"
        "Raw output logits are converted to normalized class probabilities using the <b>Softmax Activation Function</b>: <i>P(c_i) = exp(z_i) / &Sigma; exp(z_j)</i>.",
        body_style
    ))

    story.append(Paragraph("<b>The 7 Core Industrial CDW Material Classes & Recycling Routes:</b>", h2_style))
    mat_rows = [
        [Paragraph("<b>Material</b>", body_bold), Paragraph("<b>Visual Features Identified</b>", body_bold), Paragraph("<b>Circular Recycling Pathway</b>", body_bold)],
        [Paragraph("<b>Brick</b>", body_style), Paragraph("Terracotta chromatic reflectance, mortar joint lines, porous clay matrix.", body_style), Paragraph("Direct reclaimed masonry reuse, crushed aggregate for landscaping.", body_style)],
        [Paragraph("<b>Concrete</b>", body_style), Paragraph("Cementitious grey matrix, coarse aggregate exposure, jagged fracture plane.", body_style), Paragraph("On-site mobile crushing for road sub-base and structural fill ballast.", body_style)],
        [Paragraph("<b>Drywall</b>", body_style), Paragraph("Chalky white gypsum core profile, paper-faced sheetrock boundary line.", body_style), Paragraph("Closed-loop gypsum remanufacturing and soil conditioning.", body_style)],
        [Paragraph("<b>Glass</b>", body_style), Paragraph("Architectural float glass transparency, specular refraction, planar cleavage.", body_style), Paragraph("Cullet remelting for container manufacturing & fiberglass insulation.", body_style)],
        [Paragraph("<b>Metal</b>", body_style), Paragraph("Fe-500D rebar ribs, structural I-beam profiles, high specular metallic sheen.", body_style), Paragraph("Induction furnace smelting for circular structural rebar fabrication.", body_style)],
        [Paragraph("<b>Stone</b>", body_style), Paragraph("Natural crystalline quartz flecks, dimensional granite blocks, high density.", body_style), Paragraph("Architectural dimension stone restoration, gabion retaining walls.", body_style)],
        [Paragraph("<b>Wood</b>", body_style), Paragraph("Linear cellulose grain patterns, lignin brown hue, formwork ply edges.", body_style), Paragraph("Dimensional timber remanufacturing, mulch, engineered particleboard.", body_style)]
    ]
    mat_table = Table(mat_rows, colWidths=[70, 230, 204])
    mat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(mat_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Anti-Spoofing & Document Fraud Detection Filter:</b>", h2_style))
    story.append(Paragraph(
        "To prevent contractors from falsely claiming circular tax credits or polluting the material database with non-construction assets (e.g., invoices, homework, diplomas, selfies), the system implements a multi-tier fraud rejection engine: <i>(1) Filename & MIME metadata inspection</i>, <i>(2) Statistical pixel luminance and visual entropy analysis</i>. Images containing >70% flat white surface area with high-contrast text lines are rejected with an explicit <code>Non-CDW asset: Verification REJECTED</code> response before reaching the neural network.",
        body_style
    ))

    story.append(Paragraph("<b>Model Training Performance & Convergence:</b>", h2_style))
    train_rows = [
        [Paragraph("<b>Epoch</b>", body_bold), Paragraph("<b>Train Loss</b>", body_bold), Paragraph("<b>Train Acc (%)</b>", body_bold), Paragraph("<b>Val Loss</b>", body_bold), Paragraph("<b>Val Acc (%)</b>", body_bold), Paragraph("<b>Status</b>", body_bold)],
        [Paragraph("Epoch 1", body_style), Paragraph("0.5904", body_style), Paragraph("82.99%", body_style), Paragraph("0.0953", body_style), Paragraph("98.80%", body_style), Paragraph("Pre-trained feature transfer", body_style)],
        [Paragraph("Epoch 3", body_style), Paragraph("0.1384", body_style), Paragraph("96.72%", body_style), Paragraph("0.0435", body_style), Paragraph("99.10%", body_style), Paragraph("Head stabilization", body_style)],
        [Paragraph("Epoch 7", body_style), Paragraph("0.0491", body_style), Paragraph("99.05%", body_style), Paragraph("0.0231", body_style), Paragraph("99.70%", body_style), Paragraph("Optimal weights checkpoint", body_style)],
        [Paragraph("<b>Epoch 10</b>", body_bold), Paragraph("<b>0.0298</b>", body_bold), Paragraph("<b>99.48%</b>", body_bold), Paragraph("<b>0.0217</b>", body_bold), Paragraph("<b>99.70%</b>", body_bold), Paragraph("<b>Saved: best_cdw_model.pt</b>", body_bold)]
    ]
    train_table = Table(train_rows, colWidths=[65, 75, 85, 75, 85, 119])
    train_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#ECFDF5')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(train_table)
    story.append(Spacer(1, 10))

    # ================= 4. THE 7 CORE OPERATIONAL MODULES =================
    story.append(PageBreak())
    story.append(Paragraph("4. The 7 Core Operational Modules", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))

    modules = [
        ("Module 1: AI Vision Material Classifier & Anti-Spoofing",
         "Provides sub-100ms real-time material identification from camera or file uploads. Detects bounding boxes, probability distribution, and recommends immediate circular pathways while filtering non-construction paper fraud."),
        ("Module 2: Construction Projects & Waste Tracking Ledger",
         "Maintains digital ledgers for all active demolition and construction sites. Tracks total tonnage generated, segregation percentage, material hazard classifications, and audit status across active project sites."),
        ("Module 3: B2B Circular Marketplace & Smart Matching",
         "Facilitates seamless trading of reclaimed materials between demolition contractors and infrastructure buyers. Incorporates real-time RFQ (Request for Quote) bidding and a dynamic Haversine distance engine: calculates exact transit kilometers and transit carbon footprint between seller sites and buyer delivery points."),
        ("Module 4: Heavy Machinery & Fleet Sharing",
         "Enables shared utilization of high-capital construction machinery (e.g., Mobile Jaw Crushers, Hydraulic Excavators, Magnetic Separators, Dump Trucks). Tracks real-time machine availability, rental rates, on-site active assignments, and maintenance logs."),
        ("Module 5: Certified Construction Worker Dispatch Pool",
         "On-demand dispatch pool connecting sites with certified heavy equipment operators, demolition specialists, hazardous waste sorters, and circular compliance supervisors, complete with trade certification verification."),
        ("Module 6: ESG Carbon Audit & Landfill Diversion Engine",
         "Calculates institutional sustainability metrics in compliance with global green building standards (LEED, GRIHA). Generates verified audit certificates recording total tons diverted from landfills and net metric tons of CO2 equivalent emissions saved (tCO2e)."),
        ("Module 7: Multi-Tenant Role-Based Access Control (RBAC)",
         "Dynamically alters platform UI and authorization scopes across three primary industry roles: (1) Contractor Workspace (full site, waste, and selling tools), (2) Buyer Procurement Hub (lot browsing, RFQ bidding, delivery tracking), and (3) Root Governance Admin (global audits, security logs, platform health telemetry).")
    ]

    for title, desc in modules:
        story.append(Paragraph(f"<b>&bull; {title}</b>", h2_style))
        story.append(Paragraph(desc, body_style))

    story.append(Spacer(1, 8))

    # ================= 5. END-TO-END OPERATIONAL WORKFLOW =================
    story.append(Paragraph("5. End-to-End Operational Workflow", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))
    
    flow_steps = [
        ("Step 1: On-Site Image Capture", "Contractor takes a photo of demolition debris on-site via mobile web camera or file upload."),
        ("Step 2: Dual-Stage Inspection", "Backend anti-spoofing engine verifies physical aggregate texture; PyTorch ResNet-34 extracts mineral feature tensors."),
        ("Step 3: Automated Classification", "System identifies material category (e.g., 'Concrete - 99.93% Confidence'), draws green bounding box, and tags circular pathway."),
        ("Step 4: Digital Waste Logging", "Waste entry is recorded in the project ledger with estimated tonnage, GPS coordinates, and salvage condition."),
        ("Step 5: Marketplace Publication", "With 1 click, the lot is published to the B2B Circular Marketplace with automatic dynamic pricing."),
        ("Step 6: Buyer Bidding & Haversine Match", "A nearby road contractor submits an RFQ; Haversine proximity engine computes transit distance and delivery route."),
        ("Step 7: Machine & Labor Booking", "Contractor books an on-demand mobile crusher and certified operator to process the concrete on-site."),
        ("Step 8: ESG Ledger Finalization", "Transaction is finalized; tons diverted and net CO2 offset are permanently recorded in the municipal ESG audit ledger.")
    ]

    for step_num, step_desc in flow_steps:
        story.append(Paragraph(f"<b>{step_num}:</b> {step_desc}", bullet_style))

    # ================= 6. VIVA VOCE & EXAMINATION CHEAT SHEET =================
    story.append(PageBreak())
    story.append(Paragraph("6. Viva Voce & Oral Examination Guide (Top Questions & Answers)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0F172A'), spaceAfter=6))

    viva_qa = [
        ("Q1: What is the core problem ReBuild solves?",
         "Sir, over 35% of all solid waste globally is construction and demolition debris. Contractors lack automated grading tools and circular trading markets, resulting in millions of tons being needlessly dumped into landfills. ReBuild automates debris classification with deep learning, provisions a B2B circular marketplace, and generates audited ESG carbon offset records."),
        
        ("Q2: Why did you choose ResNet-34 over a custom CNN or standard VGG?",
         "Sir, training a deep CNN from scratch on ~1,500 images causes severe overfitting. ResNet-34 incorporates residual skip connections (F(x) + x) that solve the vanishing gradient problem, allowing gradients to flow back without attenuation. Transfer learning from ImageNet provides mature low-level edge and texture filters, requiring us to only train high-level material boundaries with fast convergence."),

        ("Q3: How many images were used, and what is your model's accuracy?",
         "Sir, the model was trained on 1,490 high-resolution physical construction images divided into an 80/20 train/validation split (1,158 training, 332 validation) across 7 core classes. The model achieved 99.70% validation accuracy with a validation loss of 0.0217 after 10 epochs."),

        ("Q4: How does your system prevent fake or malicious image submissions?",
         "Sir, we built an Anti-Spoofing Document Fraud Filter. It inspects pixel luminance, color saturation, and visual entropy. If a user uploads a white notebook page, certificate, invoice, or receipt, the algorithm flags that over 70% of the image is flat paper and immediately rejects the submission before it reaches the circular ledger."),

        ("Q5: How does the AI connect with the web application?",
         "Sir, it uses a microservice architecture: The Angular 21 frontend uploads the image via FormData to our Node.js REST API on port 8000. Node.js forwards the image stream to our dedicated FastAPI PyTorch microservice on port 5001. The PyTorch service runs the ResNet-34 forward pass and returns the prediction JSON in under 100 milliseconds."),

        ("Q6: How does the circular marketplace calculate proximity between sites?",
         "Sir, we implement the Haversine Spherical Distance Formula: d = 2R * arcsin(sqrt(sin^2(dlat/2) + cos(lat1)*cos(lat2)*sin^2(dlon/2))). This calculates the great-circle distance in kilometers between the seller site and buyer destination to minimize transport carbon emissions."),

        ("Q7: How are ESG carbon offsets calculated?",
         "Sir, each salvaged material has an empirical carbon offset coefficient (e.g., recycled steel saves ~1.8 tCO2e/ton, recycled concrete saves ~0.05 tCO2e/ton compared to virgin quarrying). When a lot is recycled or reused, the system multiplies the tonnage by the emission factor to certify net metric tons of CO2 diverted."),

        ("Q8: How does the system handle security and authentication?",
         "Sir, user passwords are encrypted using Bcrypt with a work factor of 12. Sessions are secured using HMAC-SHA256 JSON Web Tokens (JWT) with Role-Based Access Control (RBAC). The backend enforces Helmet HTTP headers, CORS whitelisting, and Express rate limiting to prevent brute-force attacks.")
    ]

    for q, a in viva_qa:
        story.append(Paragraph(q, q_style))
        story.append(Paragraph(a, a_style))

    # Build PDF with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF successfully generated: {filename}")

if __name__ == '__main__':
    output_pdf = "ReBuild_Project_Full_Report.pdf"
    build_pdf(output_pdf)
    
    # Copy to Desktop
    desktop_dir = r"C:\Users\Acer\OneDrive\Attachments\Desktop"
    if os.path.exists(desktop_dir):
        dest_path = os.path.join(desktop_dir, output_pdf)
        shutil.copyfile(output_pdf, dest_path)
        print(f"[SUCCESS] Copied to Desktop: {dest_path}")

    # Copy to Artifacts folder
    artifact_dir = r"C:\Users\Acer\.gemini\antigravity\brain\26de5c5a-c80f-4e2c-8c44-17bf691edb74"
    if os.path.exists(artifact_dir):
        dest_art = os.path.join(artifact_dir, output_pdf)
        shutil.copyfile(output_pdf, dest_art)
        print(f"[SUCCESS] Copied to Artifacts: {dest_art}")