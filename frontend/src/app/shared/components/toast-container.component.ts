import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <div
        *ngFor="let toast of toastService.toasts()"
        [ngClass]="getToastBg(toast.type)"
        class="pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all duration-300 transform translate-y-0"
      >
        <div [ngClass]="getIconColor(toast.type)" class="mt-0.5 flex-shrink-0">
          <!-- Success icon -->
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Error icon -->
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <!-- Warning icon -->
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <!-- Info icon -->
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-slate-100 leading-tight">{{ toast.title }}</h4>
          <p *ngIf="toast.message" class="text-xs text-slate-400 mt-1 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button
          (click)="toastService.dismiss(toast.id)"
          class="text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}

  getToastBg(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-[#0F172A]/90 border-emerald-500/30 shadow-emerald-500/10';
      case 'error':
        return 'bg-[#0F172A]/90 border-rose-500/30 shadow-rose-500/10';
      case 'warning':
        return 'bg-[#0F172A]/90 border-amber-500/30 shadow-amber-500/10';
      default:
        return 'bg-[#0F172A]/90 border-sky-500/30 shadow-sky-500/10';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-rose-400';
      case 'warning': return 'text-amber-400';
      default: return 'text-sky-400';
    }
  }
}
