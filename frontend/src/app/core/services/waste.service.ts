import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WasteRecord, MaterialCategory, MaterialCondition, ProjectPhase, AIPredictionResult } from '../models/all.models';
import { ProjectService } from './project.service';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class WasteService {
  private recordsSignal = signal<WasteRecord[]>([]);
  readonly records = this.recordsSignal.asReadonly();
  readonly isLoading = signal<boolean>(false);

  readonly totalWasteLoggedKg = computed(() =>
    this.recordsSignal().reduce((sum, r) => sum + r.quantityKg, 0)
  );

  readonly totalReusedKg = computed(() =>
    this.recordsSignal()
      .filter(r => r.condition === 'Reusable')
      .reduce((sum, r) => sum + r.quantityKg, 0)
  );

  readonly totalRecycledKg = computed(() =>
    this.recordsSignal()
      .filter(r => r.condition === 'Recyclable')
      .reduce((sum, r) => sum + r.quantityKg, 0)
  );

  readonly totalLandfilledKg = computed(() =>
    this.recordsSignal()
      .filter(r => r.condition === 'Landfill-only')
      .reduce((sum, r) => sum + r.quantityKg, 0)
  );

  readonly totalDivertedKg = computed(() =>
    this.totalReusedKg() + this.totalRecycledKg()
  );

  readonly diversionRate = computed(() => {
    const total = this.totalWasteLoggedKg();
    if (total === 0) return 0;
    return +((this.totalDivertedKg() / total) * 100).toFixed(1);
  });

  constructor(
    private http: HttpClient,
    private projectService: ProjectService,
    private toast: ToastService
  ) {
    this.loadWasteRecords();
  }

  loadWasteRecords() {
    this.isLoading.set(true);
    this.http.get<WasteRecord[]>(`${API_BASE}/waste`).subscribe({
      next: (data) => {
        this.recordsSignal.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        const saved = localStorage.getItem('rebuild_waste_records');
        if (saved) {
          try {
            this.recordsSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
        this.isLoading.set(false);
      }
    });
  }

  logWaste(recordData: Omit<WasteRecord, 'id' | 'createdAt' | 'status'>): WasteRecord {
    const newRecord: WasteRecord = {
      ...recordData,
      id: 'wst-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      status: recordData.condition === 'Reusable' ? 'Listed on Marketplace' : 'Verified'
    };

    // Optimistic UI update
    this.recordsSignal.update(list => [newRecord, ...list]);
    localStorage.setItem('rebuild_waste_records', JSON.stringify(this.recordsSignal()));

    // Update project stats
    this.projectService.updateProjectStats(
      newRecord.projectId,
      newRecord.quantityKg,
      newRecord.condition
    );

    this.http.post<WasteRecord>(`${API_BASE}/waste`, recordData).subscribe({
      next: (created) => {
        this.recordsSignal.update(list => list.map(r => r.id === newRecord.id ? created : r));
        this.toast.success('Waste Logged to MySQL', `${created.quantityKg} kg of ${created.material} recorded.`);
      },
      error: () => {
        this.toast.success('Waste Logged', `${newRecord.quantityKg} kg of ${newRecord.material} recorded locally.`);
      }
    });

    return newRecord;
  }

  confirmAIPrediction(recordId: string, confirmedMaterial: MaterialCategory, isCorrected: boolean) {
    this.recordsSignal.update(list =>
      list.map(r => {
        if (r.id !== recordId) return r;
        return {
          ...r,
          material: confirmedMaterial,
          aiPrediction: {
            ...r.aiPrediction,
            isConfirmed: true,
            confirmedMaterial,
            isUserCorrected: isCorrected
          }
        };
      })
    );
    localStorage.setItem('rebuild_waste_records', JSON.stringify(this.recordsSignal()));
    this.toast.info('Model Feedback Captured', 'Evaluation dataset updated with human confirmation.');
  }

  exportToCSV(): string {
    const headers = ['ID', 'Project', 'Material', 'Quantity (kg)', 'Condition', 'Phase', 'AI Prediction', 'Confidence (%)', 'GPS Location', 'Date', 'Status'];
    const rows = this.recordsSignal().map(r => [
      r.id,
      `"${r.projectName}"`,
      r.material,
      r.quantityKg,
      r.condition,
      r.phase,
      r.aiPrediction.detectedMaterial,
      r.aiPrediction.confidence,
      `"${r.gpsLocation.address}"`,
      r.createdAt,
      r.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ReBuild_Waste_Audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toast.success('Report Exported', 'CSV waste manifest downloaded.');
    return csvContent;
  }
}
