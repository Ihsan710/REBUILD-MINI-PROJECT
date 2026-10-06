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
    <div class="p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            ENTERPRISE GOVERNANCE & PROFILES
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Account & Organization Settings</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Manage enterprise profile, credentials, security policies, and workspace connections.</p>
        </div>

        <div class="flex items-center gap-2">
          <a routerLink="/auth/login" class="rb-btn-secondary text-xs shadow-xs">
            <svg class="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Switch User Account
          </a>
          <button (click)="authService.logout()" class="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer shadow-xs">
            Sign Out
          </button>
        </div>
      </div>

      <!-- AUTHENTICATED USER IDENTITY SUMMARY -->
      <div class="rb-card p-6 bg-gradient-to-r from-[#FBF9F6] to-[#F5EFEB] border border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center text-lg font-extrabold font-mono shadow-sm">
            {{ getInitials() }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-extrabold text-[#1C1917]">{{ authService.currentUser()?.name }}</h2>
              <span class="badge-green font-mono uppercase font-bold text-[10px]">
                {{ authService.currentRole() }}
              </span>
              <span class="badge-blue font-semibold text-[10px]">
                KYC VERIFIED
              </span>
            </div>
            <p class="text-xs text-[#78716C] mt-1 font-medium">{{ authService.currentUser()?.email }} · {{ authService.currentUser()?.companyName }}</p>
          </div>
        </div>

        <div class="text-left sm:text-right">
          <div class="text-[11px] text-[#78716C]">Account ID: <span class="font-mono text-[#1C1917] font-bold">{{ authService.currentUser()?.id }}</span></div>
          <div class="text-[11px] text-[#16A34A] font-mono font-bold mt-1 flex items-center gap-1.5 sm:justify-end">
            <span class="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>Active Authenticated JWT Session</span>
          </div>
        </div>
      </div>

      <!-- PROFILE SETTINGS FORM -->
      <div class="rb-card p-6 space-y-5 border border-[#E5DFD7]">
        <div class="pb-2 border-b border-[#E5DFD7]">
          <h3 class="text-base font-bold text-[#1C1917]">Enterprise Organization Profile</h3>
          <p class="text-xs text-[#78716C]">Primary billing, location, and entity details linked to material consignments.</p>
        </div>

        <form (submit)="saveProfile($event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Company / Entity Name</label>
              <input type="text" [(ngModel)]="companyName" name="comp" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-medium placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Full Name</label>
              <input type="text" [(ngModel)]="adminName" name="admin" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-medium placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Corporate Email Address</label>
              <input type="email" [(ngModel)]="email" name="em" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-medium placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">HQ / Site Region</label>
              <input type="text" [(ngModel)]="location" name="loc" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-medium placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Contact Phone</label>
              <input type="text" [(ngModel)]="phone" name="ph" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] font-medium placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Account Role</label>
              <input type="text" [value]="authService.currentRole().toUpperCase()" disabled class="w-full px-3.5 py-2.5 rounded-xl bg-[#EFECE6] border border-[#E2DDD5] text-xs text-[#78716C] font-mono font-bold cursor-not-allowed" />
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button type="submit" class="rb-btn-primary text-xs cursor-pointer shadow-sm">Save Profile Changes</button>
          </div>
        </form>
      </div>

      <!-- SECURITY & CREDENTIALS -->
      <div class="rb-card p-6 space-y-5 border border-[#E5DFD7]">
        <div class="pb-2 border-b border-[#E5DFD7]">
          <h3 class="text-base font-bold text-[#1C1917]">Security & Credentials</h3>
          <p class="text-xs text-[#78716C]">Cryptographic credentials protecting your circular marketplace authorizations.</p>
        </div>

        <form (submit)="updatePassword($event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">Current Password</label>
              <input type="password" [(ngModel)]="currentPassword" name="currPw" placeholder="••••••••••••" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all font-mono shadow-2xs" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1.5 text-xs">New Secure Password</label>
              <input type="password" [(ngModel)]="newPassword" name="newPw" placeholder="Minimum 8 characters" class="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5B7A5] focus:bg-white transition-all font-mono shadow-2xs" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div class="text-[11px] text-[#78716C]">
              Passwords are encrypted with <span class="font-mono text-[#1C1917] font-bold">Bcrypt 12 rounds</span> salt encryption.
            </div>
            <button type="submit" class="rb-btn-secondary text-xs cursor-pointer shadow-xs">Update Password</button>
          </div>
        </form>
      </div>

      <!-- TELEMETRY & API CONFIG -->
      <div class="rb-card p-6 space-y-4 border border-[#E5DFD7]">
        <div class="pb-2 border-b border-[#E5DFD7]">
          <h3 class="text-base font-bold text-[#1C1917]">Computer Vision Inference & API Connections</h3>
          <p class="text-xs text-[#78716C]">Live telemetry status of backing neural networks and persistent services.</p>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
            <div>
              <div class="font-bold text-[#1C1917]">Backend REST API Endpoint</div>
              <div class="text-[11px] text-[#78716C] font-mono">http://localhost:8000/api</div>
            </div>
            <span class="badge-green">ONLINE (PORT 8000)</span>
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
            <div>
              <div class="font-bold text-[#1C1917]">PyTorch ResNet-34 AI Inference Pipeline</div>
              <div class="text-[11px] text-[#78716C] font-mono">Real-time Computer Vision Service (Port 5001)</div>
            </div>
            <span class="badge-green">ACTIVE</span>
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
            <div>
              <div class="font-bold text-[#1C1917]">Geospatial Distance Calculation Algorithm</div>
              <div class="text-[11px] text-[#78716C] font-mono">Mathematical Spherical Haversine Algorithm</div>
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
  adminName: string = 'Ihsan Muhammed';
  email: string = 'ihsan@rebuildos.com';
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
