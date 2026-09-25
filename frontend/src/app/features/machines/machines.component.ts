import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MachineService } from '../../core/services/machine.service';
import { ProjectService } from '../../core/services/project.service';
import { ToastService } from '../../core/services/toast.service';
import { Machine, MachineType, MachineStatus } from '../../core/models/all.models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            HEAVY FLEET TELEMATICS & MAINTENANCE
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Equipment & Machinery Management</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-0.5">Track hydraulic excavators, batch mixers, tower cranes, and tippers across active sites.</p>
        </div>

        <button (click)="isAddModalOpen = true" class="rb-btn-primary text-xs shadow-lg shadow-emerald-500/10">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Register Machine
        </button>
      </div>

      <!-- FLEET METRICS STRIP -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <app-stat-card
          label="ACTIVE MACHINES"
          [value]="machineService.activeMachines()"
          unit="units"
          subtitle="Operating on active job sites"
          variant="emerald"
        ></app-stat-card>

        <app-stat-card
          label="AVAILABLE"
          [value]="machineService.availableMachines()"
          unit="units"
          subtitle="Ready for redeployment"
          variant="blue"
        ></app-stat-card>

        <app-stat-card
          label="UNDER MAINTENANCE"
          [value]="machineService.maintenanceMachines()"
          unit="units"
          subtitle="Service bay / repair"
          variant="amber"
        ></app-stat-card>

        <app-stat-card
          label="TOTAL WORKING HOURS"
          [value]="machineService.totalWorkingHours() | number"
          unit="hrs"
          subtitle="Fleet cumulative operation"
          variant="slate"
        ></app-stat-card>
      </div>

      <!-- MACHINE STATUS CARDS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          *ngFor="let m of machineService.machines()"
          (click)="selectMachine(m)"
          class="rb-card p-5 cursor-pointer hover:border-amber-500/40 transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">{{ m.machineId }} • {{ m.type }}</span>
                <h3 class="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">{{ m.name }}</h3>
              </div>
              <span [ngClass]="getStatusBadgeClass(m.status)">
                {{ m.status }}
              </span>
            </div>

            <div class="text-xs text-slate-300 mt-2 space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-slate-500">Operator:</span>
                <span class="font-medium text-slate-200">{{ m.operatorName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-slate-500">Assigned:</span>
                <span class="text-slate-300 truncate">{{ m.assignedProjectName || 'Depot Reserve' }}</span>
              </div>
            </div>
          </div>

          <!-- Telemetry Footer -->
          <div class="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-white/[0.08] text-center text-xs font-mono">
            <div class="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
              <div class="text-[9px] text-slate-500 uppercase">Hours</div>
              <div class="font-bold text-white mt-0.5">{{ m.workingHours }}h</div>
            </div>
            <div class="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
              <div class="text-[9px] text-slate-500 uppercase">Fuel Burn</div>
              <div class="font-bold text-amber-400 mt-0.5">{{ m.fuelUsageLitersPerHour }} L/h</div>
            </div>
            <div class="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
              <div class="text-[9px] text-slate-500 uppercase">Efficiency</div>
              <div class="font-bold text-emerald-400 mt-0.5">{{ m.efficiencyScore }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MACHINE DETAIL MODAL -->
      <div *ngIf="selectedMachine" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" (click)="selectedMachine = null">
        <div class="w-full max-w-2xl bg-[#0E1624] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-6" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-amber-400 font-bold uppercase">{{ selectedMachine.machineId }}</span>
                <span [ngClass]="getStatusBadgeClass(selectedMachine.status)">{{ selectedMachine.status }}</span>
              </div>
              <h2 class="text-xl font-bold text-white mt-1">{{ selectedMachine.name }}</h2>
              <p class="text-xs text-slate-400">Model: {{ selectedMachine.model }} • Type: {{ selectedMachine.type }}</p>
            </div>
            <button (click)="selectedMachine = null" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div class="text-[10px] text-slate-500">OPERATOR</div>
                <div class="text-sm font-bold text-white mt-1">{{ selectedMachine.operatorName }}</div>
              </div>
              <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div class="text-[10px] text-slate-500">WORKING HOURS</div>
                <div class="text-sm font-bold text-white mt-1">{{ selectedMachine.workingHours }} hrs</div>
              </div>
              <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div class="text-[10px] text-slate-500">LAST SERVICE</div>
                <div class="text-sm font-bold text-slate-300 mt-1">{{ selectedMachine.lastMaintenanceDate }}</div>
              </div>
              <div class="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div class="text-[10px] text-slate-500">NEXT DUE</div>
                <div class="text-sm font-bold text-amber-400 mt-1">{{ selectedMachine.nextServiceDue }}</div>
              </div>
            </div>

            <!-- Maintenance Timeline -->
            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <h4 class="font-bold text-white text-xs">Preventive Maintenance Timeline</h4>
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between text-slate-300">
                  <span>• 500h Hydraulic filter replacement & oil flush</span>
                  <span class="text-emerald-400 font-mono">COMPLETED</span>
                </div>
                <div class="flex items-center justify-between text-slate-300">
                  <span>• Track tension calibration & sprocket audit</span>
                  <span class="text-emerald-400 font-mono">COMPLETED</span>
                </div>
                <div class="flex items-center justify-between text-slate-300">
                  <span>• Boom cylinder pressure seal check (Next)</span>
                  <span class="text-amber-400 font-mono">PENDING ({{ selectedMachine.nextServiceDue }})</span>
                </div>
              </div>
            </div>

            <!-- Quick Status Change -->
            <div class="flex items-center justify-between pt-2">
              <span class="text-slate-400">Change Fleet Availability:</span>
              <div class="flex gap-2">
                <button (click)="updateMachineStatus('Active')" class="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Set Active</button>
                <button (click)="updateMachineStatus('Available')" class="px-3 py-1.5 rounded-lg text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20">Set Available</button>
                <button (click)="updateMachineStatus('Under Maintenance')" class="px-3 py-1.5 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">Set Maintenance</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ADD MACHINE MODAL -->
      <div *ngIf="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div class="w-full max-w-lg bg-[#0E1624] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 class="text-lg font-bold text-white">Enroll Equipment in Fleet</h3>
            <button (click)="isAddModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (submit)="addMachineSubmit($event)" class="space-y-3 text-xs">
            <div>
              <label class="font-semibold text-slate-300 block mb-1">Machine Name & Model</label>
              <input type="text" [(ngModel)]="newName" name="name" required placeholder="e.g. Komatsu PC210 Hydraulic Excavator" class="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-300 block mb-1">Equipment Type</label>
                <select [(ngModel)]="newType" name="type" class="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/[0.1] text-white">
                  <option value="Excavator">Excavator</option>
                  <option value="JCB">JCB</option>
                  <option value="Concrete Mixer">Concrete Mixer</option>
                  <option value="Crane">Crane</option>
                  <option value="Truck">Truck</option>
                  <option value="Generator">Generator</option>
                </select>
              </div>

              <div>
                <label class="font-semibold text-slate-300 block mb-1">Assigned Operator</label>
                <input type="text" [(ngModel)]="newOperator" name="op" required placeholder="e.g. Anand Varma" class="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-semibold text-slate-300 block mb-1">Assigned Project</label>
                <select [(ngModel)]="newProject" name="proj" class="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/[0.1] text-white">
                  <option *ngFor="let p of projectService.projects()" [value]="p.id">{{ p.name }}</option>
                </select>
              </div>

              <div>
                <label class="font-semibold text-slate-300 block mb-1">Fuel Consumption (L/h)</label>
                <input type="number" [(ngModel)]="newFuel" name="fuel" required class="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white font-mono" />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" (click)="isAddModalOpen = false" class="rb-btn-ghost text-xs">Cancel</button>
              <button type="submit" class="rb-btn-primary text-xs">Save to Telematics</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MachinesComponent implements OnInit {
  selectedMachine: Machine | null = null;
  isAddModalOpen: boolean = false;

  newName: string = '';
  newType: MachineType = 'Excavator';
  newOperator: string = '';
  newProject: string = 'proj-skyline-01';
  newFuel: number = 18.0;

  constructor(
    public machineService: MachineService,
    public projectService: ProjectService,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  selectMachine(m: Machine) {
    this.selectedMachine = m;
  }

  getStatusBadgeClass(status: MachineStatus): string {
    switch (status) {
      case 'Active': return 'badge-green';
      case 'Available': return 'badge-blue';
      case 'Under Maintenance': return 'badge-amber';
    }
  }

  updateMachineStatus(status: MachineStatus) {
    if (!this.selectedMachine) return;
    this.machineService.updateStatus(this.selectedMachine.id, status);
    this.selectedMachine.status = status;
  }

  addMachineSubmit(event: Event) {
    event.preventDefault();
    const proj = this.projectService.getProjectById(this.newProject);
    const num = Math.floor(100 + Math.random() * 900);

    this.machineService.addMachine({
      machineId: `MAC-${num}`,
      name: this.newName,
      type: this.newType,
      model: `${this.newType} Pro-Series`,
      operatorName: this.newOperator,
      assignedProjectId: this.newProject,
      assignedProjectName: proj?.name || 'Skyline Heights',
      status: 'Active',
      workingHours: 120,
      fuelUsageLitersPerHour: this.newFuel,
      lastMaintenanceDate: new Date().toISOString().slice(0, 10),
      nextServiceDue: '2026-10-15',
      efficiencyScore: 92,
      coordinates: [12.9716, 77.6412]
    });

    this.isAddModalOpen = false;
    this.newName = '';
    this.newOperator = '';
  }
}
