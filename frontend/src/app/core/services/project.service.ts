import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../models/all.models';
import { ToastService } from './toast.service';

const API_BASE = 'http://localhost:8000/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>([]);
  readonly projects = this.projectsSignal.asReadonly();
  readonly isLoading = signal<boolean>(false);

  readonly totalWasteAllProjectsKg = computed(() =>
    this.projectsSignal().reduce((sum, p) => sum + p.totalWasteKg, 0)
  );

  readonly totalReusedAllProjectsKg = computed(() =>
    this.projectsSignal().reduce((sum, p) => sum + p.reusedKg, 0)
  );

  readonly totalRecycledAllProjectsKg = computed(() =>
    this.projectsSignal().reduce((sum, p) => sum + p.recycledKg, 0)
  );

  readonly totalLandfilledAllProjectsKg = computed(() =>
    this.projectsSignal().reduce((sum, p) => sum + p.landfillKg, 0)
  );

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading.set(true);
    this.http.get<Project[]>(`${API_BASE}/projects`).subscribe({
      next: (data) => {
        this.projectsSignal.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        // Retrieve local if API is unreachable
        const saved = localStorage.getItem('rebuild_projects');
        if (saved) {
          try {
            this.projectsSignal.set(JSON.parse(saved));
          } catch (e) {}
        }
        this.isLoading.set(false);
      }
    });
  }

  getProjectById(id: string): Project | undefined {
    return this.projectsSignal().find(p => p.id === id);
  }

  addProject(projectData: Omit<Project, 'id' | 'totalWasteKg' | 'reusedKg' | 'recycledKg' | 'landfillKg' | 'diversionRate' | 'budgetSaved'>): Project {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Math.random().toString(36).substring(2, 8),
      totalWasteKg: 0,
      reusedKg: 0,
      recycledKg: 0,
      landfillKg: 0,
      diversionRate: 100,
      budgetSaved: 0
    };

    // Optimistic UI update
    this.projectsSignal.update(list => [newProject, ...list]);
    localStorage.setItem('rebuild_projects', JSON.stringify(this.projectsSignal()));

    this.http.post<Project>(`${API_BASE}/projects`, projectData).subscribe({
      next: (created) => {
        this.projectsSignal.update(list => list.map(p => p.id === newProject.id ? created : p));
        this.toast.success('Project Created', `${created.name} registered in MySQL.`);
      },
      error: () => {
        this.toast.success('Project Created', `${newProject.name} saved locally.`);
      }
    });

    return newProject;
  }

  updateProjectStats(projectId: string, wasteAddedKg: number, condition: 'Reusable' | 'Recyclable' | 'Landfill-only') {
    this.projectsSignal.update(list =>
      list.map(p => {
        if (p.id !== projectId) return p;
        const total = p.totalWasteKg + wasteAddedKg;
        let reused = p.reusedKg;
        let recycled = p.recycledKg;
        let landfill = p.landfillKg;

        if (condition === 'Reusable') reused += wasteAddedKg;
        else if (condition === 'Recyclable') recycled += wasteAddedKg;
        else landfill += wasteAddedKg;

        const diverted = reused + recycled;
        const diversionRate = total > 0 ? +((diverted / total) * 100).toFixed(1) : 100;
        const budgetSaved = p.budgetSaved + (condition === 'Reusable' ? wasteAddedKg * 8.5 : wasteAddedKg * 3.2);

        return {
          ...p,
          totalWasteKg: total,
          reusedKg: reused,
          recycledKg: recycled,
          landfillKg: landfill,
          diversionRate,
          budgetSaved: Math.round(budgetSaved)
        };
      })
    );
    localStorage.setItem('rebuild_projects', JSON.stringify(this.projectsSignal()));
  }
}
