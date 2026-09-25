import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide">
      <span *ngIf="showDot" [ngClass]="dotClass" class="w-1.5 h-1.5 rounded-full animate-pulse"></span>
      {{ label }}
    </span>
  `
})
export class BadgeComponent {
  @Input() label: string = '';
  @Input() variant: 'green' | 'amber' | 'red' | 'blue' | 'demo' | 'slate' = 'slate';
  @Input() showDot: boolean = false;

  get badgeClass(): string {
    switch (this.variant) {
      case 'green':
        return 'bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7] font-semibold';
      case 'amber':
        return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-semibold';
      case 'red':
        return 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] font-semibold';
      case 'blue':
        return 'bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE] font-semibold';
      case 'demo':
        return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] uppercase text-[10px] font-bold tracking-widest';
      default:
        return 'bg-[#F6F3EF] text-[#78716C] border border-[#E2DDD5] font-semibold';
    }
  }

  get dotClass(): string {
    switch (this.variant) {
      case 'green': return 'bg-[#16A34A]';
      case 'amber': case 'demo': return 'bg-[#D97706]';
      case 'red': return 'bg-[#DC2626]';
      case 'blue': return 'bg-[#2563EB]';
      default: return 'bg-[#78716C]';
    }
  }
}
