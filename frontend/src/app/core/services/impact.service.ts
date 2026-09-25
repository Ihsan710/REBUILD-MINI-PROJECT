import { Injectable, computed } from '@angular/core';
import { WasteService } from './waste.service';
import { ProjectService } from './project.service';
import { MaterialCategory } from '../models/all.models';

const MATERIAL_COLORS: Record<MaterialCategory, string> = {
  Brick: '#F59E0B',
  Concrete: '#94A3B8',
  Metal: '#38BDF8',
  Wood: '#D97706',
  Drywall: '#E2E8F0',
  Ceramic: '#EC4899',
  Asphalt: '#475569',
  Glass: '#06B6D4',
  Plastic: '#10B981',
  Cabling: '#EAB308',
  Roofing: '#3B82F6',
  Stone: '#FB7185',
  Mixed: '#8B5CF6',
  Unknown: '#94A3B8'
};

@Injectable({
  providedIn: 'root'
})
export class ImpactService {
  constructor(
    private wasteService: WasteService,
    private projectService: ProjectService
  ) {}

  readonly totalWasteKg = computed(() => this.wasteService.totalWasteLoggedKg());
  readonly totalReusedKg = computed(() => this.wasteService.totalReusedKg());
  readonly totalRecycledKg = computed(() => this.wasteService.totalRecycledKg());
  readonly totalLandfilledKg = computed(() => this.wasteService.totalLandfilledKg());
  readonly totalDivertedKg = computed(() => this.wasteService.totalDivertedKg());
  readonly diversionRate = computed(() => this.wasteService.diversionRate());

  // Landfill volume avoided: average C&D density is ~1,250 kg/m³
  readonly landfillAvoidedM3 = computed(() => {
    return +(this.totalDivertedKg() / 1250).toFixed(2);
  });

  // Carbon coefficient estimation (embodied carbon offset: ~0.428 kg CO2e per kg diverted C&D material)
  readonly co2AvoidedKg = computed(() => {
    return Math.round(this.totalDivertedKg() * 0.428);
  });

  readonly treesEquivalent = computed(() => {
    return Math.round(this.co2AvoidedKg() / 21.7); // ~21.7 kg CO2 absorbed per tree/year
  });

  // Tipping fee & municipal haulage savings avoided (~₹1,800 per metric ton)
  readonly tippingFeeSavedRupees = computed(() => {
    return Math.round((this.totalDivertedKg() / 1000) * 1800);
  });

  // Circular Sustainability Score: 0 to 100
  readonly sustainabilityScore = computed(() => {
    const rate = this.diversionRate();
    const reuseBonus = this.totalWasteKg() > 0 ? (this.totalReusedKg() / this.totalWasteKg()) * 15 : 10;
    const score = Math.min(98, Math.max(40, Math.round(rate * 0.85 + reuseBonus)));
    return score;
  });

  readonly materialBreakdown = computed(() => {
    const records = this.wasteService.records();
    const map = new Map<MaterialCategory, number>();

    records.forEach(r => {
      map.set(r.material, (map.get(r.material) || 0) + r.quantityKg);
    });

    const total = this.totalWasteKg() || 1;
    const result: { material: MaterialCategory; weightKg: number; percentage: number; color: string }[] = [];

    map.forEach((weightKg, material) => {
      result.push({
        material,
        weightKg,
        percentage: +((weightKg / total) * 100).toFixed(1),
        color: MATERIAL_COLORS[material] || '#94A3B8'
      });
    });

    return result.sort((a, b) => b.weightKg - a.weightKg);
  });
}
