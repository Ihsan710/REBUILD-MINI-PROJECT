import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../core/services/project.service';
import { WasteService } from '../../core/services/waste.service';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { MachineService } from '../../core/services/machine.service';
import { LabourService } from '../../core/services/labour.service';
import { ToastService } from '../../core/services/toast.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold mb-1">
            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
            SYSTEM GOVERNANCE & PLATFORM INTEGRITY
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Governance Console</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Platform telemetry, KYC user verifications, listing moderation, and audit logs.</p>
        </div>

        <span class="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono font-bold">
          ROOT GOVERNANCE
        </span>
      </div>

      <!-- ADMIN TELEMETRY METRICS STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <app-stat-card
          label="REGISTERED USERS"
          [value]="projectService.projects().length * 3 + 8"
          unit="entities"
          subtitle="Contractors & Yards"
          variant="slate"
        ></app-stat-card>

        <app-stat-card
          label="ACTIVE PROJECTS"
          [value]="projectService.projects().length"
          unit="sites"
          subtitle="Monitored live"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="MARKET LISTINGS"
          [value]="marketplaceService.listings().length"
          unit="lots"
          subtitle="Active inventory"
          variant="blue"
        ></app-stat-card>

        <app-stat-card
          label="TRANSACTIONS"
          [value]="marketplaceService.requests().length"
          unit="orders"
          subtitle="Completed / in transit"
          trend="Live ledger"
          [trendPositive]="true"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="TOTAL WASTE VOL"
          [value]="projectService.totalWasteAllProjectsKg() | number"
          unit="kg"
          subtitle="Platform total"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="AI PREDICTIONS"
          [value]="wasteService.records().length"
          unit="runs"
          subtitle="Active Vision Model"
          variant="purple"
        ></app-stat-card>
      </div>

      <!-- PENDING USER VERIFICATIONS & KYC MODERATION -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div>
            <h3 class="text-base font-bold text-white">Pending Contractor & Yard KYC Verifications</h3>
            <p class="text-xs text-slate-400">Validate enterprise GST, contractor credentials, and site waste licenses.</p>
          </div>
          <span class="badge-amber">3 Pending</span>
        </div>

        <div class="divide-y divide-white/[0.06]">
          <div *ngFor="let u of pendingUsers" class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white text-sm">{{ u.companyName }}</span>
                <span class="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono text-[10px]">{{ u.role }}</span>
              </div>
              <div class="text-slate-400 mt-0.5">
                Contact: {{ u.contactPerson }} ({{ u.email }}) • Location: {{ u.location }}
              </div>
              <div class="text-[11px] text-slate-500 font-mono mt-1">
                License: {{ u.licenseNo }} • Submitted: {{ u.submittedDate }}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button (click)="verifyUser(u.id)" class="rb-btn-primary text-xs py-1.5 px-3">
                Approve & Issue Certificate
              </button>
              <button (click)="rejectUser(u.id)" class="rb-btn-ghost text-xs text-rose-400 py-1.5 px-3 hover:bg-rose-500/10">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RECENT PLATFORM AUDIT LOGS -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-white">System Security & Audit Trail</h3>
          <span class="text-xs font-mono text-slate-400">SOC2 Certified Ledger</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[10px]">
                <th class="pb-3 font-semibold">Event Type</th>
                <th class="pb-3 font-semibold">Actor</th>
                <th class="pb-3 font-semibold">Details</th>
                <th class="pb-3 font-semibold">Timestamp</th>
                <th class="pb-3 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.04] font-mono text-[11px]">
              <tr *ngFor="let log of auditLogs" class="hover:bg-white/[0.02]">
                <td class="py-2.5 font-bold text-emerald-400">{{ log.event }}</td>
                <td class="py-2.5 text-slate-300">{{ log.actor }}</td>
                <td class="py-2.5 text-slate-400">{{ log.details }}</td>
                <td class="py-2.5 text-slate-500">{{ log.time }}</td>
                <td class="py-2.5 text-slate-500">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  pendingUsers = [
    {
      id: 'kyc-1',
      companyName: 'Apex Demolition & Remediation Ltd',
      role: 'Contractor',
      contactPerson: 'Karan Mehra',
      email: 'karan@apexdemo.com',
      location: 'Peenya Industrial Area, Bangalore',
      licenseNo: 'BLR-CDW-2026-8812',
      submittedDate: '2026-08-31'
    },
    {
      id: 'kyc-2',
      companyName: 'Southern Secondary Aggregates Yard',
      role: 'Seller / Recycler',
      contactPerson: 'Siddharth Roy',
      email: 'siddharth@ssagg.in',
      location: 'Hosur Road Yard 4, Bangalore',
      licenseNo: 'BLR-REC-2026-4409',
      submittedDate: '2026-08-30'
    }
  ];

  auditLogs = [
    { event: 'AI_INFERENCE_CONFIRMED', actor: 'Ihsan Al-Mansoor', details: '800kg Brick manifest verified at Skyline Heights', time: '2026-08-31 10:45:12', ip: '49.207.198.42' },
    { event: 'MARKETPLACE_ORDER_DISPATCHED', actor: 'Anita Desai', details: 'Request for 1,420kg Fe500D rebar accepted by Rajesh Kumar', time: '2026-08-31 08:30:19', ip: '106.51.78.114' },
    { event: 'MACHINE_TELEMATICS_ALERT', actor: 'CAT-320D-EXC', details: 'Preventive 500h maintenance threshold reached', time: '2026-08-30 16:22:05', ip: '192.168.1.104' },
    { event: 'USER_KYC_APPROVED', actor: 'System Governance', details: 'GreenReclaim C&D Processing Yard verified', time: '2026-08-28 14:10:00', ip: '127.0.0.1' }
  ];

  constructor(
    public projectService: ProjectService,
    public marketplaceService: MarketplaceService,
    public wasteService: WasteService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  verifyUser(id: string) {
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
    this.toast.success('KYC Verified', 'Partner approved for certified circular trading.');
  }

  rejectUser(id: string) {
    this.pendingUsers = this.pendingUsers.filter(u => u.id !== id);
    this.toast.error('Application Rejected', 'Partner notified with remediation instructions.');
  }
}
