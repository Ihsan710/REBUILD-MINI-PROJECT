import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { WasteService } from '../../core/services/waste.service';
import { ProjectService } from '../../core/services/project.service';
import { ImpactService } from '../../core/services/impact.service';
import { AuthService } from '../../core/services/auth.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  template: `
    <div class="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 space-y-3.5 sm:space-y-4 animate-fade-in">
      <!-- LUXURY EXECUTIVE COMMAND HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DBD1]/80">
        <div>
          <div class="flex items-center gap-2 text-[10px] font-mono text-[#16A34A] font-bold tracking-wider mb-0.5">
            <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shadow-sm shadow-emerald-500/50"></span>
            ENTERPRISE LIVE TELEMETRY • CLOUD SQL ENGINE
          </div>
          <div class="flex items-baseline gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              Good morning, {{ userName }}
            </h1>
            <span class="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">
              ✓ ALL SITES SYNCHRONIZED
            </span>
          </div>
          <p class="text-xs text-[#78716C] mt-0.5">
            Circular Construction Intelligence & Pan-India Material Recovery Console
          </p>
        </div>

        <!-- QUICK ACTIONS STRIP (LUXURY FINISH) -->
        <div class="flex flex-wrap items-center gap-2">
          <a routerLink="/waste" class="rb-btn-primary text-xs py-1.5 px-3 shadow-sm hover:shadow transition-all group">
            <svg class="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            AI Scanner
          </a>

          <a routerLink="/waste" class="rb-btn-secondary text-xs py-1.5 px-2.5 shadow-xs">
            <svg class="w-3.5 h-3.5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Log Waste
          </a>

          <a routerLink="/marketplace" class="rb-btn-secondary text-xs py-1.5 px-2.5 shadow-xs">
            <svg class="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Marketplace
          </a>

          <a routerLink="/impact" class="rb-btn-secondary text-xs py-1.5 px-2.5 shadow-xs">
            <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Impact
          </a>
        </div>
      </div>

      <!-- PRIMARY KPI STRIP (DYNAMIC CALCULATED FROM REAL RECORDS) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <app-stat-card
          label="TOTAL WASTE"
          [value]="wasteService.totalWasteLoggedKg() | number"
          unit="kg"
          subtitle="All active sites"
          variant="slate"
        ></app-stat-card>

        <app-stat-card
          label="REUSED"
          [value]="wasteService.totalReusedKg() | number"
          unit="kg"
          subtitle="Direct site reuse"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="RECYCLED"
          [value]="wasteService.totalRecycledKg() | number"
          unit="kg"
          subtitle="Processed aggregates"
          variant="blue"
        ></app-stat-card>

        <app-stat-card
          label="LANDFILLED"
          [value]="wasteService.totalLandfilledKg() | number"
          unit="kg"
          subtitle="Residual unrecoverable"
          variant="rose"
        ></app-stat-card>

        <app-stat-card
          label="DIVERSION RATE"
          [value]="wasteService.diversionRate()"
          unit="%"
          subtitle="Target: >65%"
          trend="Real-time calc"
          [trendPositive]="wasteService.diversionRate() >= 65"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="CO₂ AVOIDED"
          [value]="impactService.co2AvoidedKg() | number"
          unit="kg"
          subtitle="Embodied offset"
          trend="Live offset"
          [trendPositive]="true"
          variant="amber"
        ></app-stat-card>
      </div>

      <!-- ROW 1 OF CHARTS: Waste Trend & Material Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        <!-- Waste Trend Chart (2 Cols) -->
        <div class="lg:col-span-2 rb-card p-3.5 sm:p-4 flex flex-col justify-between shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xs sm:text-sm font-bold text-[#1C1917]">Waste & Material Diversion Trend</h3>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Live Logs</span>
              </div>
              <p class="text-[11px] text-[#78716C]">Weekly volume of diverted materials vs landfill baseline</p>
            </div>
            <div class="flex items-center gap-3 text-[11px] font-mono text-[#78716C]">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#16A34A]"></span> Diverted</span>
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Landfill</span>
            </div>
          </div>

          <div class="relative h-44 sm:h-48 w-full">
            <canvas #trendChartCanvas></canvas>
          </div>
        </div>

        <!-- Material Breakdown Doughnut (1 Col) -->
        <div class="rb-card p-3.5 sm:p-4 flex flex-col justify-between shadow-sm">
          <div class="flex items-center justify-between mb-1">
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-[#1C1917]">Material Composition</h3>
              <p class="text-[11px] text-[#78716C]">Live weight classification share</p>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">Live SQL</span>
          </div>

          <div class="relative h-32 sm:h-36 w-full my-auto flex items-center justify-center">
            <canvas #breakdownChartCanvas></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span class="text-[9px] font-mono text-[#78716C] uppercase tracking-wider font-semibold">Tonnage</span>
              <span class="text-base font-black text-[#1C1917] font-mono leading-tight">
                {{ (wasteService.totalWasteLoggedKg() / 1000).toFixed(1) }}t
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E5DFD7] text-[10px] font-mono">
            <div *ngFor="let item of impactService.materialBreakdown().slice(0, 4)" class="flex items-center justify-between text-[#1C1917]">
              <span class="flex items-center gap-1.5 truncate">
                <span class="w-2 h-2 rounded-full flex-shrink-0" [style.backgroundColor]="item.color"></span>
                <span class="truncate">{{ item.material }}</span>
              </span>
              <span class="text-[#78716C] font-bold ml-1">{{ item.percentage }}%</span>
            </div>
            <div *ngIf="impactService.materialBreakdown().length === 0" class="col-span-2 text-center text-[#78716C] text-[10px] py-0.5">
              No waste logged yet.
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2 OF CHARTS: Reuse vs Landfill & Project Performance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <!-- Reuse vs Landfill Comparison Bar Chart -->
        <div class="rb-card p-3.5 sm:p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-[#1C1917]">Reuse vs Landfill Ratio</h3>
              <p class="text-[11px] text-[#78716C]">Circular economy conversion across material types</p>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE]">Real-Time</span>
          </div>
          <div class="relative h-40 sm:h-44 w-full">
            <canvas #reuseLandfillChartCanvas></canvas>
          </div>
        </div>

        <!-- Project Performance Diversion Rates -->
        <div class="rb-card p-3.5 sm:p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-xs sm:text-sm font-bold text-[#1C1917]">Site Diversion Benchmarks</h3>
              <p class="text-[11px] text-[#78716C]">Comparative diversion compliance by active project</p>
            </div>
            <a routerLink="/projects" class="text-xs text-[#16A34A] font-semibold hover:underline">View All →</a>
          </div>
          <div class="relative h-40 sm:h-44 w-full">
            <canvas #projectPerformanceChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- RECENT WASTE LOGS & ACTIONS QUICK TABLE -->
      <div class="rb-card p-3.5 sm:p-4 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-bold text-[#1C1917]">Recent AI Classified Waste Records</h3>
            <p class="text-xs text-[#78716C] mt-0.5">Latest material stream logs from database</p>
          </div>
          <a routerLink="/waste" class="rb-btn-ghost text-xs">View Full Waste Manifest →</a>
        </div>

        <!-- Empty State if 0 records -->
        <div *ngIf="wasteService.records().length === 0" class="py-12 text-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-[#EBF7EE] text-[#16A34A] flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h4 class="text-sm font-bold text-[#1C1917]">No waste records logged yet</h4>
          <p class="text-xs text-[#78716C] max-w-sm mx-auto">Upload construction rubble or demolition photos using the AI Material Classifier to begin tracking circular diversion metrics.</p>
          <a routerLink="/waste" class="rb-btn-primary text-xs inline-flex mt-2">
            + Log First Waste Record
          </a>
        </div>

        <!-- Table if records exist -->
        <div *ngIf="wasteService.records().length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-[#E5DFD7] text-[#78716C] font-mono uppercase text-[10px]">
                <th class="pb-3 font-semibold">Material</th>
                <th class="pb-3 font-semibold">Project</th>
                <th class="pb-3 font-semibold">Quantity</th>
                <th class="pb-3 font-semibold">Condition</th>
                <th class="pb-3 font-semibold">AI Detection</th>
                <th class="pb-3 font-semibold">Confidence</th>
                <th class="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5DFD7]">
              <tr *ngFor="let record of wasteService.records().slice(0, 5)" class="hover:bg-[#F9F7F4] transition-colors">
                <td class="py-3 font-semibold text-[#1C1917] flex items-center gap-2.5">
                  <img [src]="resolveImageUrl(record.imageUrl, record.material)" (error)="onImgError($event, record.material)" [alt]="record.material" class="w-8 h-8 rounded-lg object-cover border border-[#E5DFD7]" />
                  <span>{{ record.material }}</span>
                </td>
                <td class="py-3 text-[#1C1917]">{{ record.projectName }}</td>
                <td class="py-3 font-mono text-[#1C1917] font-bold">{{ record.quantityKg | number }} kg</td>
                <td class="py-3">
                  <span [ngClass]="record.condition === 'Reusable' ? 'badge-green' : (record.condition === 'Recyclable' ? 'badge-blue' : 'badge-red')">
                    {{ record.condition }}
                  </span>
                </td>
                <td class="py-3 text-[#78716C] font-mono">{{ record.aiPrediction.detectedMaterial }}</td>
                <td class="py-3 font-mono font-bold text-[#16A34A]">{{ record.aiPrediction.confidence }}%</td>
                <td class="py-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F3EF] text-[#78716C] border border-[#E2DDD5]">
                    {{ record.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('trendChartCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('breakdownChartCanvas') breakdownCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reuseLandfillChartCanvas') reuseLandfillCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectPerformanceChartCanvas') projectCanvas!: ElementRef<HTMLCanvasElement>;

  userName: string = 'Contractor';
  charts: Chart[] = [];

  constructor(
    public wasteService: WasteService,
    public projectService: ProjectService,
    public impactService: ImpactService,
    private authService: AuthService
  ) {
    effect(() => {
      // Auto refresh all charts whenever live database records or projects change
      this.wasteService.records();
      this.impactService.materialBreakdown();
      this.projectService.projects();
      this.refreshAllCharts();
    });
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user?.name) {
      this.userName = user.name.split(' ')[0];
    }
  }

  ngAfterViewInit() {
    this.initTrendChart();
    this.initBreakdownChart();
    this.initReuseLandfillChart();
    this.initProjectPerformanceChart();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  private getTrendData() {
    const records = [...this.wasteService.records()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (records.length === 0) {
      return {
        labels: ['Baseline', 'Live Total'],
        diverted: [0, 0],
        landfilled: [0, 0]
      };
    }

    const labels: string[] = ['Start'];
    const diverted: number[] = [0];
    const landfilled: number[] = [0];

    let cumDiv = 0;
    let cumLand = 0;

    records.forEach((r, idx) => {
      if (r.condition === 'Reusable' || r.condition === 'Recyclable') {
        cumDiv += r.quantityKg;
      } else {
        cumLand += r.quantityKg;
      }
      const d = new Date(r.createdAt);
      const label = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : `Entry #${idx + 1}`;
      labels.push(label);
      diverted.push(cumDiv);
      landfilled.push(cumLand);
    });

    return { labels, diverted, landfilled };
  }

  private getReuseLandfillData() {
    const records = this.wasteService.records();
    const map = new Map<string, { diverted: number; landfilled: number }>();

    records.forEach(r => {
      const mat = r.material;
      if (!map.has(mat)) {
        map.set(mat, { diverted: 0, landfilled: 0 });
      }
      const entry = map.get(mat)!;
      if (r.condition === 'Reusable' || r.condition === 'Recyclable') {
        entry.diverted += r.quantityKg;
      } else {
        entry.landfilled += r.quantityKg;
      }
    });

    const labels = map.size > 0 ? Array.from(map.keys()) : ['Concrete', 'Brick', 'Metal', 'Wood'];
    const diverted = labels.map(l => map.get(l)?.diverted || 0);
    const landfilled = labels.map(l => map.get(l)?.landfilled || 0);

    return { labels, diverted, landfilled };
  }

  private refreshAllCharts() {
    if (this.charts.length < 4) return;

    // 1. Trend Chart
    const trend = this.getTrendData();
    if (this.charts[0]) {
      this.charts[0].data.labels = trend.labels;
      this.charts[0].data.datasets[0].data = trend.diverted;
      this.charts[0].data.datasets[1].data = trend.landfilled;
      this.charts[0].update();
    }

    // 2. Breakdown Chart
    const breakdown = this.impactService.materialBreakdown();
    if (this.charts[1]) {
      this.charts[1].data.labels = breakdown.length > 0 ? breakdown.map(b => b.material) : ['No Data Logged'];
      this.charts[1].data.datasets[0].data = breakdown.length > 0 ? breakdown.map(b => b.percentage) : [100];
      (this.charts[1].data.datasets[0] as any).backgroundColor = breakdown.length > 0 ? breakdown.map(b => b.color) : ['#E2DDD5'];
      this.charts[1].update();
    }

    // 3. Reuse vs Landfill Chart
    const reuse = this.getReuseLandfillData();
    if (this.charts[2]) {
      this.charts[2].data.labels = reuse.labels;
      this.charts[2].data.datasets[0].data = reuse.diverted;
      this.charts[2].data.datasets[1].data = reuse.landfilled;
      this.charts[2].update();
    }

    // 4. Project Performance
    const projects = this.projectService.projects();
    if (this.charts[3]) {
      this.charts[3].data.labels = projects.length > 0 ? projects.map(p => p.name.slice(0, 16) + '...') : ['No Projects'];
      this.charts[3].data.datasets[0].data = projects.length > 0 ? projects.map(p => p.diversionRate) : [100];
      this.charts[3].update();
    }
  }

  private initTrendChart() {
    if (!this.trendCanvas) return;
    const ctx = this.trendCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const trend = this.getTrendData();

    // Executive luminous emerald gradient
    const emeraldGrad = ctx.createLinearGradient(0, 0, 0, 180);
    emeraldGrad.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
    emeraldGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.04)');
    emeraldGrad.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: trend.labels,
        datasets: [
          {
            label: 'Diverted',
            data: trend.diverted,
            borderColor: '#059669',
            backgroundColor: emeraldGrad,
            borderWidth: 2.2,
            tension: 0.38,
            fill: true,
            pointBackgroundColor: '#059669',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
            pointRadius: trend.labels.length > 10 ? 0 : 3,
            pointHoverRadius: 5
          },
          {
            label: 'Landfilled',
            data: trend.landfilled,
            borderColor: '#EF4444',
            backgroundColor: 'transparent',
            borderWidth: 1.8,
            borderDash: [4, 4],
            tension: 0.38,
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
            pointRadius: trend.labels.length > 10 ? 0 : 2.5,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 8,
            cornerRadius: 7,
            usePointStyle: true,
            boxPadding: 4,
            callbacks: {
              label: (c: any) => ` ${c.dataset.label}: ${Number(c.parsed.y).toLocaleString()} kg`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#94A3B8',
              font: { family: 'Inter', size: 9 },
              maxRotation: 0
            }
          },
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            border: { dash: [3, 3] },
            ticks: {
              color: '#94A3B8',
              font: { family: 'JetBrains Mono', size: 9 },
              callback: (val: any) => {
                const n = Number(val);
                return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
              }
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private initBreakdownChart() {
    if (!this.breakdownCanvas) return;
    const ctx = this.breakdownCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const breakdown = this.impactService.materialBreakdown();
    const labels = breakdown.length > 0 ? breakdown.map(b => b.material) : ['No Data Logged'];
    const data = breakdown.length > 0 ? breakdown.map(b => b.percentage) : [100];
    const colors = breakdown.length > 0 ? breakdown.map(b => b.color) : ['#E2DDD5'];

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: '#FFFFFF',
          borderWidth: 2.5,
          hoverOffset: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '74%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 8,
            cornerRadius: 7,
            boxPadding: 4,
            callbacks: {
              label: (c: any) => ` ${c.label}: ${c.parsed}%`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private initReuseLandfillChart() {
    if (!this.reuseLandfillCanvas) return;
    const ctx = this.reuseLandfillCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const reuse = this.getReuseLandfillData();

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: reuse.labels,
        datasets: [
          {
            label: 'Diverted',
            data: reuse.diverted,
            backgroundColor: '#059669',
            borderRadius: 4,
            maxBarThickness: 26
          },
          {
            label: 'Landfilled',
            data: reuse.landfilled,
            backgroundColor: '#F87171',
            borderRadius: 4,
            maxBarThickness: 26
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#64748B',
              font: { family: 'Inter', size: 10, weight: 500 },
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 8,
            cornerRadius: 7,
            callbacks: {
              label: (c: any) => ` ${c.dataset.label}: ${Number(c.parsed.y).toLocaleString()} kg`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#94A3B8', font: { family: 'Inter', size: 9 } }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            border: { dash: [3, 3] },
            ticks: {
              color: '#94A3B8',
              font: { family: 'JetBrains Mono', size: 9 },
              callback: (val: any) => {
                const n = Number(val);
                return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
              }
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private initProjectPerformanceChart() {
    if (!this.projectCanvas) return;
    const ctx = this.projectCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const projects = this.projectService.projects();
    const labels = projects.length > 0 ? projects.map(p => p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name) : ['No Projects'];
    const data = projects.length > 0 ? projects.map(p => p.diversionRate) : [100];

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Diversion Rate (%)',
          data,
          backgroundColor: '#10B981',
          borderRadius: 4,
          maxBarThickness: 16
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            titleColor: '#F8FAFC',
            bodyColor: '#94A3B8',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            padding: 8,
            cornerRadius: 7,
            callbacks: {
              label: (c: any) => ` Diversion Rate: ${c.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            border: { dash: [3, 3] },
            ticks: {
              color: '#94A3B8',
              font: { family: 'JetBrains Mono', size: 9 },
              callback: (val: any) => `${val}%`
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#1E293B',
              font: { family: 'Inter', size: 10, weight: 500 }
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  resolveImageUrl(url?: string, material?: string): string {
    const mat = (material || 'brick').toLowerCase();
    if (!url) return `/assets/materials/${mat}.jpg`;
    if (url.startsWith('/assets/uploads/')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  }

  onImgError(event: any, material?: string) {
    const mat = (material || 'brick').toLowerCase();
    const target = event.target as HTMLImageElement;
    const fallback = `/assets/materials/${mat}.jpg`;
    if (target.src !== fallback && !target.src.endsWith(fallback)) {
      target.src = fallback;
    }
  }
}
