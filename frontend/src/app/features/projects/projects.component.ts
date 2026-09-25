import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { WasteService } from '../../core/services/waste.service';
import { MachineService } from '../../core/services/machine.service';
import { LabourService } from '../../core/services/labour.service';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { Project, WasteRecord, Machine, Worker, MarketplaceListing } from '../../core/models/all.models';
import { BadgeComponent } from '../../shared/components/badge.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-[#1C1917]">
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DBD1]">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono text-[#16A34A] font-bold mb-1">
            <span class="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            PORTFOLIO SITE MANAGEMENT
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">Active Construction Projects</h1>
          <p class="text-xs sm:text-sm text-[#78716C] mt-0.5">Manage job sites, waste diversion milestones, equipment, and crews.</p>
        </div>

        <button (click)="openCreateModal()" class="rb-btn-primary text-xs self-start sm:self-auto shadow cursor-pointer">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Project
        </button>
      </div>

      <!-- PROJECT CARDS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          *ngFor="let project of projectService.projects()"
          (click)="selectProject(project)"
          class="rb-card p-6 cursor-pointer hover:border-[#C5B7A5] transition-all duration-200 group relative flex flex-col justify-between"
        >
          <!-- Top Row: Name & Status -->
          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-[#78716C] font-bold">{{ project.code }} • {{ project.phase }}</span>
                <h3 class="text-lg font-bold text-[#1C1917] group-hover:text-[#D4A373] transition-colors mt-0.5">{{ project.name }}</h3>
              </div>
              <span class="badge-green">{{ project.status }}</span>
            </div>

            <!-- Location & Site Manager -->
            <div class="flex items-center gap-4 text-xs text-[#78716C] mb-6">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {{ project.location }}
              </span>
              <span>•</span>
              <span>Manager: {{ project.siteManager }}</span>
            </div>
          </div>

          <!-- Bottom Telemetry Grid -->
          <div class="grid grid-cols-4 gap-3 pt-4 border-t border-[#E5DFD7] text-center">
            <div class="p-2.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div class="text-[10px] uppercase font-mono text-[#78716C]">Waste Gen</div>
              <div class="text-sm font-bold text-[#1C1917] font-mono mt-0.5">{{ project.totalWasteKg | number }} kg</div>
            </div>

            <div class="p-2.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div class="text-[10px] uppercase font-mono text-[#78716C]">Diversion</div>
              <div class="text-sm font-bold text-[#16A34A] font-mono mt-0.5">{{ project.diversionRate }}%</div>
            </div>

            <div class="p-2.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div class="text-[10px] uppercase font-mono text-[#78716C]">Workers</div>
              <div class="text-sm font-bold text-[#1C1917] font-mono mt-0.5">{{ project.activeWorkers }}</div>
            </div>

            <div class="p-2.5 rounded-xl bg-[#F9F7F4] border border-[#E5DFD7]">
              <div class="text-[10px] uppercase font-mono text-[#78716C]">Machines</div>
              <div class="text-sm font-bold text-[#D97706] font-mono mt-0.5">{{ project.machinesAssigned }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROJECT DETAIL FULL VIEW MODAL / SHEET WITH 6 TABS -->
      <div *ngIf="selectedProj" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedProj = null">
        <div class="w-full max-w-4xl max-h-[90vh] bg-white border border-[#E5DFD7] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#1C1917]" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="p-6 border-b border-[#E5DFD7] flex items-start justify-between bg-[#F9F7F4]">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-[#16A34A] font-bold uppercase">{{ selectedProj.code }}</span>
                <span class="badge-green">{{ selectedProj.status }}</span>
                <span class="text-xs text-[#78716C]">• {{ selectedProj.phase }} Phase</span>
              </div>
              <h2 class="text-2xl font-bold text-[#1C1917] mt-1">{{ selectedProj.name }}</h2>
              <p class="text-xs text-[#78716C]">{{ selectedProj.location }} • Lead: {{ selectedProj.siteManager }}</p>
            </div>
            <button (click)="selectedProj = null" class="p-2 text-[#78716C] hover:text-[#1C1917] rounded-lg">
              ✕
            </button>
          </div>

          <!-- TAB NAVIGATION STRIP -->
          <div class="flex border-b border-[#E5DFD7] bg-[#F9F7F4] px-6 overflow-x-auto text-xs font-semibold">
            <button
              *ngFor="let tab of ['Overview', 'Waste', 'Marketplace', 'Machines', 'Labour', 'Impact']"
              (click)="activeTab = tab"
              [ngClass]="activeTab === tab ? 'border-[#1C1917] text-[#1C1917] border-b-2 font-bold' : 'text-[#78716C] hover:text-[#1C1917]'"
              class="py-3 px-4 transition-colors whitespace-nowrap cursor-pointer"
            >
              {{ tab }}
            </button>
          </div>

          <!-- TAB CONTENTS -->
          <div class="p-6 overflow-y-auto flex-1 space-y-6">
            <!-- TAB 1: OVERVIEW -->
            <div *ngIf="activeTab === 'Overview'" class="space-y-6">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="text-xs font-mono text-[#78716C]">TOTAL WASTE</div>
                  <div class="text-xl font-bold text-[#1C1917] font-mono mt-1">{{ selectedProj.totalWasteKg | number }} kg</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="text-xs font-mono text-[#78716C]">DIVERSION RATE</div>
                  <div class="text-xl font-bold text-[#16A34A] font-mono mt-1">{{ selectedProj.diversionRate }}%</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="text-xs font-mono text-[#78716C]">SAVINGS VALUE</div>
                  <div class="text-xl font-bold text-[#D97706] font-mono mt-1">₹{{ selectedProj.budgetSaved | number }}</div>
                </div>
                <div class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="text-xs font-mono text-[#78716C]">START DATE</div>
                  <div class="text-xl font-bold text-[#1C1917] font-mono mt-1">{{ selectedProj.startDate }}</div>
                </div>
              </div>

              <div class="p-5 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                <h4 class="text-sm font-bold text-[#1C1917] mb-2">Site Logistics & Operational Notes</h4>
                <p class="text-xs text-[#78716C] leading-relaxed">
                  Active dismantling of structural columns and concrete partition walls. Segregation zone designated at Gate 3. All clean rubble is batched for on-site secondary crushing or marketplace dispatch to prevent municipal landfill fees.
                </p>
              </div>
            </div>

            <!-- TAB 2: WASTE STREAM -->
            <div *ngIf="activeTab === 'Waste'" class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-bold text-[#1C1917]">Waste Records on this Project</h4>
                <a routerLink="/waste" class="text-xs text-[#16A34A] hover:underline font-semibold">+ Log New Material</a>
              </div>

              <div class="divide-y divide-[#E5DFD7]">
                <div *ngFor="let w of getProjectWasteRecords(selectedProj.id)" class="py-3 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <img [src]="w.imageUrl" class="w-10 h-10 rounded-xl object-cover border border-[#E5DFD7]" />
                    <div>
                      <div class="font-bold text-[#1C1917]">{{ w.material }} ({{ w.quantityKg }} kg)</div>
                      <div class="text-[#78716C] text-[11px]">{{ w.condition }} • AI Conf: {{ w.aiPrediction.confidence }}%</div>
                    </div>
                  </div>
                  <span class="badge-green">{{ w.status }}</span>
                </div>
              </div>
            </div>

            <!-- TAB 3: MARKETPLACE -->
            <div *ngIf="activeTab === 'Marketplace'" class="space-y-4">
              <h4 class="text-sm font-bold text-[#1C1917]">Materials Listed from this Site</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div *ngFor="let item of getProjectListings()" class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="text-xs font-bold text-[#1C1917]">{{ item.title }}</div>
                  <div class="text-xs text-[#16A34A] font-mono mt-1 font-bold">{{ item.quantityKg }} kg • ₹{{ item.pricePerKg }}/kg</div>
                  <div class="text-[11px] text-[#78716C] mt-2">{{ item.status }} • {{ item.viewsCount }} views</div>
                </div>
              </div>
            </div>

            <!-- TAB 4: MACHINES -->
            <div *ngIf="activeTab === 'Machines'" class="space-y-4">
              <h4 class="text-sm font-bold text-[#1C1917]">Assigned Heavy Equipment</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div *ngFor="let m of getProjectMachines(selectedProj.id)" class="p-4 rounded-2xl bg-[#F9F7F4] border border-[#E5DFD7]">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-bold text-[#1C1917]">{{ m.name }}</span>
                    <span [ngClass]="m.status === 'Active' ? 'badge-green' : 'badge-amber'">{{ m.status }}</span>
                  </div>
                  <div class="text-xs text-[#78716C] font-mono">{{ m.machineId }} • Op: {{ m.operatorName }}</div>
                  <div class="text-[11px] text-[#78716C] mt-2">Hours: {{ m.workingHours }}h • Fuel: {{ m.fuelUsageLitersPerHour }} L/h</div>
                </div>
              </div>
            </div>

            <!-- TAB 5: LABOUR -->
            <div *ngIf="activeTab === 'Labour'" class="space-y-4">
              <h4 class="text-sm font-bold text-[#1C1917]">Workforce On Site</h4>
              <div class="divide-y divide-[#E5DFD7]">
                <div *ngFor="let w of getProjectWorkers(selectedProj.id)" class="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold text-[#1C1917]">{{ w.name }}</span>
                    <span class="text-[#78716C] ml-2">({{ w.role }} - {{ w.skillLevel }})</span>
                  </div>
                  <div class="flex items-center gap-3 font-mono">
                    <span class="text-[#1C1917] font-semibold">₹{{ w.dailyWage }}/day</span>
                    <span [ngClass]="w.attendanceStatus === 'Present' ? 'badge-green' : 'badge-amber'">{{ w.attendanceStatus }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 6: IMPACT -->
            <div *ngIf="activeTab === 'Impact'" class="space-y-4">
              <h4 class="text-sm font-bold text-[#1C1917]">Site ESG & Environmental Contribution</h4>
              <div class="p-4 rounded-2xl bg-[#EBF7EE] border border-[#DCFCE7] text-xs space-y-2">
                <div class="flex justify-between font-mono">
                  <span class="text-[#1E7E34]">Landfill Waste Avoided:</span>
                  <span class="text-[#1E7E34] font-bold">{{ (selectedProj.reusedKg + selectedProj.recycledKg) | number }} kg</span>
                </div>
                <div class="flex justify-between font-mono">
                  <span class="text-[#1E7E34]">Estimated CO₂ Avoidance:</span>
                  <span class="text-[#1E7E34] font-bold">{{ ((selectedProj.reusedKg + selectedProj.recycledKg) * 0.428) | number:'1.0-0' }} kg CO₂e</span>
                </div>
                <div class="flex justify-between font-mono">
                  <span class="text-[#1E7E34]">Diversion Benchmark Compliance:</span>
                  <span class="text-[#1E7E34] font-bold">Passed (Target > 65%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CREATE NEW PROJECT MODAL -->
      <div *ngIf="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div class="w-full max-w-lg bg-white border border-[#E5DFD7] rounded-3xl shadow-2xl p-6 space-y-4 text-[#1C1917]">
          <div class="flex items-center justify-between pb-3 border-b border-[#E5DFD7]">
            <h3 class="text-lg font-bold text-[#1C1917]">Register New Construction Site</h3>
            <button (click)="isCreateModalOpen = false" class="text-[#78716C] hover:text-[#1C1917]">✕</button>
          </div>

          <form (submit)="createProjectSubmit($event)" class="space-y-3 text-xs">
            <div>
              <label class="font-bold text-[#1C1917] block mb-1">Project Name</label>
              <input type="text" [(ngModel)]="newProjName" name="name" required placeholder="e.g. Phoenix Commercial Hub" class="w-full px-3.5 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]" />
            </div>

            <div>
              <label class="font-bold text-[#1C1917] block mb-1">Site Location & City</label>
              <input type="text" [(ngModel)]="newProjLocation" name="location" required placeholder="e.g. Outer Ring Road, Bangalore" class="w-full px-3.5 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Construction Phase</label>
                <select [(ngModel)]="newProjPhase" name="phase" class="w-full px-3.5 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]">
                  <option value="Demolition">Demolition</option>
                  <option value="Excavation">Excavation</option>
                  <option value="Structural">Structural</option>
                  <option value="Finishing">Finishing</option>
                  <option value="Fit-out">Fit-out</option>
                </select>
              </div>

              <div>
                <label class="font-bold text-[#1C1917] block mb-1">Site Lead / Manager</label>
                <input type="text" [(ngModel)]="newProjManager" name="manager" required placeholder="e.g. Ihsan Al-Mansoor" class="w-full px-3.5 py-2 rounded-xl bg-[#F6F3EF] border border-[#E2DDD5] text-[#1C1917]" />
              </div>
            </div>

            <div class="pt-4 flex justify-end gap-2">
              <button type="button" (click)="isCreateModalOpen = false" class="rb-btn-ghost text-xs">Cancel</button>
              <button type="submit" class="rb-btn-primary text-xs cursor-pointer">Save & Launch Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  selectedProj: Project | null = null;
  activeTab: string = 'Overview';
  isCreateModalOpen: boolean = false;

  newProjName: string = '';
  newProjLocation: string = '';
  newProjPhase: any = 'Demolition';
  newProjManager: string = 'Ihsan Al-Mansoor';

  constructor(
    public projectService: ProjectService,
    private wasteService: WasteService,
    private machineService: MachineService,
    private labourService: LabourService,
    private marketplaceService: MarketplaceService
  ) {}

  ngOnInit() {}

  selectProject(p: Project) {
    this.selectedProj = p;
    this.activeTab = 'Overview';
  }

  getProjectWasteRecords(projectId: string): WasteRecord[] {
    return this.wasteService.records().filter(r => r.projectId === projectId);
  }

  getProjectMachines(projectId: string): Machine[] {
    return this.machineService.machines().filter(m => m.assignedProjectId === projectId);
  }

  getProjectWorkers(projectId: string): Worker[] {
    return this.labourService.workers().filter(w => w.assignedProjectId === projectId);
  }

  getProjectListings(): MarketplaceListing[] {
    return this.marketplaceService.listings().slice(0, 2);
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  createProjectSubmit(event: Event) {
    event.preventDefault();
    this.projectService.addProject({
      name: this.newProjName,
      code: 'PRJ-' + Math.floor(100 + Math.random() * 900),
      location: this.newProjLocation,
      city: 'Bangalore',
      coordinates: [12.9716, 77.5946],
      status: 'Active',
      phase: this.newProjPhase,
      startDate: new Date().toISOString().slice(0, 10),
      activeWorkers: 8,
      machinesAssigned: 2,
      siteManager: this.newProjManager
    });

    this.isCreateModalOpen = false;
    this.newProjName = '';
    this.newProjLocation = '';
  }
}
