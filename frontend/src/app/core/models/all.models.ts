export type UserRole = 'contractor' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  avatarUrl?: string;
  location: string;
  phone?: string;
  isVerified: boolean;
  token?: string;
}

export type MaterialCategory = 
  | 'Brick' 
  | 'Concrete' 
  | 'Metal' 
  | 'Wood' 
  | 'Drywall' 
  | 'Ceramic' 
  | 'Asphalt' 
  | 'Glass' 
  | 'Plastic' 
  | 'Cabling' 
  | 'Roofing' 
  | 'Stone' 
  | 'Mixed'
  | 'Unknown';

export type MaterialCondition = 'Reusable' | 'Recyclable' | 'Landfill-only';

export type ProjectPhase = 'Demolition' | 'Excavation' | 'Structural' | 'Finishing' | 'Fit-out';

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  city: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'Active' | 'Planning' | 'Completed' | 'On Hold';
  phase: ProjectPhase;
  startDate: string;
  totalWasteKg: number;
  reusedKg: number;
  recycledKg: number;
  landfillKg: number;
  diversionRate: number; // percentage
  activeWorkers: number;
  machinesAssigned: number;
  siteManager: string;
  budgetSaved: number; // in currency
}

export interface VolumetricEstimate {
  estimatedVolumeM3: number;
  bulkDensityKgM3: number;
  suggestedWeightKg: number;
  pileGeometry: string;
  packingFactor: number;
}

export interface HazardAssessment {
  isContaminated: boolean;
  hazardLevel: 'None' | 'Low' | 'Moderate' | 'Hazardous';
  warnings: string[];
}

export interface AIPredictionResult {
  detectedMaterial: MaterialCategory;
  confidence: number; // 0 to 100
  isValidMaterial: boolean; // false when image is non-construction / notebook / fake
  rejectionReason?: string;
  secondaryPrediction?: { material: MaterialCategory; confidence: number };
  detectedFeatures: string[];
  boundingBox?: { x: number; y: number; width: number; height: number };
  isConfirmed: boolean;
  confirmedMaterial?: MaterialCategory;
  isUserCorrected: boolean;
  inferenceTimeMs: number;
  modelArchitecture: string;
  volumetricEstimate?: VolumetricEstimate;
  hazardAssessment?: HazardAssessment;
}

export interface WasteRecord {
  id: string;
  projectId: string;
  projectName: string;
  material: MaterialCategory;
  quantityKg: number;
  condition: MaterialCondition;
  phase: ProjectPhase;
  imageUrl: string;
  aiPrediction: AIPredictionResult;
  gpsLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  loggedBy: string;
  createdAt: string;
  status: 'Verified' | 'Pending Review' | 'Listed on Marketplace' | 'Recycled';
  notes?: string;
  marketplaceListingId?: string;
  wtnCode?: string;
  carrierVehicle?: string;
  destinationFacility?: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  material: MaterialCategory;
  quantityKg: number;
  condition: MaterialCondition;
  pricePerKg: number; // 0 = Free
  isFree: boolean;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  sellerPhone: string;
  sellerEmail: string;
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  distanceKm?: number; // calculated relative to active buyer/user
  imageUrl: string;
  description: string;
  status: 'AVAILABLE' | 'MATCHED' | 'CLOSED';
  createdAt: string;
  wasteRecordId?: string;
  viewsCount: number;
  inquiriesCount: number;
}

export interface BuyerRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  material: MaterialCategory;
  quantityRequestedKg: number;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerCoordinates: [number, number];
  distanceKm: number;
  status: 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  requestDate: string;
  offerPriceTotal: number;
  deliveryOption: 'Self Pickup' | 'Shared Logistics' | 'Direct Delivery';
}

export type MachineType = 'Excavator' | 'JCB' | 'Concrete Mixer' | 'Crane' | 'Truck' | 'Generator' | 'Crusher';

export type MachineStatus = 'Active' | 'Available' | 'Under Maintenance';

export interface Machine {
  id: string;
  machineId: string; // e.g. "EXC-320D-01"
  name: string;
  type: MachineType;
  model: string;
  operatorName: string;
  assignedProjectId?: string;
  assignedProjectName?: string;
  status: MachineStatus;
  workingHours: number;
  fuelUsageLitersPerHour: number;
  lastMaintenanceDate: string;
  nextServiceDue: string;
  efficiencyScore: number; // 0 to 100
  coordinates: [number, number];
}

export type WorkerRole = 'Mason' | 'Carpenter' | 'Electrician' | 'Plumber' | 'Helper' | 'Machine Operator' | 'Site Engineer';

export interface Worker {
  id: string;
  workerId: string; // e.g. "WKR-104"
  name: string;
  role: WorkerRole;
  skillLevel: 'Senior' | 'Intermediate' | 'Apprentice';
  assignedProjectId: string;
  assignedProjectName: string;
  attendanceStatus: 'Present' | 'Absent' | 'Overtime';
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorkedToday: number;
  overtimeHoursToday: number;
  dailyWage: number;
  phone: string;
  safetyCertified: boolean;
}

export interface ImpactDashboardData {
  totalWasteGeneratedKg: number;
  totalWasteDivertedKg: number;
  totalReusedKg: number;
  totalRecycledKg: number;
  totalLandfilledKg: number;
  diversionRatePercent: number;
  co2AvoidedKg: number; // Demo data label
  landfillAvoidedM3: number;
  budgetSavedCurrency: number;
  sustainabilityScore: number; // 0 to 100 circular index
  materialBreakdown: {
    material: MaterialCategory;
    weightKg: number;
    percentage: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    divertedKg: number;
    landfillKg: number;
    co2AvoidedKg: number;
  }[];
}

export interface AIModelEvaluationMetrics {
  totalInferences: number;
  averageConfidencePercent: number;
  mostDetectedMaterial: MaterialCategory;
  userCorrectionRatePercent: number;
  totalConfirmed: number;
  totalCorrected: number;
  modelLatencyMs: number;
  modelName: string;
  modelVersion: string;
  confusionMatrix: {
    actual: MaterialCategory;
    predicted: MaterialCategory;
    count: number;
  }[];
  materialAccuracy: {
    material: MaterialCategory;
    accuracyPercent: number;
    sampleCount: number;
  }[];
}
