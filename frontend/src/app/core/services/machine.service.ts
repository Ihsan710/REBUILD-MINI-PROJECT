import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Machine, MachineType, MachineStatus } from '../models/all.models';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private machinesSignal = signal<Machine[]>([]);
  readonly machines = this.machinesSignal.asReadonly();
  readonly isLoading = signal<boolean>(false);

  readonly totalMachines = computed(() => this.machinesSignal().length);
  readonly activeMachines = computed(() => this.machinesSignal().filter(m => m.status === 'Active').length);
  readonly availableMachines = computed(() => this.machinesSignal().filter(m => m.status === 'Available').length);
  readonly maintenanceMachines = computed(() => this.machinesSignal().filter(m => m.status === 'Under Maintenance').length);
  readonly totalWorkingHours = computed(() => this.machinesSignal().reduce((sum, m) => sum + m.workingHours, 0));

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    this.loadMachines();
  }

  loadMachines() {
    this.isLoading.set(true);
    this.http.get<Machine[]>(`${API_BASE}/machines`).subscribe({
      next: (data) => {
        this.machinesSignal.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_machines');
        if (saved) {
          try {
            this.machinesSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
        this.isLoading.set(false);
      }
    });
  }

  addMachine(machineData: Omit<Machine, 'id'>): Machine {
    const newMachine: Machine = {
      ...machineData,
      id: 'mac-' + Math.random().toString(36).substring(2, 7)
    };

    this.machinesSignal.update(list => [newMachine, ...list]);
    localStorage.setItem('rebuild_machines', JSON.stringify(this.machinesSignal()));

    this.http.post<Machine>(`${API_BASE}/machines`, machineData).subscribe({
      next: (created) => {
        this.machinesSignal.update(list => list.map(m => m.id === newMachine.id ? created : m));
        this.toast.success('Machine Registered in MySQL', `${created.name} added to fleet.`);
      },
      error: () => {
        this.toast.success('Equipment Added', `${newMachine.name} registered locally.`);
      }
    });

    return newMachine;
  }

  updateStatus(machineId: string, status: MachineStatus) {
    this.machinesSignal.update(list =>
      list.map(m => (m.id === machineId ? { ...m, status } : m))
    );
    localStorage.setItem('rebuild_machines', JSON.stringify(this.machinesSignal()));

    this.http.put(`${API_BASE}/machines/${machineId}/status`, { status }).subscribe({
      next: () => {
        this.toast.info('Status Updated', `Machine state updated in MySQL.`);
      },
      error: () => {
        this.toast.info('Status Updated', `Machine state is now ${status}`);
      }
    });
  }
}
