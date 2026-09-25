import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabourService } from '../../core/services/labour.service';
import { ProjectService } from '../../core/services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { Worker, WorkerRole } from '../../core/models/all.models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-labour',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            SITE WORKFORCE & ATTENDANCE ROSTER
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Labour & Crew Management</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Track daily attendance, certified skill trades, wage ledger, and site allocations.</p>
        </div>

        <button (click)="isAddModalOpen = true" class="rb-btn-primary text-xs shadow-lg shadow-emerald-500/10">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Enroll New Worker
        </button>
      </div>

      <!-- LABOUR METRICS STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="TOTAL WORKERS"
          [value]="labourService.totalWorkers()"
          unit="registered"
          subtitle="All active trade rosters"
          variant="slate"
        ></app-stat-card>

        <app-stat-card
          label="PRESENT TODAY"
          [value]="labourService.presentToday()"
          unit="on site"
          subtitle="Check-in verified"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="ABSENT"
          [value]="labourService.absentToday()"
          unit="workers"
          subtitle="Unreported / leave"
          variant="rose"
        ></app-stat-card>

        <app-stat-card
          label="OVERTIME"
          [value]="labourService.overtimeWorkers()"
          unit="workers"
          subtitle="Extended shift active"
          variant="amber"
        ></app-stat-card>
      </div>

      <!-- WORKFORCE ROSTER TABLE WITH ATTENDANCE ACTION -->
      <div class="rb-card p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-white">Daily Site Attendance Ledger</h3>
            <p class="text-xs text-slate-400">Manage check-in, shift durations, and overtime pay allocation.</p>
          </div>

          <!-- Filter by Role -->
          <div class="flex items-center gap-2">
            <select [(ngModel)]="roleFilter" class="px-3 py-1.5 rounded-lg bg-[#111827] border border-white/[0.1] text-xs text-slate-200">
              <option value="ALL">All Trade Roles</option>
              <option value="Mason">Masons</option>
              <option value="Carpenter">Carpenters</option>
              <option value="Electrician">Electricians</option>
              <option value="Plumber">Plumbers</option>
              <option value="Machine Operator">Machine Operators</option>
              <option value="Helper">Helpers</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[10px]">
                <th class="pb-3 font-semibold">Worker</th>
                <th class="pb-3 font-semibold">Role & Skill</th>
                <th class="pb-3 font-semibold">Project Site</th>
                <th class="pb-3 font-semibold">Check-In</th>
                <th class="pb-3 font-semibold">Hours Worked</th>
                <th class="pb-3 font-semibold">Daily Wage</th>
                <th class="pb-3 font-semibold">Attendance</th>
                <th class="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.04]">
              <tr *ngFor="let worker of filteredWorkers" class="hover:bg-white/[0.02]">
                <td class="py-3 font-medium text-white flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                    {{ worker.name.slice(0, 1) }}
                  </div>
                  <div>
                    <div class="font-bold text-white">{{ worker.name }}</div>
                    <div class="text-[10px] text-slate-500 font-mono">{{ worker.workerId }}</div>
                  </div>
                </td>
                <td class="py-3">
                  <div class="font-semibold text-slate-200">{{ worker.role }}</div>
                  <div class="text-[10px] text-slate-400">{{ worker.skillLevel }}</div>
                </td>
                <td class="py-3 text-slate-300">{{ worker.assignedProjectName }}</td>
                <td class="py-3 font-mono text-slate-400">{{ worker.checkInTime || '—' }}</td>
                <td class="py-3 font-mono text-white">
                  {{ worker.hoursWorkedToday }}h
                  <span *ngIf="worker.overtimeHoursToday > 0" class="text-amber-400 text-[10px] font-bold"> (+{{ worker.overtimeHoursToday }}h OT)</span>
                </td>
                <td class="py-3 font-mono font-bold text-emerald-400">₹{{ worker.dailyWage | number }}</td>
                <td class="py-3">
                  <span [ngClass]="getAttendanceBadge(worker.attendanceStatus)">
                    {{ worker.attendanceStatus }}
                  </span>
                </td>
                <td class="py-3">
                  <div class="flex items-center gap-1.5">
                    <button
                      (click)="setAttendance(worker.id, 'Present')"
                      class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]"
                    >
                      Present
                    </button>
                    <button
                      (click)="setAttendance(worker.id, 'Overtime')"
                      class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]"
                    >
                      OT
                    </button>
                    <button
                      (click)="setAttendance(worker.id, 'Absent')"
                      class="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px]"
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ENROLL NEW WORKER MODAL -->
      <div *ngIf="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div class="w-full max-w-lg bg-[#0E1624] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 class="text-lg font-bold text-white">Enroll Site Worker</h3>
            <button (click)="isAddModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (submit)="addWorkerSubmit($event)" class="space-y-3 text-xs">
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Full Name</label>
              <input type="text" [(ngModel)]="newName" name="name" required placeholder="e.g. Ramesh Chandra" class="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-300 block mb-1">Trade Role</label>
                <select [(ngModel)]="newRole" name="role" class="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/[0.1] text-white">
                  <option value="Mason">Mason</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Machine Operator">Machine Operator</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>

              <div>
                <label class="font-semibold text-slate-300 block mb-1">Skill Tier</label>
                <select [(ngModel)]="newSkill" name="skill" class="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/[0.1] text-white">
                  <option value="Senior">Senior Lead</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Apprentice">Apprentice</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-300 block mb-1">Assigned Site</label>
                <select [(ngModel)]="newProject" name="proj" class="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/[0.1] text-white">
                  <option *ngFor="let p of projectService.projects()" [value]="p.id">{{ p.name }}</option>
                </select>
              </div>

              <div>
                <label class="font-semibold text-slate-300 block mb-1">Daily Wage (₹)</label>
                <input type="number" [(ngModel)]="newWage" name="wage" required class="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white font-mono" />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" (click)="isAddModalOpen = false" class="rb-btn-ghost text-xs">Cancel</button>
              <button type="submit" class="rb-btn-primary text-xs">Enroll Worker</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LabourComponent implements OnInit {
  isAddModalOpen: boolean = false;
  roleFilter: string = 'ALL';

  newName: string = '';
  newRole: WorkerRole = 'Mason';
  newSkill: any = 'Senior';
  newProject: string = 'proj-skyline-01';
  newWage: number = 950;

  constructor(
    public labourService: LabourService,
    public projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  get filteredWorkers(): Worker[] {
    if (this.roleFilter === 'ALL') return this.labourService.workers();
    return this.labourService.workers().filter(w => w.role === this.roleFilter);
  }

  getAttendanceBadge(status: string): string {
    switch (status) {
      case 'Present': return 'badge-green';
      case 'Overtime': return 'badge-amber';
      case 'Absent': return 'badge-red';
      default: return 'badge-green';
    }
  }

  setAttendance(workerId: string, status: 'Present' | 'Absent' | 'Overtime') {
    this.labourService.updateAttendance(workerId, status);
  }

  addWorkerSubmit(event: Event) {
    event.preventDefault();
    const proj = this.projectService.getProjectById(this.newProject);

    this.labourService.addWorker({
      name: this.newName,
      role: this.newRole,
      skillLevel: this.newSkill,
      assignedProjectId: this.newProject,
      assignedProjectName: proj?.name || 'Skyline Heights',
      dailyWage: this.newWage,
      phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
      safetyCertified: true
    });

    this.isAddModalOpen = false;
    this.newName = '';
  }
}
