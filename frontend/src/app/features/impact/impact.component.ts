import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ImpactService } from '../../core/services/impact.service';
import { WasteService } from '../../core/services/waste.service';
import { ProjectService } from '../../core/services/project.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge.component';

Chart.register(...registerables);

@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            ESG CIRCULAR PERFORMANCE AUDIT
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Environmental Impact</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Quantified landfill avoidance, embodied carbon telemetry, and circular sustainability score.</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Active ESG Metric</span>
        </div>
      </div>

      <!-- ROW 1: CIRCULAR SCORE VISUALIZATION & HIGH-IMPACT METRICS -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- SUSTAINABILITY SCORE CIRCULAR DIAL (4 Cols) -->
        <div class="lg:col-span-4 rb-card p-6 flex flex-col items-center justify-between text-center relative overflow-hidden bg-white border border-[#E5DFD7]">
          <div class="w-full flex items-center justify-between mb-2">
            <span class="text-xs font-mono font-bold uppercase text-[#78716C]">SUSTAINABILITY SCORE</span>
            <span class="badge-green">Circular Index</span>
          </div>

          <!-- Circular SVG Radial Progress Gauge -->
          <div class="relative w-48 h-48 my-4 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background track -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#E5DFD7"
                stroke-width="8"
                fill="transparent"
              />
              <!-- Dynamic value track -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#16A34A"
                stroke-width="8"
                stroke-linecap="round"
                fill="transparent"
                [attr.stroke-dasharray]="251.2"
                [attr.stroke-dashoffset]="251.2 - (251.2 * impactService.sustainabilityScore() / 100)"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-black text-[#1C1917] font-mono tracking-tight">{{ impactService.sustainabilityScore() }}</span>
              <span class="text-[10px] font-mono text-[#78716C] uppercase">OUT OF 100</span>
            </div>
          </div>

          <div class="text-xs text-[#78716C] border-t border-[#E5DFD7] pt-3 w-full">
            Top 5% circular compliance across regional commercial sites
          </div>
        </div>

        <!-- HIGH LEVEL IMPACT METRICS (8 Cols) -->
        <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rb-card p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between text-xs font-mono text-[#78716C] mb-2">
              <span>EMBODIED CARBON OFFSET</span>
              <span class="badge-green">GHG Scope 3</span>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-black text-[#1C1917] font-mono">
                {{ impactService.co2AvoidedKg() | number }}
                <span class="text-sm font-sans font-bold text-[#78716C]">kg CO₂e</span>
              </div>
              <p class="text-xs text-[#78716C] mt-1">Calculated via certified DEFRA / C&D circular offset factors</p>
            </div>
            <div class="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-mono text-[#78716C]">
              <span>Equivalent To</span>
              <span class="text-[#1E7E34] font-bold">{{ impactService.treesEquivalent() | number }} mature trees / yr</span>
            </div>
          </div>

          <div class="rb-card p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between text-xs font-mono text-[#78716C] mb-2">
              <span>LANDFILL AIRSPACE CONSERVED</span>
              <span class="badge-blue">Volume</span>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-black text-[#1C1917] font-mono">
                {{ impactService.landfillAvoidedM3() | number }}
                <span class="text-sm font-sans font-bold text-[#78716C]">m³</span>
              </div>
              <p class="text-xs text-[#78716C] mt-1">Municipal landfill volume preserved through site separation</p>
            </div>
            <div class="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-mono text-[#78716C]">
              <span>Density Baseline</span>
              <span class="text-[#1C1917] font-bold">1,250 kg / m³</span>
            </div>
          </div>

          <div class="rb-card p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between text-xs font-mono text-[#78716C] mb-2">
              <span>TOTAL DIVERTED MATERIAL</span>
              <span class="badge-green">Circular</span>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-black text-[#1C1917] font-mono">
                {{ impactService.totalDivertedKg() | number }}
                <span class="text-sm font-sans font-bold text-[#78716C]">kg</span>
              </div>
              <p class="text-xs text-[#78716C] mt-1">Combined reusable and recyclable material retained on-site</p>
            </div>
            <div class="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-mono text-[#78716C]">
              <span>Diversion Compliance</span>
              <span class="text-[#1E7E34] font-bold">{{ impactService.diversionRate() }}%</span>
            </div>
          </div>

          <div class="rb-card p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between text-xs font-mono text-[#78716C] mb-2">
              <span>RESIDUAL LANDFILL STREAM</span>
              <span class="badge-red">Unrecoverable</span>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-black text-[#1C1917] font-mono">
                {{ impactService.totalLandfilledKg() | number }}
                <span class="text-sm font-sans font-bold text-[#78716C]">kg</span>
              </div>
              <p class="text-xs text-[#78716C] mt-1">Target is less than 35% of total gross generated volume</p>
            </div>
            <div class="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-mono text-[#78716C]">
              <span>Status</span>
              <span [ngClass]="impactService.diversionRate() >= 65 ? 'text-[#1E7E34]' : 'text-rose-600'" class="font-bold">
                {{ impactService.diversionRate() >= 65 ? 'Compliant with C&D Rules 2016' : 'Requires Remediation' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2: CHARTS (Waste Composition & Landfill Reduction) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Waste Composition Doughnut -->
        <div class="rb-card p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-[#1C1917]">Diverted Material Breakdown</h3>
              <p class="text-xs text-[#78716C] mt-0.5">Distribution of salvaged materials by weight classification</p>
            </div>
          </div>
          <div class="relative h-64 w-full">
            <canvas #compositionCanvas></canvas>
          </div>
        </div>

        <!-- Monthly Landfill Reduction Trend -->
        <div class="rb-card p-6 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-[#1C1917]">Monthly Landfill Reduction</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Live Audit</span>
              </div>
              <p class="text-xs text-[#78716C] mt-0.5">Progressive reduction in landfill volume per phase</p>
            </div>
          </div>
          <div class="relative h-64 w-full">
            <canvas #landfillReductionCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- EQUIVALENCY IMPACT HIGHLIGHT CARD -->
      <div class="rb-card p-6 bg-white border border-[#E5DFD7]">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono uppercase font-bold text-[#16A34A]">CERTIFIED ESG IMPACT EQUIVALENCIES</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Verified Emission Factor</span>
            </div>
            <h3 class="text-xl font-bold text-[#1C1917]">Tangible Circular Economy Benefits</h3>
            <p class="text-xs text-[#78716C] mt-1 max-w-xl">
              By reusing structural masonry and crushing concrete aggregates on-site, your operations prevented substantial greenhouse emissions and municipal landfill haulage costs.
            </p>
          </div>

          <div class="flex items-center gap-6 text-center font-mono">
            <div class="p-3.5 rounded-2xl bg-[#EBF7EE] border border-[#DCFCE7]">
              <div class="text-2xl font-black text-[#1E7E34]">{{ impactService.treesEquivalent() | number }}</div>
              <div class="text-[10px] text-[#1E7E34] uppercase mt-0.5 font-bold">Trees Planted Eq</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-[#F6F3EF] border border-[#E2DDD5]">
              <div class="text-2xl font-black text-[#1C1917]">₹{{ impactService.tippingFeeSavedRupees() | number }}</div>
              <div class="text-[10px] text-[#78716C] uppercase mt-0.5 font-bold">Tipping Fee Saved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImpactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('compositionCanvas') compositionCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('landfillReductionCanvas') landfillReductionCanvas!: ElementRef<HTMLCanvasElement>;

  charts: Chart[] = [];

  constructor(
    public impactService: ImpactService,
    public wasteService: WasteService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCompositionChart();
    this.initLandfillReductionChart();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  private initCompositionChart() {
    if (!this.compositionCanvas) return;
    const ctx = this.compositionCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const breakdown = this.impactService.materialBreakdown();
    const labels = breakdown.map(b => b.material);
    const data = breakdown.map(b => b.weightKg);
    const colors = breakdown.map(b => b.color);

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: '#FFFFFF',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#78716C', font: { family: 'Inter', size: 11 }, boxWidth: 12 }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private initLandfillReductionChart() {
    if (!this.landfillReductionCanvas) return;
    const ctx = this.landfillReductionCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const records = this.wasteService.records();
    const monthMap = new Map<string, { avoided: number; landfilled: number }>();

    if (records.length === 0) {
      monthMap.set('Current Month', { avoided: 0, landfilled: 0 });
    } else {
      records.forEach(r => {
        const d = new Date(r.createdAt);
        const monthKey = !isNaN(d.getTime())
          ? d.toLocaleDateString('en-US', { month: 'short' })
          : 'Live';
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, { avoided: 0, landfilled: 0 });
        }
        const val = monthMap.get(monthKey)!;
        if (r.condition === 'Reusable' || r.condition === 'Recyclable') {
          val.avoided += r.quantityKg;
        } else {
          val.landfilled += r.quantityKg;
        }
      });
    }

    const labels = Array.from(monthMap.keys());
    const avoidedData = labels.map(l => monthMap.get(l)!.avoided);
    const landfilledData = labels.map(l => monthMap.get(l)!.landfilled);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Landfill Avoided (kg)',
            data: avoidedData,
            backgroundColor: '#16A34A',
            borderRadius: 6
          },
          {
            label: 'Residual Landfill (kg)',
            data: landfilledData,
            backgroundColor: '#DC2626',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#78716C', font: { family: 'Inter', size: 11 }, boxWidth: 12 }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#78716C', font: { family: 'Inter', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { color: '#78716C', font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });
    this.charts.push(chart);
  }
}
