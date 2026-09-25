import { Component, EventEmitter, Output, Input, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/all.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 border-b border-[#E2DBD1] bg-[#EDE7DF]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <!-- Left side: Slide Toggle & Brand/Breadcrumbs -->
      <div class="flex items-center gap-4">
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          [ngClass]="{
            'bg-white text-[#1C1917] shadow-sm border border-[#E2DBD1]': isSidebarOpen,
            'text-[#78716C] hover:text-[#1C1917] hover:bg-white/60 border border-transparent': !isSidebarOpen
          }"
          class="p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          [title]="isSidebarOpen ? 'Close slide menu' : 'Open slide menu'"
          aria-label="Toggle navigation menu"
        >
          <svg *ngIf="!isSidebarOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg *ngIf="isSidebarOpen" class="w-5 h-5 text-[#1C1917]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Brand Emblem -->
        <a routerLink="/dashboard" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-white border border-[#E2DBD1] shadow-sm flex items-center justify-center text-sm font-bold text-[#1C1917] group-hover:scale-105 transition-transform">
            ✱
          </div>
          <div class="hidden sm:block">
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-base tracking-tight text-[#1C1917]">REBUILD</span>
            </div>
            <p class="text-[10px] text-[#78716C] tracking-normal hidden md:block">Waste Intelligence & Circular Market</p>
          </div>
        </a>
      </div>

      <!-- Center: Quick Search Trigger Button -->
      <div class="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          (click)="openSearch.emit()"
          class="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F9F7F4] border border-[#E2DDD5] text-xs text-[#78716C] shadow-sm transition-all group cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#78716C] group-hover:text-[#1C1917] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-[#78716C] group-hover:text-[#1C1917]">Search projects, waste logs, materials...</span>
          </div>
          <kbd class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#F6F3EF] text-[#78716C] border border-[#E2DDD5]">Ctrl K</kbd>
        </button>
      </div>

      <!-- Right side: Public Portal, Notifications, and Real User Account Menu -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Public Showcase Landing Link -->
        <a
          routerLink="/landing"
          class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] rounded-xl hover:bg-white/60 transition-colors"
        >
          <svg class="w-3.5 h-3.5 text-[#16A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Public Page
        </a>

        <!-- Notification Bell -->
        <button
          class="relative p-2 text-[#78716C] hover:text-[#1C1917] rounded-xl hover:bg-white/60 transition-colors"
          title="Notifications"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16A34A] rounded-full"></span>
        </button>

        <!-- REAL ENTERPRISE USER PROFILE & ACCOUNT MENU -->
        <div class="relative pl-2 border-l border-[#E2DBD1]">
          <button
            type="button"
            (click)="toggleMenu($event)"
            class="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/60 border border-transparent hover:border-[#E2DBD1] transition-all cursor-pointer"
            aria-label="User account menu"
          >
            <!-- Avatar with Role Status Dot -->
            <div class="relative">
              <div class="w-8 h-8 rounded-full bg-white border border-[#E2DBD1] flex items-center justify-center text-xs font-bold text-[#1C1917] font-mono shadow-sm">
                {{ getInitials() }}
              </div>
              <span
                class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#EDE7DF]"
                [ngClass]="getRoleDotClass(authService.currentRole())"
              ></span>
            </div>

            <!-- User Info (Desktop) -->
            <div class="hidden md:flex flex-col text-left leading-tight">
              <span class="text-xs font-bold text-[#1C1917] truncate max-w-[120px]">
                {{ authService.currentUser()?.name || 'User Account' }}
              </span>
              <span class="text-[10px] text-[#78716C] capitalize flex items-center gap-1 font-mono">
                {{ authService.currentRole() }}
              </span>
            </div>

            <svg class="w-3.5 h-3.5 text-[#78716C] hidden sm:block transition-transform duration-200" [ngClass]="{ 'rotate-180': isMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Account Menu -->
          <div
            *ngIf="isMenuOpen"
            class="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5DFD7] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <!-- User Header Summary -->
            <div class="p-4 bg-[#F9F7F4] border-b border-[#E5DFD7]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white border border-[#E2DBD1] flex items-center justify-center text-sm font-bold text-[#1C1917] font-mono shadow-sm">
                  {{ getInitials() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-bold text-[#1C1917] truncate">
                    {{ authService.currentUser()?.name }}
                  </div>
                  <div class="text-[11px] text-[#78716C] truncate">
                    {{ authService.currentUser()?.email }}
                  </div>
                  <div class="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-[#EBF7EE] text-[#1E7E34] border border-[#DCFCE7]">
                    {{ authService.currentRole() }}
                  </div>
                </div>
              </div>

              <!-- Organization / Company -->
              <div class="mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center justify-between">
                <span class="text-slate-500">Org:</span>
                <span class="font-medium truncate max-w-[140px] text-[#1C1917]">{{ authService.currentUser()?.companyName }}</span>
              </div>
            </div>

            <!-- Menu Navigation Links -->
            <div class="p-2 space-y-1 text-xs">
              <a
                routerLink="/settings"
                (click)="isMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1C1917] hover:bg-[#F6F3EF] transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings & Security
              </a>

              <a
                routerLink="/auth/login"
                (click)="isMenuOpen = false"
                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1C1917] hover:bg-[#F6F3EF] transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Switch Account / Sign In
              </a>
            </div>

            <!-- Sign Out Footer -->
            <div class="p-2 border-t border-[#E5DFD7] bg-[#F9F7F4]">
              <button
                type="button"
                (click)="onSignOut($event)"
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out of ReBuild
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() isSidebarOpen: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();

  isMenuOpen: boolean = false;

  constructor(public authService: AuthService, private elementRef: ElementRef) {}

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSignOut(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = false;
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  getRoleDotClass(role: UserRole): string {
    switch (role) {
      case 'contractor': return 'bg-emerald-400';
      case 'buyer': return 'bg-sky-400';
      case 'admin': return 'bg-purple-400';
    }
  }

  getInitials(): string {
    const name = this.authService.currentUser()?.name || 'IH';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
