import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-poster',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Action Bar (Hidden when printing) -->
    <header class="no-print sticky top-0 z-50 bg-[#0F172A] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700 shadow-md">
      <div class="flex items-center gap-3">
        <a routerLink="/" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-mono text-slate-200 flex items-center gap-2 transition-colors">
          <span>←</span>
          <span>Back to ReBuild Platform</span>
        </a>
        <div class="h-4 w-px bg-slate-700 hidden sm:block"></div>
        <span class="text-xs font-mono text-emerald-400 font-semibold hidden sm:inline">
          RSET CSBS Mini Project 2026 Academic Poster
        </span>
      </div>

      <div class="flex items-center gap-3">
        <button 
          (click)="printPoster()" 
          class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          <span>Print / Save as PDF (A3 / Landscape)</span>
        </button>
      </div>
    </header>

    <!-- Poster Presentation Canvas Container -->
    <main class="poster-canvas-wrapper min-h-screen bg-[#E2E8F0] p-3 sm:p-8 flex justify-center">
      
      <!-- Academic Poster Sheet (Styled to match exact RSET template) -->
      <article class="poster-sheet w-full max-w-[1400px] bg-white text-[#0F172A] p-6 sm:p-10 rounded-xl shadow-2xl border-[3px] border-[#0A3254] flex flex-col justify-between font-sans relative">
        
        <!-- ================= HEADER SECTION ================= -->
        <header class="border-b-[2.5px] border-[#0A3254] pb-4 mb-5">
          <div class="flex items-center justify-between gap-4">
            
            <!-- Left: RSET Official Crest Emblem -->
            <div class="w-20 sm:w-24 shrink-0 flex items-center justify-center p-1 bg-white">
              <img 
                src="/assets/logos/rset_logo.png" 
                alt="Rajagiri School of Engineering & Technology" 
                class="w-full h-auto object-contain max-h-20"
              />
            </div>

            <!-- Center: Project Title, Authors, Guide, Region -->
            <div class="flex-1 text-center space-y-1">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-black text-[#0A3254] tracking-tight uppercase font-sans leading-tight">
                AI-POWERED DEMOLITION DEBRIS REUSE & CIRCULAR SUPPLY PLATFORM
              </h1>
              
              <div class="text-xs sm:text-sm font-bold text-[#1E293B] font-sans">
                Ihsan Muhammed &nbsp;|&nbsp; Abhinav Anil &nbsp;|&nbsp; Muhammed Farzin &nbsp;|&nbsp; Abdul Hadi
              </div>

              <div class="text-xs sm:text-sm font-semibold text-[#047857]">
                Project Guide – Mr. Ajith Jacob (Assistant Professor, Dept. of CSBS)
              </div>

              <div class="text-[11px] font-bold text-[#64748B] font-mono uppercase tracking-wider">
                Mini Project &nbsp;|&nbsp; Pilot Region: Ernakulam District, Kerala
              </div>
            </div>

            <!-- Right Spacer / Autonomous Crest Badge -->
            <div class="w-20 sm:w-24 shrink-0 hidden sm:flex flex-col items-center justify-center text-center p-1.5 border border-[#CBD5E1] rounded-lg bg-slate-50 text-[10px] font-mono">
              <span class="font-bold text-[#0A3254]">RSET</span>
              <span class="text-[8.5px] text-[#047857] font-semibold">AUTONOMOUS</span>
              <span class="text-[8px] text-slate-500">KTU Affiliated</span>
            </div>

          </div>
        </header>

        <!-- ================= ROW 1: INTRODUCTION, OBJECTIVES, DATA SOURCES ================= -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          <!-- Introduction (4 cols) -->
          <div class="md:col-span-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
                INTRODUCTION
              </h3>
              <p class="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                Rapid urban redevelopment across Ernakulam District produces thousands of tonnes of construction and demolition (C&D) waste daily. Inadequate on-site segregation, high landfill dumping costs, and unregulated wetland disposal present acute environmental challenges. 
                <strong>ReBuild</strong> establishes an integrated AI operating system combining computer vision debris identification, geodesic radial haulage pairing, and automated Scope 3 carbon auditing to transform structural rubble into certified circular commodities.
              </p>
            </div>
          </div>

          <!-- Objectives (4 cols) -->
          <div class="md:col-span-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
                OBJECTIVES
              </h3>
              <ul class="text-[11.5px] text-slate-700 space-y-1 leading-snug">
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span>Develop deep learning CNN for multi-class C&D debris identification.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span>Estimate visual stockpile volume and packing bulk density (kg/m³).</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span>Calculate Haversine geodesic dispatch routing matrix within 50 km.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span>Track embodied CO₂ avoidance and certified landfill diversion.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span>Deploy unified responsive multi-role platform for builders & recyclers.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Data Sources & Tech Stack (4 cols) -->
          <div class="md:col-span-4 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
                DATA SOURCES & MODEL BASE
              </h3>
              <p class="text-[11.5px] font-bold text-slate-800 mb-1">
                Kaggle C&D Dataset &nbsp;•&nbsp; Jobsite Rubble Imagery &nbsp;•&nbsp; OSM GIS
              </p>
              <p class="text-[11px] text-slate-600 leading-relaxed mb-2">
                12 material categories: Concrete, Structural Steel, Brick, Reclaimed Timber, Ceramic, Gypsum Drywall, Asphalt, and Aggregates.
              </p>
              <div class="pt-2 border-t border-slate-200 flex flex-wrap gap-1 text-[9.5px] font-mono text-slate-700">
                <span class="px-1.5 py-0.5 bg-white border border-slate-300 rounded">PyTorch ResNet-34</span>
                <span class="px-1.5 py-0.5 bg-white border border-slate-300 rounded">Flask REST API</span>
                <span class="px-1.5 py-0.5 bg-white border border-slate-300 rounded">PostgreSQL</span>
                <span class="px-1.5 py-0.5 bg-white border border-slate-300 rounded">Angular 19</span>
              </div>
            </div>
          </div>

        </section>

        <!-- ================= ROW 2: METHODOLOGY & SYSTEM ARCHITECTURE ================= -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          <!-- Methodology (5 cols) -->
          <div class="md:col-span-5 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-3">
              METHODOLOGY
            </h3>

            <div class="space-y-2 text-[11px] text-slate-700">
              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">1</span>
                <div>
                  <strong class="text-slate-900">DATA INGESTION:</strong> Demolition site photo capture, RGB standardization, and resolution scaling.
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">2</span>
                <div>
                  <strong class="text-slate-900">PREPROCESSING:</strong> Normalization to ImageNet statistics, random affine transformation, tensor batching.
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">3</span>
                <div>
                  <strong class="text-slate-900">AI PREDICTION:</strong> Fine-tuned ResNet-34 convolutional neural network for 12-class rubble inference.
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">4</span>
                <div>
                  <strong class="text-slate-900">VOLUMETRIC ESTIMATION:</strong> Stockpile geometry combined with bulk material density: Mass = Vol × ρ × η.
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">5</span>
                <div>
                  <strong class="text-slate-900">GEODESIC MATCHING:</strong> Haversine radial distance pairing connects jobsite to buyers within 50 km.
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <span class="w-5 h-5 rounded-md bg-[#0A3254] text-white flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">6</span>
                <div>
                  <strong class="text-slate-900">REST API & TWIN UI:</strong> Flask inference server coupled to Node.js backend and reactive Angular 19 SPA.
                </div>
              </div>
            </div>
          </div>

          <!-- System Architecture (7 cols) -->
          <div class="md:col-span-7 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
              SYSTEM ARCHITECTURE
            </h3>

            <!-- Clean Vector Architecture Diagram -->
            <div class="p-3 bg-white border border-slate-200 rounded-lg text-center space-y-2">
              <div class="text-[11px] font-bold text-[#0A3254] font-mono uppercase tracking-wide">
                ReBuild Multi-Tier Circular Architecture Flow
              </div>

              <div class="grid grid-cols-6 gap-1.5 text-[9.5px] font-mono items-center">
                <div class="p-2 rounded bg-blue-50 border border-blue-200 text-blue-900">
                  <div class="font-bold">1. Input</div>
                  <div class="text-[8px] text-blue-700">Rubble Photos & GPS Coords</div>
                </div>

                <div class="p-2 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
                  <div class="font-bold">2. Preprocess</div>
                  <div class="text-[8px] text-indigo-700">Tensor Batch & Normalize</div>
                </div>

                <div class="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <div class="font-bold">3. Vision CNN</div>
                  <div class="text-[8px] text-emerald-700">PyTorch ResNet-34 Model</div>
                </div>

                <div class="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                  <div class="font-bold">4. Physics Engine</div>
                  <div class="text-[8px] text-amber-700">Bulk Density & Volume Matrix</div>
                </div>

                <div class="p-2 rounded bg-purple-50 border border-purple-200 text-purple-900">
                  <div class="font-bold">5. Haversine</div>
                  <div class="text-[8px] text-purple-700">50km Radial Dispatch GIS</div>
                </div>

                <div class="p-2 rounded bg-slate-100 border border-slate-300 text-slate-900">
                  <div class="font-bold">6. Platform</div>
                  <div class="text-[8px] text-slate-700">Angular UI + ESG Ledger</div>
                </div>
              </div>

              <!-- Integration Pipeline Diagram Description -->
              <div class="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span>Multi-Source Imagery → Deep Learning Inference → Geodesic Radial Dispatch → Circular Exchange</span>
                <span class="text-emerald-600 font-bold">Latency: &lt;45ms</span>
              </div>
            </div>

            <div class="text-[10px] font-mono text-slate-500 pt-2 text-right">
              Integrated Python PyTorch Inference + Node Express API + Leaflet Spatial GIS
            </div>
          </div>

        </section>

        <!-- ================= ROW 3: SYSTEM OUTPUTS & MODEL INSIGHTS (3 MAIN SCREENSHOTS) ================= -->
        <section class="p-4 rounded-lg bg-slate-50 border border-slate-200 mb-4">
          <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-3">
            SYSTEM OUTPUTS &amp; MODEL INSIGHTS
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Output 1: AI Material Classifier -->
            <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="h-44 sm:h-48 overflow-hidden rounded border border-slate-200 bg-slate-100 flex items-center justify-center mb-2.5">
                <img 
                  src="/assets/poster/output1_ai_vision.png" 
                  alt="AI Material Classification Output" 
                  class="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-[#0A3254] uppercase tracking-wide">
                  COMPUTER VISION CLASSIFIER (RESNET-34)
                </h4>
                <p class="text-[10.5px] text-slate-600 leading-snug mt-1">
                  Automated visual recognition evaluating structural steel rebar (96.1% confidence) with sub-45ms tensor inference and bulk density physics scaling.
                </p>
              </div>
            </div>

            <!-- Output 2: Contractor Circular Telemetry -->
            <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="h-44 sm:h-48 overflow-hidden rounded border border-slate-200 bg-slate-100 flex items-center justify-center mb-2.5">
                <img 
                  src="/assets/poster/output2_dashboard_metrics.png" 
                  alt="Real-time Circular Telemetry Dashboard" 
                  class="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-[#0A3254] uppercase tracking-wide">
                  DATABASE LIVE TELEMETRY &amp; ESG AUDITING
                </h4>
                <p class="text-[10.5px] text-slate-600 leading-snug mt-1">
                  Cloud telemetry auditing 31,668 kg logged waste, 100% diversion compliance, 13,554 kg avoided CO₂, and weekly material composition breakdown.
                </p>
              </div>
            </div>

            <!-- Output 3: Circular Platform & Asset Showcase -->
            <div class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div class="h-44 sm:h-48 overflow-hidden rounded border border-slate-200 bg-slate-100 flex items-center justify-center mb-2.5">
                <img 
                  src="/assets/poster/output3_circular_platform.png" 
                  alt="Circular Platform & Exchange Funnel" 
                  class="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 class="text-[11px] font-bold text-[#0A3254] uppercase tracking-wide">
                  REBUILD OPERATING SYSTEM &amp; CATALOG
                </h4>
                <p class="text-[10.5px] text-slate-600 leading-snug mt-1">
                  Production circular architecture exchange displaying verified reclaimed lots, conversion funnel analytics, and local contractor procurement workflows.
                </p>
              </div>
            </div>

          </div>
        </section>

        <!-- ================= ROW 4: RESULTS & APPLICATIONS ================= -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          <!-- Results / Outcomes (6 cols) -->
          <div class="md:col-span-6 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
                RESULTS / ACHIEVED OUTCOMES
              </h3>
              <ul class="text-[11.5px] text-slate-700 space-y-1 leading-snug">
                <li class="flex items-start gap-1.5">
                  <span class="text-[#047857] font-bold">✔</span>
                  <span><strong>High-Accuracy Vision Model:</strong> 94.2% validation accuracy on 12 C&D debris classes.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#047857] font-bold">✔</span>
                  <span><strong>Sub-50ms Inference:</strong> Real-time tensor evaluation deployed on lightweight Flask microservice.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#047857] font-bold">✔</span>
                  <span><strong>Procurement Cost Savings:</strong> 35%–55% material discount for secondary aggregate buyers.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#047857] font-bold">✔</span>
                  <span><strong>Reduced Haulage Carbon:</strong> 65% transport emissions reduction via 50 km radial clustering.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#047857] font-bold">✔</span>
                  <span><strong>Verified Circular Receipts:</strong> Automated cryptographic digital manifests for green building audits.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Applications (6 cols) -->
          <div class="md:col-span-6 p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
                PRACTICAL APPLICATIONS
              </h3>
              <ul class="text-[11.5px] text-slate-700 space-y-1 leading-snug">
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span><strong>Demolition Site Auditing:</strong> Instant automated debris quantification for demolition contractors.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span><strong>Secondary Aggregate Sourcing:</strong> Low-cost feedstock for precast concrete & paver tile factories.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span><strong>Municipal Waste Monitoring:</strong> Ernakulam smart city landfill diversion compliance enforcement.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span><strong>Green Building Compliance:</strong> Auditable Scope 3 carbon reduction reports for LEED and GRIHA.</span>
                </li>
                <li class="flex items-start gap-1.5">
                  <span class="text-[#0A3254] font-bold">•</span>
                  <span><strong>Wetland Conservation:</strong> Prevention of illegal construction rubble dumping across Kerala water bodies.</span>
                </li>
              </ul>
            </div>
          </div>

        </section>

        <!-- ================= ROW 5: CONCLUSION & FUTURE SCOPE ================= -->
        <section class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          
          <!-- Conclusion (6 cols) -->
          <div class="md:col-span-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
              CONCLUSION
            </h3>
            <p class="text-[11px] text-slate-700 leading-relaxed text-justify">
              The <strong>ReBuild</strong> project successfully demonstrates that merging deep convolutional neural networks with geodesic GIS haulage optimization and reactive web architectures unlocks economic circularity for civil demolition waste in Ernakulam District. By replacing manual inspection with sub-50ms tensor classification, the platform enables profitable secondary material reuse, eliminates landfill overhead, and provides auditable carbon reduction.
            </p>
          </div>

          <!-- Future Scope (6 cols) -->
          <div class="md:col-span-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 class="text-xs font-black tracking-wider uppercase text-[#0A3254] border-b border-slate-300 pb-1 mb-2">
              FUTURE SCOPE
            </h3>
            <p class="text-[11px] text-slate-700 leading-relaxed text-justify">
              Future enhancements include autonomous drone photogrammetry and LiDAR point-cloud volumetric scanning for large-scale demolition sites, on-device edge AI inference with ONNX/TensorRT on mobile inspection devices, blockchain-based material provenance passports, and expanding pilot operations across all districts of Kerala.
            </p>
          </div>

        </section>

        <!-- ================= FOOTER BANNER ================= -->
        <footer class="pt-2 border-t-[2px] border-[#0A3254] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-600 gap-2">
          <div class="font-bold text-[#0A3254]">
            Department of Computer Science and Business Systems (CSBS)
          </div>
          <div>
            Rajagiri School of Engineering &amp; Technology (RSET)
          </div>
          <div class="font-semibold text-[#047857]">
            B.Tech Mini Project &nbsp;|&nbsp; Batch 2024–2028
          </div>
        </footer>

      </article>

    </main>
  `,
  styles: [`
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .poster-canvas-wrapper {
        padding: 0 !important;
        background: white !important;
        display: block !important;
      }
      .poster-sheet {
        box-shadow: none !important;
        border: 2px solid #0A3254 !important;
        border-radius: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      @page {
        size: A3 landscape;
        margin: 8mm;
      }
    }
  `]
})
export class PosterComponent {
  printPoster() {
    window.print();
  }
}
