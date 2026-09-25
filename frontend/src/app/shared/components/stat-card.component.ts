import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rb-card p-5 sm:p-6 relative overflow-hidden group hover:border-[#C5B7A5] transition-all duration-200">
      <!-- Subtle top accent line -->
      <div [ngClass]="accentColorClass" class="absolute top-0 left-0 right-0 h-[3px] opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="flex items-start justify-between gap-2 mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-[#78716C]">{{ label }}</span>
          <span *ngIf="isDemoData" class="badge-demo">DEMO DATA</span>
        </div>
        <div *ngIf="badgeText" [ngClass]="badgeClass" class="text-[11px] font-semibold px-2 py-0.5 rounded-full border">
          {{ badgeText }}
        </div>
      </div>

      <div class="flex items-baseline gap-2 mb-1.5">
        <span class="text-3xl lg:text-4xl font-black tracking-tight text-[#1C1917] font-mono">{{ value }}</span>
        <span *ngIf="unit" class="text-xs font-semibold text-[#78716C]">{{ unit }}</span>
      </div>

      <div class="flex items-center justify-between text-xs text-[#78716C] mt-2">
        <span *ngIf="subtitle" class="leading-normal">{{ subtitle }}</span>
        <div *ngIf="trend" [ngClass]="trendPositive ? 'bg-[#EBF7EE] text-[#1E7E34]' : 'bg-[#FEF3C7] text-[#B45309]'" class="flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ml-auto">
          <span>{{ trendPositive ? '↑' : '↓' }}</span>
          <span>{{ trend }}</span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number | null | undefined = '';
  @Input() unit?: string;
  @Input() subtitle?: string;
  @Input() trend?: string;
  @Input() trendPositive: boolean = true;
  @Input() isDemoData: boolean = false;
  @Input() badgeText?: string;
  @Input() variant: 'emerald' | 'amber' | 'blue' | 'rose' | 'slate' | 'purple' | 'sky' = 'emerald';

  get accentColorClass(): string {
    switch (this.variant) {
      case 'emerald': return 'bg-[#16A34A]';
      case 'amber': return 'bg-[#D97706]';
      case 'blue': case 'sky': return 'bg-[#2563EB]';
      case 'rose': return 'bg-[#DC2626]';
      case 'purple': return 'bg-[#7C3AED]';
      default: return 'bg-[#78716C]';
    }
  }

  get badgeClass(): string {
    switch (this.variant) {
      case 'emerald': return 'bg-[#EBF7EE] text-[#1E7E34] border-[#DCFCE7]';
      case 'amber': return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'blue': case 'sky': return 'bg-[#EBF3FA] text-[#2563EB] border-[#DBEAFE]';
      case 'rose': return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';
      case 'purple': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      default: return 'bg-[#F6F3EF] text-[#78716C] border-[#E2DDD5]';
    }
  }
}
