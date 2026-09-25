import { Component, Input, Output, EventEmitter, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { WasteService } from '../../core/services/waste.service';
import { MarketplaceService } from '../../core/services/marketplace.service';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  iconPath: string;
  badge?: string;
  badgeType?: 'green' | 'amber' | 'blue' | 'purple' | 'slate';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Slide Pop-up Backdrop Overlay (smooth fade & blur) -->
    <div
      *ngIf="(isOpen || isMobileOpen) && !isPinned"
      (click)="onBackdropClick()"
      class="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
      aria-hidden="true"
    ></div>

    <!-- Sidebar Container: Smooth Slide Pop-up Drawer -->
    <aside
      [ngClass]="{
        'translate-x-0': isOpen || isMobileOpen || isPinned,
        '-translate-x-full': !(isOpen || isMobileOpen || isPinned),
        'lg:static lg:translate-x-0 w-64': isPinned,
        'fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 shadow-2xl': !isPinned
      }"
      class="bg-[#F5F1EB] border-r border-[#E2DBD1] transition-transform duration-300 ease-out flex flex-col justify-between overflow-y-auto"
      [attr.role]="isPinned ? 'complementary' : 'dialog'"
      [attr.aria-modal]="!isPinned"
    >
      <div>
        <!-- DRAWER TOP BRAND & CONTROLS HEADER -->
        <div class="h-16 px-4 border-b border-[#E2DBD1] flex items-center justify-between bg-[#EDE7DF] sticky top-0 z-10">
          <a routerLink="/dashboard" (click)="onItemClick()" class="flex items-center gap-2.5 group">
            <div class="w-8 h-8 rounded-xl bg-white border border-[#E2DBD1] shadow-sm flex items-center justify-center text-sm font-bold text-[#1C1917] group-hover:scale-105 transition-transform">
              ✱
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-extrabold text-base tracking-tight text-[#1C1917]">REBUILD</span>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/80 border border-[#E2DDD5] text-[#78716C] uppercase">v2.4</span>
              </div>
              <p class="text-[9px] text-[#78716C] leading-none mt-0.5">Waste Intelligence & Circular Market</p>
            </div>
          </a>

          <div class="flex items-center gap-1">
            <!-- Pin to Side Button (Desktop only) -->
            <button
              type="button"
              (click)="togglePinned.emit()"
              class="hidden lg:flex p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-white/80 transition-colors"
              [title]="isPinned ? 'Switch to Pop-up Drawer mode' : 'Pin sidebar to screen'"
            >
              <svg class="w-4 h-4 transition-transform duration-200" [ngClass]="{ 'text-[#16A34A] rotate-45': isPinned }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <!-- Close Slide Drawer Button -->
            <button
              type="button"
              (click)="onCloseClick()"
              class="p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-white/80 transition-colors cursor-pointer"
              title="Close slide menu (Esc)"
              aria-label="Close navigation"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation Sections Group -->
        <div class="py-4 px-3 space-y-6">
          <!-- PERSONA ROLE HEADER BADGE -->
          <div class="px-3.5 py-2.5 rounded-2xl bg-white border border-[#E2DDD5] shadow-sm flex items-center justify-between">
            <div>
              <div class="text-[9px] font-mono uppercase tracking-wider text-[#78716C]">Workspace Role</div>
              <div class="text-xs font-bold text-[#1C1917] capitalize flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full" [ngClass]="getRoleDotClass(authService.currentRole())"></span>
                {{ getRoleTitle(authService.currentRole()) }}
              </div>
            </div>
            <span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase" [ngClass]="getRoleBadgeClass(authService.currentRole())">
              {{ authService.currentRole() }}
            </span>
          </div>

          <!-- DYNAMIC ROLE-BASED NAVIGATION SECTIONS -->
          <div *ngFor="let section of roleSections()" class="space-y-1.5">
            <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
              {{ section.title }}
            </div>

            <nav class="space-y-1">
              <a
                *ngFor="let item of section.items"
                [routerLink]="item.route"
                routerLinkActive="bg-white text-[#1C1917] border border-[#E2DBD1] shadow-sm font-bold"
                [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' || item.route === '/seller' || item.route === '/buyer' }"
                (click)="onItemClick()"
                class="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-white/60 border border-transparent transition-all duration-150 relative"
              >
                <svg class="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-[#1C1917]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" [attr.d]="item.iconPath" />
                </svg>

                <span class="truncate">{{ item.label }}</span>

                <!-- Dynamic Project Count Badge -->
                <span
                  *ngIf="item.route === '/projects' && projectService.projects().length > 0"
                  class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]"
                >
                  {{ projectService.projects().length }} Active
                </span>

                <!-- Dynamic Active Marketplace Count Badge -->
                <span
                  *ngIf="item.route === '/marketplace' && marketplaceService.totalActiveListings() > 0"
                  class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#2563EB] border border-[#DBEAFE]"
                >
                  {{ marketplaceService.totalActiveListings() }} Lots
                </span>

                <!-- Other Badges -->
                <span
                  *ngIf="item.badge && item.route !== '/projects' && item.route !== '/marketplace'"
                  [ngClass]="getBadgeClass(item.badgeType)"
                  class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  {{ item.badge }}
                </span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      <!-- Bottom: System Status -->
      <div class="p-3 border-t border-[#E2DBD1] bg-[#EDE7DF] sticky bottom-0">
        <div class="p-3 rounded-xl bg-white border border-[#E2DDD5] shadow-sm">
          <div class="flex items-center justify-between text-[11px] text-[#78716C] mb-1">
            <span>Database Storage</span>
            <span class="text-[#16A34A] font-mono text-[10px] font-bold">PERSISTED</span>
          </div>
          <div class="w-full bg-[#E5DFD7] rounded-full h-1 overflow-hidden">
            <div class="bg-[#16A34A] h-full w-[100%]"></div>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Input() isMobileOpen: boolean = false;
  @Input() isPinned: boolean = false;
  @Input() isExpanded: boolean = true;
  @Output() close = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();
  @Output() togglePinned = new EventEmitter<void>();
  @Output() toggleExpanded = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public projectService: ProjectService,
    public wasteService: WasteService,
    public marketplaceService: MarketplaceService
  ) {}

  onCloseClick() {
    this.close.emit();
    this.closeMobile.emit();
  }

  onBackdropClick() {
    this.close.emit();
    this.closeMobile.emit();
  }

  onItemClick() {
    if (!this.isPinned) {
      this.close.emit();
      this.closeMobile.emit();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if ((this.isOpen || this.isMobileOpen) && !this.isPinned) {
      this.close.emit();
      this.closeMobile.emit();
    }
  }

  // Computed Dynamic Navigation tailored to each specific Persona
  readonly roleSections = computed<NavSection[]>(() => {
    const role = this.authService.currentRole();

    if (role === 'buyer') {
      return [
        {
          title: 'Buyer Procurement',
          items: [
            {
              label: 'Procurement Hub',
              route: '/buyer',
              iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
              badge: 'Orders',
              badgeType: 'blue'
            },
            {
              label: 'Circular Marketplace',
              route: '/marketplace',
              iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            }
          ]
        },
        {
          title: 'Impact & Preferences',
          items: [
            {
              label: 'Carbon Savings & ESG',
              route: '/impact',
              iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
              badge: 'ESG',
              badgeType: 'green'
            },
            {
              label: 'Settings',
              route: '/settings',
              iconPath: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
            }
          ]
        }
      ];
    }

    if (role === 'admin') {
      return [
        {
          title: 'System Governance',
          items: [
            {
              label: 'Admin Console',
              route: '/admin',
              iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
              badge: 'ROOT',
              badgeType: 'purple'
            },
            {
              label: 'Overview Dashboard',
              route: '/dashboard',
              iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
            },
            {
              label: 'All Projects',
              route: '/projects',
              iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
            },
            {
              label: 'B2B Marketplace Moderation',
              route: '/marketplace',
              iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
            }
          ]
        },
        {
          title: 'Auditing & Analytics',
          items: [
            {
              label: 'AI Model Analytics',
              route: '/ai-analytics',
              iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
              badge: '95%',
              badgeType: 'green'
            },
            {
              label: 'ESG Audit & Reports',
              route: '/impact',
              iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            },
            {
              label: 'System Settings',
              route: '/settings',
              iconPath: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
            }
          ]
        }
      ];
    }

    // Default: CONTRACTOR (Full Generative & Procurement Workspace)
    return [
      {
        title: 'Core Operations',
        items: [
          {
            label: 'Site Dashboard',
            route: '/dashboard',
            iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
          },
          {
            label: 'Construction Projects',
            route: '/projects',
            iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          },
          {
            label: 'AI Material Scanner',
            route: '/waste',
            iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            badge: 'Scan',
            badgeType: 'green'
          }
        ]
      },
      {
        title: 'Circular Marketplace (Buy & Sell)',
        items: [
          {
            label: 'Browse & Procure',
            route: '/marketplace',
            iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
            badge: 'Buy/Sell',
            badgeType: 'blue'
          },
          {
            label: 'Sales & Order Dispatches',
            route: '/seller',
            iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
            badge: 'Orders',
            badgeType: 'amber'
          }
        ]
      },
      {
        title: 'Site Resources',
        items: [
          {
            label: 'Machinery Fleet',
            route: '/machines',
            iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
          },
          {
            label: 'Workforce Roster',
            route: '/labour',
            iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          }
        ]
      },
      {
        title: 'Intelligence & ESG',
        items: [
          {
            label: 'AI Model Training',
            route: '/ai-analytics',
            iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            badge: 'Train',
            badgeType: 'green'
          },
          {
            label: 'Landfill Avoidance & ESG',
            route: '/impact',
            iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          },
          {
            label: 'Settings',
            route: '/settings',
            iconPath: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
          }
        ]
      }
    ];
  });

  getRoleTitle(role: string): string {
    switch (role) {
      case 'contractor': return 'Contractor (Buy & Sell)';
      case 'buyer': return 'Buyer Procurement Hub';
      case 'admin': return 'Root Governance';
      default: return 'Contractor Workspace';
    }
  }

  getRoleDotClass(role: string): string {
    switch (role) {
      case 'contractor': return 'bg-emerald-400';
      case 'buyer': return 'bg-sky-400';
      case 'admin': return 'bg-purple-400';
      default: return 'bg-emerald-400';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'contractor': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'buyer': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'admin': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
  }

  getBadgeClass(type?: string): string {
    switch (type) {
      case 'green': return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
      case 'amber': return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      case 'blue': return 'bg-sky-500/15 text-sky-400 border border-sky-500/20';
      case 'purple': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      default: return 'bg-white/[0.06] text-slate-300 border border-white/[0.08]';
    }
  }
}
