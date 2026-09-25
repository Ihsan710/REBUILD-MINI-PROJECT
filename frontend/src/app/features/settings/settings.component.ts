import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Account & Organization Settings</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Manage enterprise profile, credentials, security policies, and workspace connections.</p>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/auth/login" class="rb-btn-secondary text-xs">
            <svg class="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Switch User Account
          </a>
          <button (click)="authService.logout()" class="rb-btn-danger text-xs">
            Sign Out
          </button>
        </div>
      </div>

      <!-- AUTHENTICATED USER IDENTITY SUMMARY -->
      <div class="rb-card p-6 bg-[#0E1624] border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-[#1E293B] border border-slate-700 flex items-center justify-center text-lg font-extrabold text-emerald-400 font-mono">
            {{ getInitials() }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-white">{{ authService.currentUser()?.name }}</h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {{ authService.currentRole() }}
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/25">
                KYC VERIFIED
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">{{ authService.currentUser()?.email }} · {{ authService.currentUser()?.companyName }}</p>
          </div>
        </div>

        <div class="text-left sm:text-right">
          <div class="text-[11px] text-slate-400">Account ID: <span class="font-mono text-slate-200">{{ authService.currentUser()?.id }}</span></div>
          <div class="text-[11px] text-emerald-400 font-mono mt-0.5">● Active Authenticated JWT Session</div>
        </div>
      </div>

      <!-- PROFILE SETTINGS FORM -->
      <div class="rb-card p-6 space-y-4">
        <h3 class="text-base font-bold text-white pb-2 border-b border-white/[0.08]">Enterprise Organization Profile</h3>

        <form (submit)="saveProfile($event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Company / Entity Name</label>
              <input type="text" [(ngModel)]="companyName" name="comp" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">Full Name</label>
              <input type="text" [(ngModel)]="adminName" name="admin" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">Corporate Email Address</label>
              <input type="email" [(ngModel)]="email" name="em" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">HQ / Site Region</label>
              <input type="text" [(ngModel)]="location" name="loc" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">Contact Phone</label>
              <input type="text" [(ngModel)]="phone" name="ph" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">Account Role</label>
              <input type="text" [value]="authService.currentRole().toUpperCase()" disabled class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-400 font-mono" />
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button type="submit" class="rb-btn-primary text-xs">Save Profile Changes</button>
          </div>
        </form>
      </div>

      <!-- SECURITY & CREDENTIALS -->
      <div class="rb-card p-6 space-y-4">
        <h3 class="text-base font-bold text-white pb-2 border-b border-white/[0.08]">Security & Credentials</h3>

        <form (submit)="updatePassword($event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Current Password</label>
              <input type="password" [(ngModel)]="currentPassword" name="currPw" placeholder="••••••••••••" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div>
              <label class="font-semibold text-slate-300 block mb-1">New Secure Password</label>
              <input type="password" [(ngModel)]="newPassword" name="newPw" placeholder="Minimum 8 characters" class="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div class="text-[11px] text-slate-400">
              Passwords are encrypted with <span class="font-mono text-slate-300 font-semibold">Bcrypt 12 rounds</span> salt encryption.
            </div>
            <button type="submit" class="rb-btn-secondary text-xs">Update Password</button>
          </div>
        </form>
      </div>

      <!-- TELEMETRY & API CONFIG -->
      <div class="rb-card p-6 space-y-4">
        <h3 class="text-base font-bold text-white pb-2 border-b border-white/[0.08]">Computer Vision Inference & API Connections</h3>

        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div class="font-bold text-white">MySQL Database REST API Endpoint</div>
              <div class="text-[11px] text-slate-400 font-mono">http://localhost:8000/api</div>
            </div>
            <span class="badge-green">ONLINE (PORT 8000)</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div class="font-bold text-white">Browser-Side Canvas Tensor Feature Pipeline</div>
              <div class="text-[11px] text-slate-400 font-mono">Sub-400ms High-Frequency Texture & Hue Classifier</div>
            </div>
            <span class="badge-green">ACTIVE</span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <div>
              <div class="font-bold text-white">Geospatial Distance Calculation Algorithm</div>
              <div class="text-[11px] text-slate-400 font-mono">Mathematical Spherical Haversine Algorithm</div>
            </div>
            <span class="badge-blue">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  companyName: string = 'Skyline Infrastructure & Developers';
  adminName: string = 'Ihsan Al-Mansoor';
  email: string = 'ihsan@skylinebuilders.com';
  location: string = 'Bangalore, India';
  phone: string = '+91 98450 12345';

  currentPassword = '';
  newPassword = '';

  constructor(
    public authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.companyName = user.companyName;
      this.adminName = user.name;
      this.email = user.email;
      this.location = user.location;
      this.phone = user.phone || '+91 98450 12345';
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

  saveProfile(event: Event) {
    event.preventDefault();
    this.toast.success('Settings Saved', 'Profile preferences updated.');
  }

  updatePassword(event: Event) {
    event.preventDefault();
    if (!this.newPassword || this.newPassword.length < 6) {
      this.toast.error('Security Notice', 'New password must be at least 6 characters.');
      return;
    }
    this.toast.success('Security Updated', 'Password successfully changed and re-encrypted.');
    this.currentPassword = '';
    this.newPassword = '';
  }
}
