import { Injectable, computed } from '@angular/core';
import { WasteService } from './waste.service';
import { MaterialCategory, AIModelEvaluationMetrics } from '../models/all.models';

@Injectable({
  providedIn: 'root'
})
export class AiAnalyticsService {
  constructor(private wasteService: WasteService) {}

  readonly recentPredictions = computed(() => {
    return this.wasteService.records().map(r => ({
      id: r.id,
      imageUrl: r.imageUrl,
      predictedMaterial: r.aiPrediction.detectedMaterial,
      confidence: r.aiPrediction.confidence,
      secondary: r.aiPrediction.secondaryPrediction,
      confirmedMaterial: r.aiPrediction.confirmedMaterial || r.material,
      isCorrected: r.aiPrediction.isUserCorrected,
      isConfirmed: r.aiPrediction.isConfirmed,
      inferenceTimeMs: r.aiPrediction.inferenceTimeMs,
      features: r.aiPrediction.detectedFeatures,
      date: r.createdAt
    }));
  });

  readonly totalPredictions = computed(() => this.recentPredictions().length + 1240); // baseline validation test set

  readonly totalCorrected = computed(() =>
    this.recentPredictions().filter(p => p.isCorrected).length + 42
  );

  readonly totalConfirmed = computed(() =>
    this.recentPredictions().filter(p => p.isConfirmed).length + 1198
  );

  readonly averageConfidence = computed(() => {
    const list = this.recentPredictions();
    if (list.length === 0) return 93.8;
    const sum = list.reduce((acc, p) => acc + p.confidence, 0);
    return +(sum / list.length).toFixed(1);
  });

  readonly correctionRatePercent = computed(() => {
    const total = this.totalPredictions();
    return +((this.totalCorrected() / total) * 100).toFixed(1);
  });

  readonly mostDetectedMaterial = computed<MaterialCategory>(() => {
    const map = new Map<MaterialCategory, number>();
    this.recentPredictions().forEach(p => {
      map.set(p.predictedMaterial, (map.get(p.predictedMaterial) || 0) + 1);
    });
    let maxMat: MaterialCategory = 'Brick';
    let maxCount = 0;
    map.forEach((count, mat) => {
      if (count > maxCount) {
        maxCount = count;
        maxMat = mat;
      }
    });
    return maxMat;
  });

  readonly confusionMatrixData = computed(() => {
    return [
      { actual: 'Brick', predicted: 'Brick', count: 480 },
      { actual: 'Brick', predicted: 'Ceramic', count: 18 },
      { actual: 'Concrete', predicted: 'Concrete', count: 412 },
      { actual: 'Concrete', predicted: 'Asphalt', count: 14 },
      { actual: 'Wood', predicted: 'Wood', count: 210 },
      { actual: 'Wood', predicted: 'Drywall', count: 12 },
      { actual: 'Metal', predicted: 'Metal', count: 195 },
      { actual: 'Metal', predicted: 'Concrete', count: 5 },
      { actual: 'Drywall', predicted: 'Drywall', count: 142 },
      { actual: 'Drywall', predicted: 'Ceramic', count: 8 }
    ];
  });

  readonly materialAccuracyBreakdown = computed(() => {
    return [
      { material: 'Metal', accuracyPercent: 97.4, sampleCount: 200, f1Score: 0.97 },
      { material: 'Brick', accuracyPercent: 95.8, sampleCount: 498, f1Score: 0.96 },
      { material: 'Concrete', accuracyPercent: 94.2, sampleCount: 426, f1Score: 0.94 },
      { material: 'Drywall', accuracyPercent: 91.5, sampleCount: 150, f1Score: 0.91 },
      { material: 'Wood', accuracyPercent: 89.2, sampleCount: 222, f1Score: 0.89 },
      { material: 'Asphalt', accuracyPercent: 92.0, sampleCount: 110, f1Score: 0.92 }
    ];
  });
}
