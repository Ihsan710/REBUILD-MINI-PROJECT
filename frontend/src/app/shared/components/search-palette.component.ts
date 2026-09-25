import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  route: string;
  shortcut?: string;
  icon: string;
}

@Component({
  selector: 'app-search-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fade-in" (click)="close()">
      <div class="w-full max-w-xl bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
        <!-- Search Input -->
        <div class="flex items-center px-4 py-3.5 border-b border-slate-800">
          <svg class="w-5 h-5 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            #searchInput
            type="text"
            [(ngModel)]="query"
            placeholder="Search projects, waste logs, marketplace, equipment, or AI analytics..."
            class="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            (keydown.escape)="close()"
            (keydown.arrowdown)="selectNext()"
            (keydown.arrowup)="selectPrev()"
            (keydown.enter)="executeSelected()"
          />
          <kbd class="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">ESC</kbd>
        </div>

        <!-- Filtered Results -->
        <div class="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          <div *ngFor="let item of filteredItems; let i = index"
               (click)="navigateTo(item)"
               (mouseenter)="selectedIndex = i"
               [ngClass]="selectedIndex === i ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'"
               class="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 mb-1">
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{{ item.category }}</span>
              <span class="text-sm font-medium">{{ item.title }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span *ngIf="item.shortcut" class="text-[11px] text-slate-500 font-mono">{{ item.shortcut }}</span>
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div *ngIf="filteredItems.length === 0" class="py-8 text-center text-slate-500 text-sm">
            No matching resources or commands found for "{{ query }}"
          </div>
        </div>

        <!-- Palette Footer -->
        <div class="px-4 py-2.5 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div class="flex items-center gap-4">
            <span><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↑↓</kbd> to navigate</span>
            <span><kbd class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">↵</kbd> to select</span>
          </div>
          <span class="font-mono text-emerald-400/80">ReBuild Platform Switcher</span>
        </div>
      </div>
    </div>
  `
})
export class SearchPaletteComponent {
  @Input() isOpen: boolean = false;
  @Output() closePalette = new EventEmitter<void>();

  query: string = '';
  selectedIndex: number = 0;

  items: SearchItem[] = [
    { id: '1', title: 'Contractor Executive Dashboard', category: 'Views', route: '/dashboard', shortcut: 'G D', icon: 'dashboard' },
    { id: '2', title: 'Log Waste with AI Vision', category: 'Action', route: '/waste', shortcut: 'G W', icon: 'camera' },
    { id: '3', title: 'Waste Audit Manifest & History', category: 'Data', route: '/waste', shortcut: 'G H', icon: 'table' },
    { id: '4', title: 'Circular B2B Marketplace', category: 'Market', route: '/marketplace', shortcut: 'G M', icon: 'store' },
    { id: '5', title: 'Seller Portal & Listings', category: 'Portal', route: '/seller', shortcut: 'G S', icon: 'tag' },
    { id: '6', title: 'Buyer Hub & Materials Feed', category: 'Portal', route: '/buyer', shortcut: 'G B', icon: 'truck' },
    { id: '7', title: 'Project Portfolio (Skyline, Metro, EcoPark)', category: 'Projects', route: '/projects', shortcut: 'G P', icon: 'building' },
    { id: '8', title: 'Heavy Fleet Telematics & Machinery', category: 'Assets', route: '/machines', shortcut: 'G E', icon: 'tool' },
    { id: '9', title: 'Workforce Roster & Attendance', category: 'HR', route: '/labour', shortcut: 'G L', icon: 'users' },
    { id: '10', title: 'ESG Environmental Impact Score', category: 'ESG', route: '/impact', shortcut: 'G I', icon: 'leaf' },
    { id: '11', title: 'AI Material Model Intelligence & Evaluation', category: 'AI', route: '/ai-analytics', shortcut: 'G A', icon: 'cpu' },
    { id: '12', title: 'Admin Governance Console', category: 'Admin', route: '/admin', shortcut: 'G G', icon: 'shield' },
    { id: '13', title: 'Public Showcase Landing Page', category: 'Public', route: '/landing', shortcut: 'G 0', icon: 'globe' }
  ];

  constructor(private router: Router) {}

  get filteredItems(): SearchItem[] {
    if (!this.query.trim()) return this.items;
    const q = this.query.toLowerCase();
    return this.items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  close() {
    this.closePalette.emit();
    this.query = '';
    this.selectedIndex = 0;
  }

  selectNext() {
    if (this.selectedIndex < this.filteredItems.length - 1) {
      this.selectedIndex++;
    }
  }

  selectPrev() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  executeSelected() {
    if (this.filteredItems[this.selectedIndex]) {
      this.navigateTo(this.filteredItems[this.selectedIndex]);
    }
  }

  navigateTo(item: SearchItem) {
    this.router.navigate([item.route]);
    this.close();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.isOpen = !this.isOpen;
      if (!this.isOpen) this.close();
    }
  }
}
