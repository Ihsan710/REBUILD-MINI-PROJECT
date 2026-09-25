import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Worker, WorkerRole } from '../models/all.models';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class LabourService {
  private workersSignal = signal<Worker[]>([]);
  readonly workers = this.workersSignal.asReadonly();
  readonly isLoading = signal<boolean>(false);

  readonly totalWorkers = computed(() => this.workersSignal().length);
  readonly presentToday = computed(() => this.workersSignal().filter(w => w.attendanceStatus === 'Present' || w.attendanceStatus === 'Overtime').length);
  readonly absentToday = computed(() => this.workersSignal().filter(w => w.attendanceStatus === 'Absent').length);
  readonly overtimeWorkers = computed(() => this.workersSignal().filter(w => w.attendanceStatus === 'Overtime').length);
  readonly totalPayrollToday = computed(() =>
    this.workersSignal().reduce((sum, w) => {
      if (w.attendanceStatus === 'Absent') return sum;
      const base = w.dailyWage;
      const ot = (w.overtimeHoursToday * (w.dailyWage / 8) * 1.5);
      return sum + base + ot;
    }, 0)
  );

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    this.loadWorkers();
  }

  loadWorkers() {
    this.isLoading.set(true);
    this.http.get<Worker[]>(`${API_BASE}/workers`).subscribe({
      next: (data) => {
        this.workersSignal.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_workers');
        if (saved) {
          try {
            this.workersSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
        this.isLoading.set(false);
      }
    });
  }

  addWorker(workerData: Omit<Worker, 'id' | 'workerId' | 'attendanceStatus' | 'hoursWorkedToday' | 'overtimeHoursToday'>): Worker {
    const nextNum = this.workersSignal().length + 101;
    const newWorker: Worker = {
      ...workerData,
      id: 'wkr-' + Math.random().toString(36).substring(2, 7),
      workerId: `WKR-${nextNum}`,
      attendanceStatus: 'Present',
      checkInTime: '08:00 AM',
      hoursWorkedToday: 8.0,
      overtimeHoursToday: 0.0
    };

    this.workersSignal.update(list => [newWorker, ...list]);
    localStorage.setItem('rebuild_workers', JSON.stringify(this.workersSignal()));

    this.http.post<Worker>(`${API_BASE}/workers`, workerData).subscribe({
      next: (created) => {
        this.workersSignal.update(list => list.map(w => w.id === newWorker.id ? created : w));
        this.toast.success('Worker Enrolled in MySQL', `${created.name} (${created.role}) registered.`);
      },
      error: () => {
        this.toast.success('Worker Enrolled', `${newWorker.name} registered locally.`);
      }
    });

    return newWorker;
  }

  updateAttendance(workerId: string, status: 'Present' | 'Absent' | 'Overtime', hours: number = 8.0, otHours: number = 0) {
    this.workersSignal.update(list =>
      list.map(w => {
        if (w.id !== workerId) return w;
        return {
          ...w,
          attendanceStatus: status,
          hoursWorkedToday: status === 'Absent' ? 0 : hours,
          overtimeHoursToday: status === 'Overtime' ? otHours || 2.0 : 0,
          checkInTime: status === 'Absent' ? undefined : (w.checkInTime || '08:00 AM')
        };
      })
    );
    localStorage.setItem('rebuild_workers', JSON.stringify(this.workersSignal()));

    this.http.put(`${API_BASE}/workers/${workerId}/attendance`, {
      status,
      hoursWorked: status === 'Absent' ? 0 : hours,
      overtimeHours: status === 'Overtime' ? otHours || 2.0 : 0
    }).subscribe({
      next: () => {
        this.toast.info('Attendance Logged in MySQL', 'Worker ledger synchronized.');
      },
      error: () => {
        this.toast.info('Attendance Logged', 'Worker ledger updated.');
      }
    });
  }
}
