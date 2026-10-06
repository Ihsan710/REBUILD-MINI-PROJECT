import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rb-card p-3.5 sm:p-4 relative overflow-hidden group hover:border-[#C5B7A5] transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between">
      <!-- Subtle top accent line -->
      <div [ngClass]="accentColorClass" class="absolute top-0 left-0 right-0 h-[3px] opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="flex items-start justify-between gap-1.5 mb-2">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#78716C] truncate">{{ label }}</span>
          <span *ngIf="isDemoData" class="badge-demo text-[8px] px-1">DEMO</span>
        </div>
        <div *ngIf="badgeText" [ngClass]="badgeClass" class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0">
          {{ badgeText }}
        </div>
      </div>

      <div class="flex items-baseline gap-1.5 mb-1">
        <span class="text-2xl sm:text-3xl font-black tracking-tight text-[#1C1917] font-mono leading-none">{{ value }}</span>
        <span *ngIf="unit" class="text-[11px] font-bold text-[#78716C] font-mono">{{ unit }}</span>
      </div>

      <div class="flex items-center justify-between text-[11px] text-[#78716C] mt-2 pt-2 border-t border-[#E5DFD7]/60">
        <span *ngIf="subtitle" class="truncate text-[10px] text-[#78716C] leading-none">{{ subtitle }}</span>
        <div *ngIf="trend" [ngClass]="trendPositive ? 'bg-[#EBF7EE] text-[#1E7E34] border-[#DCFCE7]' : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'" class="flex items-center gap-0.5 font-bold text-[9px] font-mono px-1.5 py-0.5 rounded border ml-auto flex-shrink-0">
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
