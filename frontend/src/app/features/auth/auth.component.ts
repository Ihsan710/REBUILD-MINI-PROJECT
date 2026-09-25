import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/all.models';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#EDE7DF] text-[#1C1917] font-sans selection:bg-[#D4A373]/30 selection:text-[#1C1917]">
      <!-- LEFT: High-End Architectural Showcase (Lakeside Pavilion) -->
      <div class="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-[#E2DBD1]">
        <!-- High-Res Pavilion Background Image -->
        <img
          src="/assets/materials/circular_pavilion.jpg"
          alt="Architectural Sustainable Pavilion"
          class="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <!-- Warm Soft Architectural Tint Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50"></div>

        <!-- Top brand emblem -->
        <div class="flex items-center gap-3 relative z-10">
          <div class="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-white/40 flex items-center justify-center text-[#1C1917] text-lg font-bold">
            ✱
          </div>
          <div>
            <span class="font-extrabold text-xl tracking-tight text-white drop-shadow">REBUILD</span>
            <span class="block text-[9px] font-mono tracking-widest text-white/80 uppercase -mt-0.5">Circular Architecture OS</span>
          </div>
        </div>

        <!-- Center Vision & Sustainable Credentials -->
        <div class="max-w-md relative z-10 space-y-6 text-white">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium text-white shadow">
            <span class="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            Zero Demolition Landfill Protocol
          </div>

          <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            "Transforming structural waste into circular capital through computer vision and geospatial intelligence."
          </h2>

          <div class="space-y-3 pt-4 border-t border-white/20">
            <div class="flex items-center gap-3 text-xs text-white/90">
              <span class="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-bold shadow">✓</span>
              <span>Sub-second AI Material Detection & Classification</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-white/90">
              <span class="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-bold shadow">✓</span>
              <span>Haversine B2B Material Matching & Geodesic Routing</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-white/90">
              <span class="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-[10px] font-bold shadow">✓</span>
              <span>Certified Scope 3 ESG Audit Manifests</span>
            </div>
          </div>
        </div>

        <!-- Footer watermark -->
        <div class="text-xs text-white/80 flex items-center justify-between relative z-10 font-mono text-[11px]">
          <span>Enterprise Circular Platform</span>
          <span class="font-bold text-white">REBUILD v2.4</span>
        </div>
      </div>

      <!-- RIGHT: Crisp Architectural White Auth Card -->
      <div class="flex items-center justify-center p-6 sm:p-12">
        <div class="w-full max-w-md space-y-6 bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-[#E5DFD7]">
          
          <!-- Auth Toggle Tabs -->
          <div class="flex p-1.5 rounded-2xl bg-[#F6F3EF] border border-[#E2DDD5]">
            <button
              (click)="isRegisterMode = false"
              [ngClass]="!isRegisterMode ? 'bg-white text-[#1C1917] shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              (click)="isRegisterMode = true"
              [ngClass]="isRegisterMode ? 'bg-white text-[#1C1917] shadow-sm font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>

          <!-- Header Titles -->
          <div>
            <h1 class="text-2xl font-black tracking-tight text-[#1C1917]">
              {{ isRegisterMode ? 'Create your ReBuild account' : 'Sign in to ReBuild' }}
            </h1>
            <p class="text-xs text-[#78716C] mt-1.5">
              {{ isRegisterMode ? 'Select your operational role and join the circular construction network.' : 'Enter your email and password to access your workspace.' }}
            </p>
          </div>

          <!-- AUTH FORM -->
          <form (submit)="handleSubmit($event)" class="space-y-4">
            <!-- Full Name (Register only) -->
            <div *ngIf="isRegisterMode" class="space-y-1.5">
              <label class="text-xs font-semibold text-[#1C1917]">Full Name</label>
              <input
                type="text"
                [(ngModel)]="name"
                name="name"
                required
                placeholder="e.g. Ihsan Al-Mansoor"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] transition-colors"
              />
            </div>

            <!-- Company Name (Register only) -->
            <div *ngIf="isRegisterMode" class="space-y-1.5">
              <label class="text-xs font-semibold text-[#1C1917]">Company / Organization</label>
              <input
                type="text"
                [(ngModel)]="companyName"
                name="companyName"
                required
                placeholder="e.g. Skyline Infrastructure"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] transition-colors"
              />
            </div>

            <!-- Email Address -->
            <div class="space-y-1.5">
              <label class="text-xs font-semibold text-[#1C1917]">Work Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="name@company.com"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] transition-colors font-mono"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-[#1C1917]">Password</label>
                <a *ngIf="!isRegisterMode" href="javascript:void(0)" class="text-[11px] text-[#78716C] hover:text-[#1C1917] underline">Forgot password?</a>
              </div>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] transition-colors font-mono"
              />
            </div>

            <!-- ROLE SELECTION (Register Mode only) -->
            <div *ngIf="isRegisterMode" class="space-y-2 pt-1">
              <label class="text-xs font-semibold text-[#1C1917]">Select Your Operational Role</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  (click)="selectedRole = 'contractor'"
                  [ngClass]="selectedRole === 'contractor' ? 'border-[#1C1917] bg-[#F6F3EF] text-[#1C1917] font-bold shadow-sm' : 'border-[#E2DDD5] bg-white text-[#78716C] hover:bg-[#F9F7F4]'"
                  class="p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer"
                >
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm">🏗️ Contractor</span>
                  </div>
                  <span class="text-[11px] text-[#78716C] mt-1">Sites, AI Waste Scanner, Sell Debris & Buy Materials</span>
                </button>

                <button
                  type="button"
                  (click)="selectedRole = 'buyer'"
                  [ngClass]="selectedRole === 'buyer' ? 'border-[#1C1917] bg-[#F6F3EF] text-[#1C1917] font-bold shadow-sm' : 'border-[#E2DDD5] bg-white text-[#78716C] hover:bg-[#F9F7F4]'"
                  class="p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer"
                >
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm">🛒 Buyer</span>
                  </div>
                  <span class="text-[11px] text-[#78716C] mt-1">Secondary Procurement & Circular Material Sourcing</span>
                </button>
              </div>
            </div>

            <!-- Remember me checkbox (Sign In only) -->
            <div *ngIf="!isRegisterMode" class="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" checked class="rounded border-[#E2DDD5] text-[#1C1917] focus:ring-[#1C1917]" />
              <label for="remember" class="text-xs text-[#78716C]">Remember this device for 30 days</label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full py-3 rounded-xl bg-[#1C1917] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all mt-4 cursor-pointer"
            >
              {{ isRegisterMode ? 'Create Account & Continue' : 'Sign In' }}
            </button>
          </form>

          <!-- Back to landing -->
          <div class="text-center pt-2">
            <a routerLink="/landing" class="text-xs text-[#78716C] hover:text-[#1C1917] font-medium transition-colors">
              ← Return to Public Landing Page
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isRegisterMode: boolean = false;
  email: string = '';
  name: string = '';
  companyName: string = '';
  password: string = '';
  selectedRole: UserRole = 'contractor';

  constructor(private authService: AuthService, private router: Router) {}

  handleSubmit(event: Event) {
    event.preventDefault();
    if (this.isRegisterMode) {
      this.authService.register(
        { name: this.name, email: this.email, companyName: this.companyName || 'Enterprise Partner' },
        this.selectedRole,
        this.password
      );
    } else {
      this.authService.login(this.email, this.password);
    }
  }
}
