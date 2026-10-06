import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface HeroProject {
  id: string;
  number: string;
  title: string;
  location: string;
  materialsTag: string;
  divertedTons: number;
  co2AvoidedTons: number;
  costSavingsINR: string;
  imageUrl: string;
  architecturalSpec: string;
  certification: string;
}

export interface MaterialDemo {
  id: string;
  name: string;
  category: string;
  confidence: number;
  secondary: string;
  secondaryConf: number;
  imageUrl: string;
  features: string[];
  latency: number;
  specs: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- MAIN WRAPPER: Minimalist Swiss Architectural Editorial Canvas -->
    <div class="min-h-screen bg-[#EDE7DF] text-[#1C1917] font-sans selection:bg-[#D4A373]/30 selection:text-[#1C1917] scroll-smooth">
      
      <!-- TOP ARCHITECTURAL STICKY NAVBAR -->
      <nav class="sticky top-0 z-50 bg-[#EDE7DF]/85 backdrop-blur-xl border-b border-[#E2DBD1] transition-all">
        <div class="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <!-- Brand Emblem (Click to scroll to top / Home) -->
          <a routerLink="/" (click)="scrollToSection('hero', $event)" class="flex items-center gap-3 group cursor-pointer" title="ReBuild Home">
            <div class="w-10 h-10 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#E2DBD1] flex items-center justify-center text-lg font-bold text-[#1C1917] group-hover:scale-105 group-active:scale-95 transition-all">
              ✱
            </div>
            <div>
              <span class="font-extrabold text-xl tracking-tight text-[#1C1917]">REBUILD</span>
              <span class="block text-[9px] font-mono tracking-widest text-[#78716C] uppercase -mt-0.5">Circular Architecture OS</span>
            </div>
          </a>


          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <a routerLink="/auth/login" class="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1917] hover:bg-white/60 transition-all">
              Sign In
            </a>
            <a routerLink="/auth/register" class="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer group">
              <span>Launch Workspace</span>
              <span class="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- PAGE CONTAINER -->
      <div class="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-20 sm:space-y-28">

        <!-- SECTION 1: EDITORIAL HERO & INTERACTIVE 3D PROJECT SHOWCASE -->
        <section id="hero" class="space-y-8">
          
          <!-- Editorial Masthead Header -->
          <div class="space-y-4 max-w-4xl pt-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5DFD7]/80 border border-[#E2DBD1] text-[10px] font-mono font-bold tracking-widest text-[#78716C] uppercase">
              <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>01 / GLOBAL SYSTEM ARCHITECTURE • ZERO-LANDFILL PROTOCOL v2.4</span>
            </div>

            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#1C1917] leading-[1.06]">
              Transforming Structural Waste into Circular Capital.
            </h1>

            <p class="text-base sm:text-xl text-[#57534E] max-w-3xl font-normal leading-relaxed">
              The operating system for industrial construction. ReBuild replaces municipal landfill dumping with sub-second AI material vision, direct jobsite-to-buyer secondary commodity routing, and certified Scope 3 ESG audit manifests.
            </p>

            <!-- High-Conversion CTAs -->
            <div class="flex flex-wrap items-center gap-3.5 pt-3">
              <a
                routerLink="/auth/register"
                class="px-6 py-3.5 rounded-2xl bg-[#1C1917] hover:bg-black text-white text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-2xl transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <span>Enter Enterprise Workspace</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </a>

              <button
                (click)="scrollToSection('marketplace', $event)"
                class="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F6F3EF] text-[#1C1917] border border-[#E2DBD1] text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Live Catalog (2,840t Ready)</span>
                <span class="text-xs text-[#78716C]">↓</span>
              </button>

              <a
                routerLink="/auth/login"
                class="px-4 py-3.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                Existing User? Sign In →
              </a>
            </div>

            <!-- Swiss Telemetry Credibility Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2DBD1] text-xs font-mono">
              <div>
                <span class="text-[#78716C] block text-[10px] uppercase">Jobsite Network</span>
                <span class="text-[#1C1917] font-bold text-sm sm:text-base">420+ Certified Sites</span>
              </div>
              <div>
                <span class="text-[#78716C] block text-[10px] uppercase">Diversion Volume</span>
                <span class="text-[#16A34A] font-bold text-sm sm:text-base">18,400+ Tons Salvaged</span>
              </div>
              <div>
                <span class="text-[#78716C] block text-[10px] uppercase">Secondary Procurement</span>
                <span class="text-[#1C1917] font-bold text-sm sm:text-base">₹4.2 Cr Raw Saved</span>
              </div>
              <div>
                <span class="text-[#78716C] block text-[10px] uppercase">Tensor Accuracy</span>
                <span class="text-[#16A34A] font-bold text-sm sm:text-base">99.7% ResNet-34</span>
              </div>
            </div>
          </div>

          <!-- Interactive 3D Perspective Hero Showcase Card -->
          <div class="space-y-3">
            <!-- Project Tabs Bar -->
            <div class="flex items-center justify-between flex-wrap gap-2 pb-1">
              <span class="text-xs font-mono text-[#78716C] uppercase font-bold tracking-wider">
                Active Circular Architecture Case Studies:
              </span>
              <div class="flex items-center gap-1.5 p-1 rounded-2xl bg-[#E5DFD7]/70 border border-[#E2DBD1]">
                <button
                  *ngFor="let proj of heroProjects"
                  (click)="activeHeroProject = proj"
                  [ngClass]="activeHeroProject.id === proj.id ? 'bg-white text-[#1C1917] shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
                  class="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono"
                >
                  {{ proj.number }} / {{ proj.title }}
                </button>
              </div>
            </div>

            <!-- 3D Perspective Card Container -->
            <div
              #heroCard
              (mousemove)="onMouseMoveHero($event, heroCard)"
              (mouseleave)="onMouseLeaveHero()"
              [style]="heroTiltStyle"
              class="relative h-[420px] sm:h-[500px] lg:h-[560px] rounded-[32px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.08)] border border-[#E2DBD1] group preserve-3d transition-transform duration-300"
            >
              <!-- Architectural Image -->
              <img
                [src]="activeHeroProject.imageUrl"
                [alt]="activeHeroProject.title"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              <!-- Architectural Shading Gradient Overlays -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent"></div>

              <!-- Top Left Overlay Headline & Project Metadata -->
              <div class="absolute top-6 sm:top-10 left-6 sm:left-10 text-white z-10 max-w-xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-mono text-white/95 mb-3 border border-white/25">
                  <span>{{ activeHeroProject.certification }}</span>
                </div>
                <h2 class="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
                  {{ activeHeroProject.title }}
                </h2>
                <p class="text-xs sm:text-base text-white/90 font-medium mt-1.5 drop-shadow">
                  {{ activeHeroProject.location }} • {{ activeHeroProject.materialsTag }}
                </p>
                <div class="mt-3 text-xs text-white/80 max-w-md hidden sm:block bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/15">
                  <span class="font-mono text-[10px] text-emerald-400 block uppercase font-bold">Structural Provenance:</span>
                  {{ activeHeroProject.architecturalSpec }}
                </div>
              </div>

              <!-- Top Right Action Controls -->
              <div class="absolute top-6 sm:top-10 right-6 sm:right-10 flex flex-col gap-2.5 z-10">
                <a
                  routerLink="/marketplace"
                  title="View Materials on Leaflet Map"
                  class="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-[#1C1917] backdrop-blur-md flex items-center justify-center transition-all shadow-md group cursor-pointer"
                >
                  <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </a>
                <a
                  routerLink="/waste"
                  title="Run AI Material Scan"
                  class="w-10 h-10 rounded-2xl bg-black/50 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </a>
              </div>

              <!-- Bottom Glassmorphism Telemetry HUD -->
              <div class="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-black/60 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl">
                <!-- Metrics Grid -->
                <div class="grid grid-cols-3 gap-4 sm:gap-8 text-white">
                  <div>
                    <span class="block text-[9px] font-mono text-white/70 uppercase">Material Salvaged</span>
                    <span class="text-xl sm:text-2xl font-black font-mono text-white">{{ activeHeroProject.divertedTons }} Tons</span>
                  </div>
                  <div>
                    <span class="block text-[9px] font-mono text-white/70 uppercase">CO2e Avoided</span>
                    <span class="text-xl sm:text-2xl font-black font-mono text-emerald-400">{{ activeHeroProject.co2AvoidedTons }} t</span>
                  </div>
                  <div>
                    <span class="block text-[9px] font-mono text-white/70 uppercase">Virgin Cost Saved</span>
                    <span class="text-xl sm:text-2xl font-black font-mono text-white">{{ activeHeroProject.costSavingsINR }}</span>
                  </div>
                </div>

                <!-- CTA inside HUD -->
                <div class="flex items-center gap-2.5">
                  <a
                    routerLink="/marketplace"
                    class="px-5 py-2.5 rounded-xl bg-white hover:bg-white/95 text-[#1C1917] text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>View Circular Lot</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 4-Column Key Performance Metrics Strip -->
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7]">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <!-- Stat 1: Total Debris Classified -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Daily Classified Debris</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">14.2k</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 18% MoM
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Kg demolition materials logged</div>
              </div>

              <!-- Stat 2: Active Secondary Lots -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Active Circular Lots</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">842</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 12% MoM
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Bookmarked by precast factories</div>
              </div>

              <!-- Stat 3: B2B Secondary Volume -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Secondary B2B Volume</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">₹3.8M</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 24% MoM
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Dispatched material transactions</div>
              </div>

              <!-- Stat 4: Transport Carbon Avoided -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Transport Carbon Avoided</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#16A34A] tracking-tight">1,420t</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    -42% CO2e
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Vs virgin quarry diesel haulage</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 2: INTERACTIVE LIVE INDUSTRIAL AI VISION SCANNER -->
        <section id="ai-scanner">
          <div class="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-8 card-editorial-hover">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5DFD7]">
              <div>
                <div class="inline-flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold uppercase tracking-wider mb-2">
                  <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  02 / PYTORCH RESNET-34 INDUSTRIAL VISION ENGINE
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
                  Real-Time Computer Vision Material Classifier
                </h2>
                <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">
                  Select an industrial material class to test sub-second feature tensor extraction and reuse suitability grading.
                </p>
              </div>

              <!-- Interactive Material Selector Tabs -->
              <div class="flex flex-wrap gap-2">
                <button
                  *ngFor="let demo of materialDemos"
                  (click)="activeDemo = demo"
                  [ngClass]="activeDemo.id === demo.id ? 'bg-[#1C1917] text-white font-bold shadow-md' : 'bg-[#F6F3EF] text-[#78716C] hover:text-[#1C1917] border border-[#E2DDD5]'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono"
                >
                  {{ demo.name }}
                </button>
              </div>
            </div>

            <!-- Scanner Camera Stage -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <!-- Left: Viewport with Laser Beam -->
              <div class="lg:col-span-7 bg-[#F9F7F4] rounded-2xl p-4 border border-[#E5DFD7]">
                <!-- Top HUD -->
                <div class="flex items-center justify-between pb-3 border-b border-[#E2DDD5] mb-3 text-xs font-mono">
                  <div class="flex items-center gap-2 text-[#C53030] font-bold">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#C53030] animate-pulse"></span>
                    <span>LIVE TENSOR FEED</span>
                  </div>
                  <div class="text-[#1C1917] font-bold">RESNET-34 CDW MODEL</div>
                  <div class="text-[#78716C]">LATENCY: {{ activeDemo.latency }}ms</div>
                </div>

                <!-- Image Viewport with Laser Line -->
                <div class="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-black group">
                  <img
                    [src]="activeDemo.imageUrl"
                    [alt]="activeDemo.name"
                    class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />

                  <!-- Laser Sweep Beam -->
                  <div class="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_15px_#22C55E] animate-laser-sweep pointer-events-none"></div>

                  <!-- AI Reticle Overlay -->
                  <div class="absolute inset-8 sm:inset-10 border-2 border-[#22C55E] rounded-xl pointer-events-none flex flex-col justify-between p-3 bg-black/15 backdrop-blur-[1px]">
                    <div class="flex items-center justify-between">
                      <span class="bg-[#1C1917] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        {{ activeDemo.category.toUpperCase() }} [{{ activeDemo.confidence }}%]
                      </span>
                      <span class="bg-white/90 text-[#1C1917] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        224x224 TENSOR
                      </span>
                    </div>

                    <div class="flex items-center justify-between text-[10px] font-mono text-white bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      <span>SPEC: {{ activeDemo.specs }}</span>
                      <span class="text-[#4ADE80] font-bold">REUSE CERTIFIED ✓</span>
                    </div>
                  </div>
                </div>

                <!-- Bottom Telemetry Chips -->
                <div class="mt-3 grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                  <div class="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                    <div class="text-[9px] text-[#78716C] uppercase">Confidence</div>
                    <div class="text-[#16A34A] font-bold text-sm mt-0.5">{{ activeDemo.confidence }}%</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                    <div class="text-[9px] text-[#78716C] uppercase">Secondary</div>
                    <div class="text-[#1C1917] font-bold text-sm mt-0.5">{{ activeDemo.secondary }}</div>
                  </div>
                  <div class="p-2.5 rounded-xl bg-white border border-[#E5DFD7]">
                    <div class="text-[9px] text-[#78716C] uppercase">Inference Time</div>
                    <div class="text-[#1C1917] font-bold text-sm mt-0.5">{{ activeDemo.latency }} ms</div>
                  </div>
                </div>
              </div>

              <!-- Right: Extracted Neural Features -->
              <div class="lg:col-span-5 space-y-6">
                <div>
                  <div class="text-xs font-mono text-[#78716C] uppercase font-bold mb-1">Feature Extraction</div>
                  <h3 class="text-2xl font-bold text-[#1C1917]">{{ activeDemo.name }}</h3>
                  <p class="text-xs text-[#78716C] mt-1 leading-relaxed">
                    Visual chrominance, fracture density, and tensile edge gradients classified in memory.
                  </p>
                </div>

                <div class="space-y-3 pt-4 border-t border-[#E5DFD7]">
                  <div *ngFor="let feat of activeDemo.features" class="flex items-center gap-3 text-xs text-[#1C1917] bg-[#F9F7F4] p-3 rounded-xl border border-[#E5DFD7]">
                    <span class="w-5 h-5 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                    <span class="font-medium">{{ feat }}</span>
                  </div>
                </div>

                <div class="pt-4 flex items-center justify-between">
                  <span class="text-xs font-mono text-[#78716C]">ISO 14021 Certified Protocol</span>
                  <a routerLink="/waste" class="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1.5 group">
                    <span>Scan With Device Camera</span>
                    <span class="group-hover:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 3: TWO-SIDED CIRCULAR NETWORK (CONTRACTOR <-> BUYER) -->
        <section id="ecosystem">
          <div class="space-y-6">
            <div class="max-w-2xl">
              <span class="text-xs font-mono text-[#78716C] uppercase font-bold">03 / DECENTRALIZED PROCUREMENT</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight mt-1">
                Direct Two-Sided Infrastructure Operating System
              </h2>
              <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">
                Connecting demolition site managers shedding heavy debris with precast factories and landscape developers sourcing secondary commodities.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <!-- Contractor Box -->
              <div class="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] flex flex-col justify-between hover:shadow-xl transition-all group card-editorial-hover">
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div class="w-12 h-12 rounded-2xl bg-[#F6F3EF] text-2xl flex items-center justify-center border border-[#E2DDD5] group-hover:scale-105 transition-transform">
                      🏗️
                    </div>
                    <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#EBF7EE] text-[#16A34A] border border-[#DCFCE7]">
                      DEMOLITION JOBSITE OS
                    </span>
                  </div>

                  <h3 class="text-2xl font-bold text-[#1C1917] mb-2">Contractor Workspace</h3>
                  <p class="text-xs text-[#78716C] leading-relaxed mb-6">
                    Complete jobsite command deck: Scan on-site demolition rubble with the AI Camera, auto-publish manifests to the marketplace, dispatch buyer pickup requests, and rent idle heavy machinery from neighboring sites.
                  </p>

                  <div class="space-y-2.5 text-xs text-[#1C1917]">
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#16A34A] font-bold">✓</span>
                      <span>ResNet-34 AI Camera for 12 Industrial C&D Materials</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#16A34A] font-bold">✓</span>
                      <span>Auto-Catalog Debris as Reusable (₹/kg or Free Site Pickup)</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#16A34A] font-bold">✓</span>
                      <span>Heavy equipment telematics & licensed operator roster</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#16A34A] font-bold">✓</span>
                      <span>Zero municipal dumping gate fees & landfill tipping penalties</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                  <a routerLink="/auth/login" class="text-xs font-bold text-[#1C1917] hover:text-[#78716C] flex items-center gap-1.5 group">
                    <span>Sign In as Contractor (Ihsan Muhammed)</span>
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>

              <!-- Buyer Box -->
              <div class="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] flex flex-col justify-between hover:shadow-xl transition-all group card-editorial-hover">
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div class="w-12 h-12 rounded-2xl bg-[#F6F3EF] text-2xl flex items-center justify-center border border-[#E2DDD5] group-hover:scale-105 transition-transform">
                      🛒
                    </div>
                    <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE]">
                      DIRECT FACTORY PROCUREMENT
                    </span>
                  </div>

                  <h3 class="text-2xl font-bold text-[#1C1917] mb-2">Buyer Procurement Hub</h3>
                  <p class="text-xs text-[#78716C] leading-relaxed mb-6">
                    Engineered for paver manufacturers, modular precast yards, and structural developers sourcing bulk secondary aggregate, rebar, and brick with zero middleman markup.
                  </p>

                  <div class="space-y-2.5 text-xs text-[#1C1917]">
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#2563EB] font-bold">✓</span>
                      <span>Haversine Radial Distance Matching (5km - 50km radius)</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#2563EB] font-bold">✓</span>
                      <span>Send direct pickup or delivery dispatch orders in 1-click</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#2563EB] font-bold">✓</span>
                      <span>Save 35% - 55% compared to virgin quarries and retail rebar</span>
                    </div>
                    <div class="flex items-center gap-2.5">
                      <span class="text-[#2563EB] font-bold">✓</span>
                      <span>Auditable Scope 3 ESG carbon reduction certs for compliance</span>
                    </div>
                  </div>
                </div>

                <div class="mt-8 pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                  <a routerLink="/auth/login" class="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 group">
                    <span>Sign In as Buyer (Anita Desai)</span>
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: LIVE CIRCULAR MARKETPLACE CATALOG -->
        <section id="marketplace">
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-6 card-editorial-hover">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <span class="text-xs font-mono text-[#78716C] uppercase font-bold">04 / SECONDARY COMMODITY MARKET</span>
                <h2 class="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight mt-0.5">Active Verified Circular Catalog</h2>
                <p class="text-xs sm:text-sm text-[#78716C]">Direct peer-to-peer exchange between active jobsites and certified recycling depots.</p>
              </div>

              <a routerLink="/marketplace" class="px-4 py-2 rounded-2xl bg-[#F6F3EF] hover:bg-[#EDE7DF] border border-[#E2DDD5] text-xs font-bold text-[#1C1917] flex items-center gap-2 transition-colors self-start sm:self-auto group cursor-pointer">
                <span>Open Geospatial Leaflet Map</span>
                <span class="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>

            <!-- Material Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <!-- Lot 1: Concrete -->
              <div class="bg-[#F9F7F4] rounded-2xl p-5 border border-[#E5DFD7] flex flex-col justify-between hover:shadow-md transition-all group">
                <div>
                  <div class="relative h-44 rounded-xl overflow-hidden mb-4 bg-black">
                    <img src="/assets/materials/concrete.jpg" alt="Concrete" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Reusable</span>
                    <span class="absolute top-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold text-white">₹8 / kg</span>
                  </div>
                  <h4 class="text-base font-bold text-[#1C1917] uppercase">Crushed Concrete Aggregate</h4>
                  <div class="text-xs font-mono text-[#78716C] mt-0.5 mb-2">800 kg available • Sieved 20mm</div>
                  <p class="text-xs text-[#78716C] line-clamp-2">Graded coarse rubble from foundation lintels suitable for road sub-base.</p>
                </div>

                <div class="pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs mt-4">
                  <span class="font-medium text-[#1C1917]">Skyline Heights</span>
                  <span class="font-mono font-bold text-[#16A34A]">4.8 km away</span>
                </div>
              </div>

              <!-- Lot 2: Rebar -->
              <div class="bg-[#F9F7F4] rounded-2xl p-5 border border-[#E5DFD7] flex flex-col justify-between hover:shadow-md transition-all group">
                <div>
                  <div class="relative h-44 rounded-xl overflow-hidden mb-4 bg-black">
                    <img src="/assets/materials/metal.jpg" alt="Rebar" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE]">Recyclable</span>
                    <span class="absolute top-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold text-white">₹34 / kg</span>
                  </div>
                  <h4 class="text-base font-bold text-[#1C1917] uppercase">Fe-500D Rebar Offcuts</h4>
                  <div class="text-xs font-mono text-[#78716C] mt-0.5 mb-2">1,420 kg available • Structural Grade</div>
                  <p class="text-xs text-[#78716C] line-clamp-2">Straight and sheared high-tensile steel rebar offcuts from pier demolition.</p>
                </div>

                <div class="pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs mt-4">
                  <span class="font-medium text-[#1C1917]">L&T Civil Yard</span>
                  <span class="font-mono font-bold text-[#16A34A]">14.2 km away</span>
                </div>
              </div>

              <!-- Lot 3: Brick -->
              <div class="bg-[#F9F7F4] rounded-2xl p-5 border border-[#E5DFD7] flex flex-col justify-between hover:shadow-md transition-all group">
                <div>
                  <div class="relative h-44 rounded-xl overflow-hidden mb-4 bg-black">
                    <img src="/assets/materials/brick.jpg" alt="Brick" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Reusable</span>
                    <span class="absolute top-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold text-white">₹8 / brick</span>
                  </div>
                  <h4 class="text-base font-bold text-[#1C1917] uppercase">Heritage Terracotta Bricks</h4>
                  <div class="text-xs font-mono text-[#78716C] mt-0.5 mb-2">2,500 units • Cleaned & Palletized</div>
                  <p class="text-xs text-[#78716C] line-clamp-2">Mortar-free heritage clay masonry salvaged for landscape walls and pavers.</p>
                </div>

                <div class="pt-3 border-t border-[#E5DFD7] flex items-center justify-between text-xs mt-4">
                  <span class="font-medium text-[#1C1917]">BMRCL Metro Site</span>
                  <span class="font-mono font-bold text-[#16A34A]">8.1 km away</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 5: HAVERSINE RADIAL DISTANCE ENGINE -->
        <section id="calculator">
          <div class="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-8 card-editorial-hover">
            <div class="max-w-2xl">
              <span class="text-xs font-mono text-[#78716C] uppercase font-bold">05 / GEOSPATIAL LOGISTICS</span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight mt-1">
                Haversine Distance & Diesel Fuel Avoidance Engine
              </h2>
              <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">
                Select an operational radius to calculate available secondary material tonnage and avoided diesel haulage emissions.
              </p>
            </div>

            <!-- Radius Pills -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                *ngFor="let radius of [5, 10, 20, 50]"
                (click)="selectedRadius = radius"
                [ngClass]="selectedRadius === radius ? 'bg-[#1C1917] text-white font-bold shadow-md' : 'bg-[#F6F3EF] text-[#78716C] hover:text-[#1C1917] border border-[#E2DDD5]'"
                class="p-4 rounded-2xl text-center transition-all cursor-pointer font-mono"
              >
                <div class="text-2xl font-black">{{ radius }} km</div>
                <div class="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">Transit Radius</div>
              </button>
            </div>

            <!-- Calculated Metrics Strip -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div>
                <div class="text-[10px] font-mono text-[#78716C] uppercase font-bold">Available Secondary Lots</div>
                <div class="text-3xl font-mono font-black text-[#1C1917] mt-1">{{ getTonnageForRadius(selectedRadius) }} Tons</div>
                <div class="text-[11px] text-[#16A34A] font-semibold mt-0.5">Ready for immediate site pickup</div>
              </div>

              <div>
                <div class="text-[10px] font-mono text-[#78716C] uppercase font-bold">Average Transit Route</div>
                <div class="text-3xl font-mono font-black text-[#1C1917] mt-1">{{ (selectedRadius * 0.42).toFixed(1) }} km</div>
                <div class="text-[11px] text-[#78716C] mt-0.5">Vs 45 km to virgin quarry</div>
              </div>

              <div>
                <div class="text-[10px] font-mono text-[#78716C] uppercase font-bold">Transport Carbon Saved</div>
                <div class="text-3xl font-mono font-black text-[#16A34A] mt-1">{{ (selectedRadius * 18.5).toFixed(0) }} kg CO2</div>
                <div class="text-[11px] text-[#16A34A] font-semibold mt-0.5">Per truck dispatch</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 6: CORE ENGINEERING & RESEARCH TEAM (CSBS • RAJAGIRI SCHOOL OF ENGINEERING & TECHNOLOGY) -->
        <section id="founder" class="space-y-8">
          <div class="bg-gradient-to-b from-[#141210] via-[#110F0E] to-[#0A0908] text-white rounded-[36px] p-8 sm:p-12 lg:p-16 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-white/[0.12] space-y-12 relative overflow-hidden card-editorial-hover">
            <!-- Ambient Luminous Glow Orbs -->
            <div class="absolute -right-24 -bottom-24 w-[420px] h-[420px] rounded-full bg-emerald-500/[0.05] blur-[100px] pointer-events-none"></div>
            <div class="absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full bg-amber-500/[0.04] blur-[100px] pointer-events-none"></div>

            <!-- Top Row: Academic Prestige Banner & Directive Thesis -->
            <div class="space-y-8 relative z-10">
              
              <!-- CSBS • RSET Institutional Crest Header -->
              <div class="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.1] backdrop-blur-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-xl shadow-black/40 ring-1 ring-white/30 flex items-center justify-center shrink-0 overflow-hidden group/crest transition-all duration-300 hover:scale-105">
                    <img 
                      src="/assets/logos/rset_logo.png" 
                      alt="Rajagiri School of Engineering & Technology" 
                      class="w-full h-full object-contain select-none"
                    />
                  </div>
                  <div class="space-y-0.5">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-[10px] font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                        ACADEMIC MINI PROJECT INITIATIVE
                      </span>
                      <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                        AUTONOMOUS
                      </span>
                      <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 font-mono">
                        KTU AFFILIATED
                      </span>
                    </div>
                    <h3 class="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight">
                      Department of Computer Science and Business Systems (CSBS)
                    </h3>
                    <p class="text-xs text-stone-400 font-mono">
                      Rajagiri School of Engineering & Technology (RSET), Kochi, Kerala
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-[11px] font-mono text-stone-300 bg-black/60 px-4 py-2.5 rounded-xl border border-white/10 self-stretch lg:self-auto justify-center">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Batch 2024–2028 • B.Tech Mini Project</span>
                </div>
              </div>

              <!-- Faculty Guidance & Project Thesis Row -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                <!-- Grand Editorial Thesis Quotation (7 Cols) -->
                <div class="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between space-y-6">
                  <blockquote class="text-xl sm:text-2xl lg:text-3xl font-light font-serif italic text-white/95 leading-snug">
                    "Every demolition site is an above-ground quarry. We engineered ReBuild to prove that circularity in heavy infrastructure isn't just an abstract theory — it is superior economics, faster local supply chains, and zero landfill waste."
                  </blockquote>

                  <p class="text-xs sm:text-sm text-stone-400 font-mono leading-relaxed pt-4 border-t border-white/[0.06]">
                    Conceived and developed by a specialized student engineering team at Rajagiri School of Engineering & Technology, bridging enterprise software engineering, computer vision deep learning, and geospatial haulage logistics.
                  </p>
                </div>

                <!-- Faculty Project Guide Card (5 Cols) -->
                <div class="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 backdrop-blur-xl flex flex-col justify-between transition-all duration-300">
                  <div class="space-y-4">
                    <!-- Top Badge Row -->
                    <div class="flex items-center justify-between pb-3.5 border-b border-white/10">
                      <span class="text-[11px] font-mono tracking-widest uppercase text-stone-400">
                        PROJECT GUIDE
                      </span>
                      <span class="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10">
                        FACULTY SUPERVISOR
                      </span>
                    </div>

                    <!-- Guide Name & Department -->
                    <div>
                      <h4 class="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                        Mr. Ajith Jacob
                      </h4>
                      <div class="text-xs font-mono text-stone-300 mt-1 uppercase">
                        Assistant Professor
                      </div>
                      <div class="text-xs font-mono text-stone-400 mt-0.5">
                        Department of Computer Science and Business Systems (CSBS)
                      </div>
                    </div>

                    <div class="w-8 h-[1px] bg-white/20"></div>

                    <p class="text-xs sm:text-[13px] text-stone-300 leading-relaxed">
                      Academic supervision, technical direction, and research mentorship for the B.Tech Mini Project initiative at Rajagiri School of Engineering & Technology (RSET).
                    </p>
                  </div>

                  <!-- Guide Bottom Spec -->
                  <div class="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
                    <span>RSET CSBS Academic Mentorship</span>
                    <span>KTU Autonomous</span>
                  </div>
                </div>

              </div>

            </div>

            <!-- Middle Row: 4-Member Student Engineering Team Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
              
              <!-- Member 1: Ihsan Muhammed -->
              <div class="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <!-- Role Badge Header -->
                  <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <span class="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 font-medium">
                      LEAD ARCHITECT
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-bold tracking-tight text-white uppercase">
                    Ihsan Muhammed
                  </h3>

                  <!-- Role Subtitle -->
                  <div class="text-xs font-mono text-stone-400 mt-1 uppercase">
                    System Architecture & Platform OS
                  </div>

                  <!-- Subtle Hairline Accent -->
                  <div class="w-8 h-[1px] bg-white/20 my-3.5"></div>

                  <!-- Description -->
                  <p class="text-xs text-stone-300 leading-relaxed">
                    Directed overall platform software architecture, demolition jobsite OS workflow, reactive state management, and full-stack PostgreSQL/Node API integration.
                  </p>
                </div>

                <!-- Technical Contribution Tags -->
                <div class="pt-4 mt-5 border-t border-white/10 space-y-2">
                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Angular 19</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Node API</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">PostgreSQL</span>
                  </div>
                  <div class="text-[10px] font-mono text-stone-400 pt-1">
                    Platform Architecture
                  </div>
                </div>
              </div>

              <!-- Member 2: Abhinav Anil -->
              <div class="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <!-- Role Badge Header -->
                  <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <span class="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 font-medium">
                      AI & VISION
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-bold tracking-tight text-white uppercase">
                    Abhinav Anil
                  </h3>

                  <!-- Role Subtitle -->
                  <div class="text-xs font-mono text-stone-400 mt-1 uppercase">
                    Deep Learning & Computer Vision Lead
                  </div>

                  <!-- Subtle Hairline Accent -->
                  <div class="w-8 h-[1px] bg-white/20 my-3.5"></div>

                  <!-- Description -->
                  <p class="text-xs text-stone-300 leading-relaxed">
                    Designed, trained, and optimized the ResNet-34 deep convolutional neural network for 12-class industrial C&D debris classification and real-time tensor inference.
                  </p>
                </div>

                <!-- Technical Contribution Tags -->
                <div class="pt-4 mt-5 border-t border-white/10 space-y-2">
                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">PyTorch</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">ResNet-34</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Inference API</span>
                  </div>
                  <div class="text-[10px] font-mono text-stone-400 pt-1">
                    Vision Inference Model
                  </div>
                </div>
              </div>

              <!-- Member 3: Muhammed Farzin -->
              <div class="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <!-- Role Badge Header -->
                  <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <span class="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 font-medium">
                      GEOSPATIAL SYSTEMS
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-bold tracking-tight text-white uppercase">
                    Muhammed Farzin
                  </h3>

                  <!-- Role Subtitle -->
                  <div class="text-xs font-mono text-stone-400 mt-1 uppercase">
                    Geospatial Intelligence & Routing Engine
                  </div>

                  <!-- Subtle Hairline Accent -->
                  <div class="w-8 h-[1px] bg-white/20 my-3.5"></div>

                  <!-- Description -->
                  <p class="text-xs text-stone-300 leading-relaxed">
                    Engineered the Haversine geodesic radial distance matching algorithm, Leaflet interactive geospatial mapping, and low-latency haulage dispatch route matrix.
                  </p>
                </div>

                <!-- Technical Contribution Tags -->
                <div class="pt-4 mt-5 border-t border-white/10 space-y-2">
                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Haversine</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Leaflet</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Routing Matrix</span>
                  </div>
                  <div class="text-[10px] font-mono text-stone-400 pt-1">
                    Geospatial Engine
                  </div>
                </div>
              </div>

              <!-- Member 4: Abdul Hadi -->
              <div class="p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <!-- Role Badge Header -->
                  <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                    <span class="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-stone-300 border border-white/10 font-medium">
                      ESG & INFRASTRUCTURE
                    </span>
                  </div>

                  <!-- Name -->
                  <h3 class="text-xl font-bold tracking-tight text-white uppercase">
                    Abdul Hadi
                  </h3>

                  <!-- Role Subtitle -->
                  <div class="text-xs font-mono text-stone-400 mt-1 uppercase">
                    Sustainability Analytics & Telematics
                  </div>

                  <!-- Subtle Hairline Accent -->
                  <div class="w-8 h-[1px] bg-white/20 my-3.5"></div>

                  <!-- Description -->
                  <p class="text-xs text-stone-300 leading-relaxed">
                    Developed Scope 3 GHG carbon avoidance calculation models, ISO 14021 compliance auditing schemas, heavy machinery telematics, and workforce rosters.
                  </p>
                </div>

                <!-- Technical Contribution Tags -->
                <div class="pt-4 mt-5 border-t border-white/10 space-y-2">
                  <div class="flex flex-wrap gap-1.5">
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Scope 3 GHG</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">ISO 14021</span>
                    <span class="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-stone-300">Telematics</span>
                  </div>
                  <div class="text-[10px] font-mono text-stone-400 pt-1">
                    Carbon Analytics
                  </div>
                </div>
              </div>

            </div>

            <!-- Bottom Row: Engineering Tenets -->
            <div class="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-xs">
              <div class="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span class="font-mono text-emerald-400 font-bold block text-[11px] tracking-wider uppercase">01 / CLOSED-LOOP INDUSTRIAL OS</span>
                <p class="text-stone-300/80 leading-relaxed">
                  Engineering practical software systems that convert civil demolition debris into certified secondary construction commodities.
                </p>
              </div>

              <div class="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span class="font-mono text-amber-300 font-bold block text-[11px] tracking-wider uppercase">02 / COMPUTATIONAL PROVENANCE</span>
                <p class="text-stone-300/80 leading-relaxed">
                  Applying convolutional neural networks and cryptographic transfer receipts to verify structural material integrity at the source.
                </p>
              </div>

              <div class="space-y-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span class="font-mono text-blue-300 font-bold block text-[11px] tracking-wider uppercase">03 / GEODESIC ROUTING MATRIX</span>
                <p class="text-stone-300/80 leading-relaxed">
                  Mathematical haulage boundaries ensuring local secondary commodity transit produces lower net emissions than virgin quarry extraction.
                </p>
              </div>
            </div>

          </div>
        </section>

        <!-- SECTION 7: HIGH-CONVERSION PLATFORM GATEWAY (MAKE USERS EAGER TO LOG IN) -->
        <section id="access">
          <div class="bg-white rounded-[32px] p-8 sm:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-[#E5DFD7] space-y-8 text-center max-w-4xl mx-auto card-editorial-hover">
            <div class="space-y-3">
              <span class="text-xs font-mono text-[#78716C] uppercase font-bold tracking-wider">
                07 / GET STARTED TODAY • DEPLOY CIRCULAR ARCHITECTURE
              </span>
              <h2 class="text-3xl sm:text-5xl font-black text-[#1C1917] tracking-tight">
                Ready to Eliminate Landfill Waste and Halve Raw Material Costs?
              </h2>
              <p class="text-xs sm:text-base text-[#78716C] max-w-xl mx-auto">
                Join over 1,200 contractors, structural engineers, and precast factories operating on ReBuild. Instant access, zero specialized hardware required.
              </p>
            </div>

            <!-- Role Launch Choice Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <a
                routerLink="/auth/register"
                class="p-5 rounded-2xl bg-[#F9F7F4] hover:bg-[#F2ECE4] border border-[#E5DFD7] hover:border-[#1C1917] transition-all cursor-pointer group"
              >
                <div class="text-2xl mb-2">🏗️</div>
                <div class="font-black text-sm text-[#1C1917] uppercase">I am a Contractor</div>
                <p class="text-xs text-[#78716C] mt-1">Log demolition rubble with AI, sell secondary lots, and rent machinery.</p>
                <div class="text-xs font-bold text-[#1C1917] mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Create Contractor Account</span>
                  <span>→</span>
                </div>
              </a>

              <a
                routerLink="/auth/register"
                class="p-5 rounded-2xl bg-[#F9F7F4] hover:bg-[#F2ECE4] border border-[#E5DFD7] hover:border-[#2563EB] transition-all cursor-pointer group"
              >
                <div class="text-2xl mb-2">🛒</div>
                <div class="font-black text-sm text-[#1C1917] uppercase">I am a Buyer / Factory</div>
                <p class="text-xs text-[#78716C] mt-1">Source local aggregate, steel & brick within 50km at 35%-55% discount.</p>
                <div class="text-xs font-bold text-[#2563EB] mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Create Buyer Account</span>
                  <span>→</span>
                </div>
              </a>
            </div>

            <!-- Direct Sign-In Alternative -->
            <div class="pt-4 border-t border-[#E5DFD7] flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#78716C]">
              <span>Already registered on ReBuild?</span>
              <a routerLink="/auth/login" class="font-bold text-[#1C1917] hover:underline">
                Sign in to your Workspace →
              </a>
            </div>
          </div>
        </section>

      </div>

      <!-- FOOTER -->
      <footer class="mt-20 py-12 px-6 border-t border-[#E2DBD1] bg-[#E7E1D8] text-xs text-[#78716C]">
        <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="font-black text-sm text-[#1C1917]">✱ REBUILD</span>
            <span>• Circular Architecture OS v2.4</span>
            <span class="hidden md:inline text-[#A8A29E]">|</span>
            <span class="hidden md:inline font-mono text-[10px] text-[#16A34A] font-bold">● CLOUD SQL & VISION INFERENCE ACTIVE</span>
          </div>

          <div class="flex items-center gap-6 font-mono text-[11px]">
            <a routerLink="/auth/login" class="hover:text-[#1C1917] transition-colors">Sign In</a>
            <a routerLink="/dashboard" class="hover:text-[#1C1917] transition-colors">Workspace</a>
            <a routerLink="/marketplace" class="hover:text-[#1C1917] transition-colors">Marketplace</a>
            <a routerLink="/impact" class="hover:text-[#1C1917] transition-colors">ESG Reports</a>
          </div>

          <div class="text-[11px] font-mono text-center sm:text-right">
            © 2026 ReBuild Technologies. B.Tech Mini Project (Batch 2024–2028). Engineered by Ihsan Muhammed, Abhinav Anil, Muhammed Farzin & Abdul Hadi. Guided by Mr. Ajith Jacob (Assistant Professor, Dept. of CSBS), Rajagiri School of Engineering & Technology (RSET).
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent implements OnInit {
  searchQuery: string = '';
  selectedRadius: number = 10;
  activeSection: string = 'hero';
  heroTiltStyle: string = '';

  heroProjects: HeroProject[] = [
    {
      id: 'aspen',
      number: '01',
      title: 'Lakeside Timber Pavilion',
      location: 'Aspen Ridge, Colorado',
      materialsTag: '100% Salvaged Pine & Douglas Fir',
      divertedTons: 420,
      co2AvoidedTons: 185,
      costSavingsINR: '₹18,40,000',
      imageUrl: '/assets/materials/circular_pavilion.jpg',
      architecturalSpec: 'Mortar-free deconstructed heavy timber joists & reclaimed foundation lintels',
      certification: 'LEED Platinum Circular Credit • ISO 14021'
    },
    {
      id: 'concrete',
      number: '02',
      title: 'Skyline Metro Infrastructure',
      location: 'Metro Rail Corridor',
      materialsTag: 'Crushed Concrete Aggregate M25-M40',
      divertedTons: 8450,
      co2AvoidedTons: 620,
      costSavingsINR: '₹1,24,00,000',
      imageUrl: '/assets/materials/concrete.jpg',
      architecturalSpec: 'Graded 20mm/40mm coarse sub-base replacing virgin river quarry aggregate',
      certification: 'Zero Landfill Demolition Manifest • Scope 3 Audit'
    },
    {
      id: 'rebar',
      number: '03',
      title: 'Heritage Brick & Steel Loft',
      location: 'Central Industrial District',
      materialsTag: 'Cleaned Terracotta & Fe-500D Rebar',
      divertedTons: 1180,
      co2AvoidedTons: 340,
      costSavingsINR: '₹46,50,000',
      imageUrl: '/assets/materials/brick.jpg',
      architecturalSpec: '2,500 palletized clay bricks & sheared structural steel tie-rods',
      certification: 'Precast Circular Certification • B2B Direct'
    }
  ];

  activeHeroProject: HeroProject = this.heroProjects[0];

  materialDemos: MaterialDemo[] = [
    {
      id: 'concrete',
      name: '🪨 Concrete & Rubble',
      category: 'Concrete',
      confidence: 96.8,
      secondary: 'Stone',
      secondaryConf: 2.8,
      imageUrl: '/assets/materials/concrete.jpg',
      features: [
        'Cementitious grey matrix with coarse aggregate exposure',
        'High-frequency fracture plane identification',
        'Compressive strength grading: M25-M40 reusable'
      ],
      latency: 18,
      specs: 'Sieved 20mm/40mm coarse sub-base'
    },
    {
      id: 'metal',
      name: '🔩 Steel Rebar & Pipes',
      category: 'Metal',
      confidence: 97.4,
      secondary: 'Mixed Metals',
      secondaryConf: 2.1,
      imageUrl: '/assets/materials/metal.jpg',
      features: [
        'Specular rebar ribbing and ridge pattern detection',
        'High-tensile structural profile verification',
        'Fe-500D yield strength matching'
      ],
      latency: 19,
      specs: 'Fe-500D TMT bars & structural I-beams'
    },
    {
      id: 'brick',
      name: '🧱 Clay Brick & Terracotta',
      category: 'Brick',
      confidence: 95.2,
      secondary: 'Ceramic',
      secondaryConf: 3.9,
      imageUrl: '/assets/materials/brick.jpg',
      features: [
        'Terracotta chrominance signature matching',
        'Mortar boundary edge segmentation',
        'Compressive durability test: Class A 10.5 N/mm²'
      ],
      latency: 17,
      specs: 'Cleaned, palletized architectural bricks'
    },
    {
      id: 'timber',
      name: '🪵 Construction Wood',
      category: 'Wood',
      confidence: 94.6,
      secondary: 'Drywall',
      secondaryConf: 4.8,
      imageUrl: '/assets/materials/wood.jpg',
      features: [
        'Linear grain structure and lignin chrominance',
        'Formwork ply edge delineation',
        'Structural beam load reuse potential'
      ],
      latency: 21,
      specs: 'Salvaged pine & hardwood structural joists'
    }
  ];

  activeDemo: MaterialDemo = this.materialDemos[0];

  ngOnInit() {}

  onMouseMoveHero(event: MouseEvent, cardEl: HTMLElement) {
    const rect = cardEl.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((event.clientY - rect.top - centerY) / centerY) * -3;
    const rotateY = ((event.clientX - rect.left - centerX) / centerX) * 3;
    this.heroTiltStyle = `transform: perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg); transition: transform 0.1s ease-out;`;
  }

  onMouseLeaveHero() {
    this.heroTiltStyle = 'transform: perspective(1000px) rotateX(0deg) rotateY(0deg); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);';
  }

  scrollToSection(id: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeSection = id;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -85;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const sections = ['hero', 'ai-scanner', 'ecosystem', 'marketplace', 'calculator', 'founder', 'access'];
    const scrollPosition = window.pageYOffset + 140;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection = id;
          break;
        }
      }
    }
  }

  getTonnageForRadius(radius: number): number {
    switch (radius) {
      case 5: return 280;
      case 10: return 750;
      case 20: return 1840;
      case 50: return 5200;
      default: return 750;
    }
  }
}
