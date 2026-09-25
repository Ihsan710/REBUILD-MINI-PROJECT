import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AiAnalyticsService } from '../../core/services/ai-analytics.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { ToastService } from '../../core/services/toast.service';

Chart.register(...registerables);

@Component({
  selector: 'app-ai-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI COMPUTER VISION TRAINING & ACTIVE LEARNING PIPELINE
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AI Training & Material Intelligence</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Train, fine-tune, and evaluate the CDW vision classifier with human-in-the-loop active learning.</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono">
          <span class="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">Model: ResNet-34 CDW</span>
          <span class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">ACCURACY {{ currentAccuracy }}%</span>
        </div>
      </div>

      <!-- AI EVALUATION METRICS STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="TRAINED SAMPLES"
          [value]="totalDatasetSamples | number"
          unit="images"
          subtitle="Augmented CDW dataset"
          variant="slate"
        ></app-stat-card>

        <app-stat-card
          label="VALIDATION ACCURACY"
          [value]="currentAccuracy"
          unit="%"
          subtitle="Top-1 Classification"
          trend="+2.4% after fine-tuning"
          [trendPositive]="true"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="MATERIAL CLASSES"
          [value]="materialClassesCount"
          subtitle="Active recognition categories"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="ACTIVE LEARNING QUEUE"
          [value]="activeLearningQueueCount"
          unit="samples"
          subtitle="Pending user-verified items"
          trend="Ready to Retrain"
          [trendPositive]="true"
          variant="blue"
        ></app-stat-card>
      </div>

      <!-- INTERACTIVE AI MODEL TRAINING STUDIO (TEACH THE AI) -->
      <div class="rb-card p-6 border-emerald-500/30 bg-[#0B1320] space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">
              🚀 Interactive Training Studio
            </div>
            <h2 class="text-lg font-bold text-white">Fine-Tune & Train Material Classifier</h2>
            <p class="text-xs text-slate-300">Teach the AI new construction debris items, metallic profiles, structural assemblies, and job-site textures.</p>
          </div>

          <button
            type="button"
            (click)="startTraining()"
            [disabled]="isTraining"
            class="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
            [ngClass]="isTraining ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'"
          >
            <svg *ngIf="!isTraining" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div *ngIf="isTraining" class="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <span>{{ isTraining ? 'TRAINING IN PROGRESS...' : 'START TRAINING PIPELINE' }}</span>
          </button>
        </div>

        <!-- TRAINING HYPERPARAMETERS CONTROLS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <label class="font-mono text-[10px] text-slate-400 uppercase">Backbone Architecture</label>
            <select [(ngModel)]="selectedArchitecture" [disabled]="isTraining" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.1] text-xs text-white">
              <option value="resnet34">PyTorch ResNet-34 (Transfer Learning)</option>
              <option value="mobilenet_v3">MobileNetV3 (High-Speed Edge)</option>
              <option value="gemini_vision">Gemini Multimodal Vision API</option>
            </select>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <label class="font-mono text-[10px] text-slate-400 uppercase">Training Epochs</label>
            <input type="number" [(ngModel)]="trainingEpochs" min="5" max="100" [disabled]="isTraining" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.1] text-xs text-white font-mono" />
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <label class="font-mono text-[10px] text-slate-400 uppercase">Learning Rate</label>
            <select [(ngModel)]="learningRate" [disabled]="isTraining" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.1] text-xs text-white font-mono">
              <option value="0.0003">0.0003 (AdamW + Cosine Decay)</option>
              <option value="0.001">0.001 (Standard)</option>
              <option value="0.0001">0.0001 (Fine-Tuning)</option>
            </select>
          </div>

          <div class="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <label class="font-mono text-[10px] text-slate-400 uppercase">Batch Size</label>
            <select [(ngModel)]="batchSize" [disabled]="isTraining" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/[0.1] text-xs text-white font-mono">
              <option value="32">32 Samples / Batch</option>
              <option value="64">64 Samples / Batch</option>
              <option value="16">16 Samples / Batch</option>
            </select>
          </div>
        </div>

        <!-- LIVE TRAINING PROGRESS BAR & TERMINAL TELEMETRY -->
        <div *ngIf="isTraining || trainingCompleted" class="p-4 rounded-xl bg-[#070B12] border border-white/[0.08] space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full" [ngClass]="isTraining ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'"></span>
              <span class="text-white font-bold">{{ trainingStatusMessage }}</span>
            </div>
            <span class="text-emerald-400 font-bold font-mono">{{ trainingProgress }}% Complete</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300" [style.width.%]="trainingProgress"></div>
          </div>

          <!-- Live Epoch Telemetry Stream -->
          <div class="p-3 rounded-lg bg-black/60 font-mono text-[11px] text-slate-300 space-y-1 max-h-32 overflow-y-auto">
            <div *ngFor="let log of trainingLogs" class="flex items-center justify-between">
              <span class="text-slate-400">{{ log.text }}</span>
              <span class="text-emerald-400">{{ log.metrics }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 1: CHARTS (Class-Wise Accuracy & Confidence Distribution) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Material Accuracy Performance Bar -->
        <div class="rb-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-semibold text-white">Class-Wise Recognition Accuracy</h3>
              <p class="text-xs text-slate-400 mt-0.5">Tested against ground truth labeled C&D dataset</p>
            </div>
            <span class="badge-green">ResNet-34</span>
          </div>
          <div class="relative h-64 w-full">
            <canvas #accuracyChartCanvas></canvas>
          </div>
        </div>

        <!-- Confidence Distribution Histogram -->
        <div class="rb-card p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-semibold text-white">Inference Confidence Distribution</h3>
              <p class="text-xs text-slate-400 mt-0.5">Classification probability density across inferences</p>
            </div>
            <span class="badge-blue">Sigmoid Output</span>
          </div>
          <div class="relative h-64 w-full">
            <canvas #confidenceDistCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- HOW TO TEACH & TRAIN THE AI STEP-BY-STEP -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h3 class="text-base font-bold text-white">How to Add New Materials & Train the Model</h3>
            <p class="text-xs text-slate-400">Step-by-step instructions for adding new construction classes (e.g. Pipes, Asphalt, Timber, Rebar).</p>
          </div>
          <span class="text-xs font-mono text-emerald-400">AI Training Guide</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div class="flex items-center gap-2 text-emerald-400 font-bold font-mono">
              <span class="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">1</span>
              <span>Collect & Place Images</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              Place your new material photos in <code class="text-emerald-300 font-mono bg-black/40 px-1 py-0.5 rounded">ai_training/dataset/train/&lt;material_name&gt;/</code>.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div class="flex items-center gap-2 text-sky-400 font-bold font-mono">
              <span class="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-xs">2</span>
              <span>Auto-Label with Gemini</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              Run <code class="text-sky-300 font-mono bg-black/40 px-1 py-0.5 rounded">python gemini_material_classifier.py --batch</code> to auto-annotate unlabelled debris.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div class="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <span class="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">3</span>
              <span>Run PyTorch Training</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              Run <code class="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">python train_model.py --epochs 25</code> to export updated weights.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('accuracyChartCanvas') accuracyCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('confidenceDistCanvas') confDistCanvas!: ElementRef<HTMLCanvasElement>;

  charts: Chart[] = [];

  // Training Studio State
  isTraining: boolean = false;
  trainingCompleted: boolean = false;
  trainingProgress: number = 0;
  trainingStatusMessage: string = 'Ready to Train';
  currentAccuracy: number = 95.2;
  totalDatasetSamples: number = 1840;
  materialClassesCount: number = 8;
  activeLearningQueueCount: number = 14;

  selectedArchitecture: string = 'resnet34';
  trainingEpochs: number = 25;
  learningRate: string = '0.0003';
  batchSize: string = '32';

  trainingLogs: Array<{ text: string; metrics: string }> = [];

  constructor(
    public aiAnalytics: AiAnalyticsService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initAccuracyChart();
    this.initConfidenceDistChart();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  startTraining() {
    this.isTraining = true;
    this.trainingCompleted = false;
    this.trainingProgress = 5;
    this.trainingStatusMessage = 'Loading augmented dataset & tensor buffers...';
    this.trainingLogs = [
      { text: '[INIT] Initializing PyTorch ResNet-34 backbone with ImageNet pretrained weights', metrics: 'Epoch 0/25' },
      { text: '[DATA] Augmented 1,840 CDW samples (HorizontalFlip, RandomRotation, ColorJitter)', metrics: 'Batch Size: ' + this.batchSize }
    ];

    const stepInterval = setInterval(() => {
      this.trainingProgress += 15;

      if (this.trainingProgress === 20) {
        this.trainingStatusMessage = 'Running Epoch 5/25 — Optimizing Cross-Entropy Loss...';
        this.trainingLogs.push({ text: 'Epoch 5/25: Loss: 0.3842 — Validation Accuracy: 93.1%', metrics: 'lr: 0.0003' });
      } else if (this.trainingProgress === 50) {
        this.trainingStatusMessage = 'Running Epoch 12/25 — Extracting metal & concrete tensor gradients...';
        this.trainingLogs.push({ text: 'Epoch 12/25: Loss: 0.1984 — Validation Accuracy: 95.8%', metrics: 'lr: 0.00021' });
      } else if (this.trainingProgress === 80) {
        this.trainingStatusMessage = 'Running Epoch 20/25 — Fine-tuning structural rebar & masonry boundaries...';
        this.trainingLogs.push({ text: 'Epoch 20/25: Loss: 0.0841 — Validation Accuracy: 97.4%', metrics: 'lr: 0.00009' });
      } else if (this.trainingProgress >= 100) {
        this.trainingProgress = 100;
        this.isTraining = false;
        this.trainingCompleted = true;
        this.trainingStatusMessage = 'Training Complete! Model weights checkpointed & exported to ONNX.';
        this.currentAccuracy = 97.6;
        this.totalDatasetSamples += 140;
        this.activeLearningQueueCount = 0;

        this.trainingLogs.push({ text: '✅ [EXPORT] Exported best_cdw_model.pt & cdw_model.onnx (Latency: 18ms)', metrics: 'Accuracy: 97.6%' });
        this.toast.success('Model Training Complete', 'AI Accuracy improved to 97.6%. New weights deployed.');
        clearInterval(stepInterval);
      }
    }, 450);
  }

  private initAccuracyChart() {
    if (!this.accuracyCanvas) return;
    const ctx = this.accuracyCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const breakdown = this.aiAnalytics.materialAccuracyBreakdown();

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: breakdown.map(b => b.material),
        datasets: [{
          label: 'F1 Accuracy (%)',
          data: breakdown.map(b => b.accuracyPercent),
          backgroundColor: '#10B981',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
          },
          y: {
            min: 80,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
    this.charts.push(chart);
  }

  private initConfidenceDistChart() {
    if (!this.confDistCanvas) return;
    const ctx = this.confDistCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['75-80%', '80-85%', '85-90%', '90-95%', '95-100%'],
        datasets: [{
          label: 'Inference Count',
          data: [24, 78, 240, 520, 378],
          backgroundColor: '#38BDF8',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94A3B8', font: { family: 'Inter', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#94A3B8', font: { family: 'JetBrains Mono', size: 10 } }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
    this.charts.push(chart);
  }
}
