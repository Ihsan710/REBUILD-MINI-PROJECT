import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface MaterialDemo {
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
    <!-- MAIN WRAPPER: Warm Cashmere / Linen Sand Canvas -->
    <div class="min-h-screen bg-[#EDE7DF] text-[#1C1917] font-sans selection:bg-[#D4A373]/30 selection:text-[#1C1917] scroll-smooth">
      
      <!-- TOP ARCHITECTURAL STICKY NAVBAR -->
      <nav class="sticky top-0 z-50 bg-[#EDE7DF]/85 backdrop-blur-xl border-b border-[#E2DBD1] transition-all">
        <div class="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <!-- Brand Emblem -->
          <a routerLink="/dashboard" class="flex items-center gap-3 group cursor-pointer">
            <div class="w-10 h-10 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#E2DBD1] flex items-center justify-center text-lg font-bold text-[#1C1917] group-hover:scale-105 transition-transform">
              ✱
            </div>
            <div>
              <span class="font-extrabold text-xl tracking-tight text-[#1C1917]">REBUILD</span>
              <span class="block text-[9px] font-mono tracking-widest text-[#78716C] uppercase -mt-0.5">Circular Architecture OS</span>
            </div>
          </a>

          <!-- Nav Anchors (Interactive Buttons with Active Scroll-Spy Pill) -->
          <div class="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#E5DFD7]/60 border border-[#E2DBD1] text-xs font-semibold">
            <button
              (click)="scrollToSection('hero', $event)"
              [ngClass]="activeSection === 'hero' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Overview
            </button>

            <button
              (click)="scrollToSection('funnel', $event)"
              [ngClass]="activeSection === 'funnel' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Conversion Funnel
            </button>

            <button
              (click)="scrollToSection('ai-scanner', $event)"
              [ngClass]="activeSection === 'ai-scanner' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>AI Vision Scanner</span>
            </button>

            <button
              (click)="scrollToSection('ecosystem', $event)"
              [ngClass]="activeSection === 'ecosystem' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              2-Sided Network
            </button>

            <button
              (click)="scrollToSection('marketplace', $event)"
              [ngClass]="activeSection === 'marketplace' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Circular Catalog
            </button>

            <button
              (click)="scrollToSection('calculator', $event)"
              [ngClass]="activeSection === 'calculator' ? 'text-[#1C1917] bg-white shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Haversine Distance
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <a routerLink="/auth/login" class="px-4 py-2 rounded-xl text-xs font-bold text-[#1C1917] hover:bg-white/60 transition-all">
              Sign In
            </a>
            <a routerLink="/dashboard" class="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer">
              <span>Launch Workspace</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </nav>

      <!-- PAGE CONTAINER -->
      <div class="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-16">

        <!-- SECTION 1: PANORAMIC ARCHITECTURAL HERO & METRICS (MATCHING SCREENSHOT) -->
        <section id="hero" class="space-y-6">
          <!-- Panoramic Hero Card -->
          <div class="relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-[#E2DBD1] group">
            <img
              src="/assets/materials/circular_pavilion.jpg"
              alt="Lakeside Reclaimed Pavilion House"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            />

            <!-- Architectural Natural Overlays -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent"></div>

            <!-- Top Left Overlay Headline & Metadata -->
            <div class="absolute top-8 sm:top-10 left-8 sm:left-10 text-white z-10 max-w-xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white/90 mb-3 border border-white/25">
                <span>Featured Circular Project</span> • <span>100% Reclaimed Timber & Concrete</span>
              </div>
              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">Lakeside House</h1>
              <p class="text-xs sm:text-base text-white/85 font-medium mt-1.5 drop-shadow">
                42 Aspen Ridge, Colorado • Demolition Diversion & Heritage Wood Architecture
              </p>
            </div>

            <!-- Top Right Architectural Action Icon Stack -->
            <div class="absolute top-8 sm:top-10 right-8 sm:right-10 flex flex-col gap-3 z-10">
              <button title="Recent Timeline" class="w-10 h-10 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button title="Material Specifications" class="w-10 h-10 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <button title="Share Project" class="w-10 h-10 rounded-2xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>

            <!-- Bottom Left Avatar Stack Pill -->
            <div class="absolute bottom-8 sm:bottom-10 left-8 sm:left-10 z-10 flex items-center gap-3.5 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-lg">
              <div class="flex -space-x-2">
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                <img class="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
              </div>
              <div>
                <span class="text-sm font-black text-white block leading-none">1200+</span>
                <span class="text-[10px] text-white/85 font-medium">Added to Favorites</span>
              </div>
            </div>

            <!-- Bottom Right Direct CTA Pill -->
            <div class="absolute bottom-8 sm:bottom-10 right-8 sm:right-10 z-10 hidden sm:block">
              <a routerLink="/marketplace" class="px-5 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-[#1C1917] text-xs font-bold shadow-lg backdrop-blur-md transition-all flex items-center gap-2">
                <span>View Circular Materials</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <!-- 4-Column Key Performance Metrics Strip (Matching Screenshot Exactly) -->
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7]">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <!-- Stat 1: Total Views -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Total Views</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">14.2k</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 18%
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Platform material visits</div>
              </div>

              <!-- Stat 2: Saved / Favorites -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Saved / Favorites</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">842</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 12%
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Bookmarked circular lots</div>
              </div>

              <!-- Stat 3: Inquiries -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Inquiries</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">48</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34]">
                    ↑ 6%
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Procurement purchase orders</div>
              </div>

              <!-- Stat 4: Scheduled Viewings -->
              <div>
                <div class="text-xs font-semibold text-[#78716C]">Scheduled Viewings</div>
                <div class="flex items-baseline gap-2.5 mt-2">
                  <span class="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight">12</span>
                  <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDE8E8] text-[#C53030]">
                    ↓ 9%
                  </span>
                </div>
                <div class="text-[11px] text-[#A8A29E] mt-1">Site haulage dispatches</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 2: CONVERSION FUNNEL & MATERIAL LIFECYCLE (MATCHING SCREENSHOT) -->
        <section id="funnel">
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-6">
            <!-- Header & Filters -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 class="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight">Conversion Funnel</h2>
                <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Tracking the buyer's journey from initial listing view to scheduled property showing</p>
              </div>

              <div class="flex items-center gap-2.5 self-start sm:self-auto">
                <button class="px-4 py-2 rounded-2xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-bold text-[#1C1917] flex items-center gap-2 hover:bg-[#EDE7DF] transition-colors">
                  <span>All Channels</span>
                  <span class="text-[10px] text-[#78716C]">⌄</span>
                </button>
                <button class="px-4 py-2 rounded-2xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs font-bold text-[#1C1917] flex items-center gap-2 hover:bg-[#EDE7DF] transition-colors">
                  <span>This Month</span>
                  <span class="text-[10px] text-[#78716C]">⌄</span>
                </button>
              </div>
            </div>

            <!-- Funnel Progress Rows (Matching Screenshot Texture and Colors) -->
            <div class="space-y-4 pt-2 text-xs">
              
              <!-- Funnel Row 1: Views -->
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-5 sm:col-span-3 flex items-center gap-2">
                  <span class="text-[#A8A29E] text-sm">ⓘ</span>
                  <span class="font-bold text-[#1C1917] text-sm">Views</span>
                  <span class="text-[#78716C] font-mono text-xs ml-auto">100%</span>
                  <span class="font-mono font-bold text-[#1C1917] text-xs">14,240</span>
                </div>
                <div class="col-span-7 sm:col-span-9">
                  <!-- Diagonal Hatch Bar Texture -->
                  <div class="w-full h-4 rounded-full bg-[#EBE5DD] relative overflow-hidden"
                       style="background-image: repeating-linear-gradient(45deg, #E2DBD1, #E2DBD1 4px, #EDE7DF 4px, #EDE7DF 8px);">
                  </div>
                </div>
              </div>

              <!-- Funnel Row 2: Clicks -->
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-5 sm:col-span-3 flex items-center gap-2">
                  <span class="text-[#A8A29E] text-sm">ⓘ</span>
                  <span class="font-bold text-[#1C1917] text-sm">Clicks</span>
                  <span class="text-[#78716C] font-mono text-xs ml-auto">25%</span>
                  <span class="font-mono font-bold text-[#1C1917] text-xs">3,560</span>
                </div>
                <div class="col-span-7 sm:col-span-9 flex items-center gap-3">
                  <div class="w-full h-4 rounded-full bg-[#F5F1EB] overflow-hidden flex">
                    <div class="h-full bg-[#E5D2BC] rounded-full transition-all duration-700" style="width: 58%;"></div>
                  </div>
                  <span class="text-[11px] font-mono text-[#E05252] shrink-0 font-semibold">-86.7% did not submit</span>
                </div>
              </div>

              <!-- Funnel Row 3: Inquiries -->
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-5 sm:col-span-3 flex items-center gap-2">
                  <span class="text-[#A8A29E] text-sm">ⓘ</span>
                  <span class="font-bold text-[#1C1917] text-sm">Inquiries</span>
                  <span class="text-[#78716C] font-mono text-xs ml-auto">2.4%</span>
                  <span class="font-mono font-bold text-[#1C1917] text-xs">340</span>
                </div>
                <div class="col-span-7 sm:col-span-9 flex items-center gap-3">
                  <div class="w-full h-4 rounded-full bg-[#F5F1EB] overflow-hidden flex">
                    <div class="h-full bg-[#B8B4AE] rounded-full transition-all duration-700" style="width: 32%;"></div>
                  </div>
                  <span class="text-[11px] font-mono text-[#D97706] shrink-0 font-semibold">-43.8% failed verification</span>
                </div>
              </div>

              <!-- Funnel Row 4: Viewings -->
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-5 sm:col-span-3 flex items-center gap-2">
                  <span class="text-[#A8A29E] text-sm">ⓘ</span>
                  <span class="font-bold text-[#1C1917] text-sm">Viewings</span>
                  <span class="text-[#78716C] font-mono text-xs ml-auto">0.08%</span>
                  <span class="font-mono font-bold text-[#1C1917] text-xs">12</span>
                </div>
                <div class="col-span-7 sm:col-span-9 flex items-center gap-3">
                  <div class="w-full h-4 rounded-full bg-[#F5F1EB] overflow-hidden flex">
                    <div class="h-full bg-[#8E8A84] rounded-full transition-all duration-700" style="width: 14%;"></div>
                  </div>
                  <span class="text-[11px] font-mono text-[#78716C] shrink-0 font-semibold">-16.7% lost source attribution</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- SECTION 3: INTERACTIVE LIVE AI VISION SCANNER (WARM ARCHITECTURAL THEME) -->
        <section id="ai-scanner">
          <div class="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-8">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5DFD7]">
              <div>
                <div class="inline-flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold uppercase tracking-wider mb-2">
                  <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  PYTORCH RESNET-34 VISION INFERENCE
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Interactive Computer Vision Scanner</h2>
                <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Click an industrial class tab to test real-time material classification & tensor confidence.</p>
              </div>

              <!-- Interactive Material Selector Tabs -->
              <div class="flex flex-wrap gap-2">
                <button
                  *ngFor="let demo of materialDemos"
                  (click)="activeDemo = demo"
                  [ngClass]="activeDemo.id === demo.id ? 'bg-[#1C1917] text-white font-bold shadow-md' : 'bg-[#F6F3EF] text-[#78716C] hover:text-[#1C1917] border border-[#E2DDD5]'"
                  class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
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
                  <div class="text-[#1C1917] font-bold">RESNET-34 CDW</div>
                  <div class="text-[#78716C]">LATENCY: {{ activeDemo.latency }}ms</div>
                </div>

                <!-- Image Viewport with Laser Line -->
                <div class="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-black">
                  <img
                    [src]="activeDemo.imageUrl"
                    [alt]="activeDemo.name"
                    class="w-full h-full object-cover transition-all duration-500"
                  />

                  <!-- Laser Sweep Beam -->
                  <div class="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#22C55E] to-transparent shadow-[0_0_15px_#22C55E] animate-laser-sweep pointer-events-none"></div>

                  <!-- AI Reticle Overlay -->
                  <div class="absolute inset-8 sm:inset-10 border-2 border-[#22C55E] rounded-xl pointer-events-none flex flex-col justify-between p-3 bg-black/10">
                    <div class="flex items-center justify-between">
                      <span class="bg-[#1C1917] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow">
                        {{ activeDemo.category.toUpperCase() }} [{{ activeDemo.confidence }}%]
                      </span>
                      <span class="bg-white/90 text-[#1C1917] font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        224x224 TENSOR
                      </span>
                    </div>

                    <div class="flex items-center justify-between text-[10px] font-mono text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      <span>SPEC: {{ activeDemo.specs }}</span>
                      <span class="text-[#4ADE80] font-bold">REUSE READY ✓</span>
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
                  <span class="text-xs font-mono text-[#78716C]">Certified ISO 14021</span>
                  <a routerLink="/waste" class="px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow transition-all cursor-pointer">
                    Scan With Device Camera →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 4: 2-SIDED DIRECT ECOSYSTEM (CONTRACTOR <-> BUYER) -->
        <section id="ecosystem">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <!-- Contractor Box -->
            <div class="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div class="flex items-center justify-between mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-[#F6F3EF] text-2xl flex items-center justify-center border border-[#E2DDD5]">
                    🏗️
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#EBF7EE] text-[#16A34A] border border-[#DCFCE7]">
                    SUPPLIER & CONSUMER
                  </span>
                </div>

                <h3 class="text-2xl font-bold text-[#1C1917] mb-2">Contractor Workspace</h3>
                <p class="text-xs text-[#78716C] leading-relaxed mb-6">
                  Complete jobsite OS: Log on-site demolition rubble with the AI Camera, auto-publish manifests to the marketplace, dispatch buyer orders, and buy cheaper secondary materials from other sites!
                </p>

                <div class="space-y-2.5 text-xs text-[#1C1917]">
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#16A34A] font-bold">✓</span>
                    <span>AI Computer Vision Camera for 12 Industrial C&D Materials</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#16A34A] font-bold">✓</span>
                    <span>Auto-Catalog Debris as Reusable (₹/kg or Free Site Pickup)</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#16A34A] font-bold">✓</span>
                    <span>Buy secondary aggregates & rebar directly from nearby contractor sites</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#16A34A] font-bold">✓</span>
                    <span>Heavy machinery telematics & daily workforce roster management</span>
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-[#E5DFD7]">
                <a routerLink="/auth/login" class="text-xs font-bold text-[#1C1917] hover:text-[#78716C] flex items-center gap-1.5">
                  Sign In as Contractor (Ihsan Al-Mansoor) →
                </a>
              </div>
            </div>

            <!-- Buyer Box -->
            <div class="bg-white rounded-[28px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] flex flex-col justify-between hover:shadow-lg transition-all group">
              <div>
                <div class="flex items-center justify-between mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-[#F6F3EF] text-2xl flex items-center justify-center border border-[#E2DDD5]">
                    🛒
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE]">
                    DIRECT PROCUREMENT
                  </span>
                </div>

                <h3 class="text-2xl font-bold text-[#1C1917] mb-2">Buyer Procurement Hub</h3>
                <p class="text-xs text-[#78716C] leading-relaxed mb-6">
                  Designed for paver manufacturers, modular precast factories, and sustainable developers sourcing bulk secondary construction materials with zero middleman markup.
                </p>

                <div class="space-y-2.5 text-xs text-[#1C1917]">
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#2563EB] font-bold">✓</span>
                    <span>Geodesic Haversine Radial Distance Matching (5km - 50km)</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <span class="text-[#2563EB] font-bold">✓</span>
                    <span>Send direct pickup or delivery dispatch requests in 1-click</span>
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

              <div class="mt-8 pt-6 border-t border-[#E5DFD7]">
                <a routerLink="/auth/login" class="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5">
                  Sign In as Buyer (Anita Desai) →
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- SECTION 5: LIVE CIRCULAR MARKETPLACE CATALOG -->
        <section id="marketplace">
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 class="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight">Active Circular Catalog</h2>
                <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Direct peer-to-peer exchange between active jobsites and certified recycling depots.</p>
              </div>

              <a routerLink="/marketplace" class="px-4 py-2 rounded-2xl bg-[#F6F3EF] hover:bg-[#EDE7DF] border border-[#E2DDD5] text-xs font-bold text-[#1C1917] flex items-center gap-2 transition-colors self-start sm:self-auto">
                <span>Open Geospatial Leaflet Map</span>
                <span>→</span>
              </a>
            </div>

            <!-- Material Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <!-- Lot 1 -->
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

              <!-- Lot 2 -->
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

              <!-- Lot 3 -->
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

        <!-- SECTION 6: HAVERSINE RADIAL DISTANCE CALCULATOR -->
        <section id="calculator">
          <div class="bg-white rounded-[28px] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E5DFD7] space-y-8">
            <div class="max-w-2xl">
              <div class="text-xs font-mono text-[#78716C] uppercase font-bold mb-1">Geospatial Radial Routing</div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Haversine Distance & Carbon Calculator</h2>
              <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Select a procurement radius to estimate local material tonnage and diesel fuel avoidance.</p>
            </div>

            <!-- Radius Pills -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                *ngFor="let radius of [5, 10, 20, 50]"
                (click)="selectedRadius = radius"
                [ngClass]="selectedRadius === radius ? 'bg-[#1C1917] text-white font-bold shadow-md' : 'bg-[#F6F3EF] text-[#78716C] hover:text-[#1C1917] border border-[#E2DDD5]'"
                class="p-4 rounded-2xl text-center transition-all cursor-pointer"
              >
                <div class="text-2xl font-mono font-black">{{ radius }} km</div>
                <div class="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-80">Transit Radius</div>
              </button>
            </div>

            <!-- Calculated Metrics Strip -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div>
                <div class="text-[10px] font-mono text-[#78716C] uppercase font-bold">Available Secondary Lots</div>
                <div class="text-3xl font-mono font-black text-[#1C1917] mt-1">{{ getTonnageForRadius(selectedRadius) }} Tons</div>
                <div class="text-[11px] text-[#16A34A] font-semibold mt-0.5">Ready for immediate pickup</div>
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

      </div>

      <!-- FOOTER -->
      <footer class="mt-16 py-12 px-6 border-t border-[#E2DBD1] bg-[#E7E1D8] text-xs text-[#78716C]">
        <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="font-black text-sm text-[#1C1917]">✱ REBUILD</span>
            <span>• Circular Construction Intelligence OS</span>
          </div>

          <div class="flex items-center gap-6 font-mono text-[11px]">
            <a routerLink="/auth/login" class="hover:text-[#1C1917] transition-colors">Sign In</a>
            <a routerLink="/dashboard" class="hover:text-[#1C1917] transition-colors">Workspace</a>
            <a routerLink="/marketplace" class="hover:text-[#1C1917] transition-colors">Marketplace</a>
            <a routerLink="/impact" class="hover:text-[#1C1917] transition-colors">ESG Reports</a>
          </div>

          <div class="text-[11px] font-mono">
            © 2026 ReBuild Technologies Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent implements OnInit {
  searchQuery: string = '';
  selectedRadius: number = 10;

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
  activeSection: string = 'hero';

  ngOnInit() {}

  scrollToSection(id: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeSection = id;
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for sticky 80px navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const sections = ['hero', 'funnel', 'ai-scanner', 'ecosystem', 'marketplace', 'calculator'];
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
