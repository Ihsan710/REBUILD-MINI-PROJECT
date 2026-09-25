import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

const config: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rebuild_db'
};

let pool: mysql.Pool | null = null;
let isMySqlConnected = false;

// Pre-hashed password for 'password123' (12 salt rounds)
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 12);

// Standard Verified Seed Users
export const INITIAL_VERIFIED_USERS = [
  {
    id: 'usr-ihsan-contractor',
    name: 'Ihsan Al-Mansoor',
    email: 'ihsan@skylinebuilders.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'contractor',
    company_name: 'Skyline Infrastructure & Developers',
    location: 'Indiranagar, Bangalore',
    phone: '+91 98450 12345',
    is_verified: true
  },
  {
    id: 'usr-vikram-contractor',
    name: 'Vikram Mehta',
    email: 'vikram@lntinfra.com',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'contractor',
    company_name: 'Larsen & Toubro Civil Infra',
    location: 'Electronic City, Bangalore',
    phone: '+91 98454 11223',
    is_verified: true
  },
  {
    id: 'usr-arjun-contractor',
    name: 'Arjun Verma',
    email: 'arjun@metrocorp.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'contractor',
    company_name: 'BMRCL Metro Infrastructure Corp',
    location: 'Outer Ring Road, Bangalore',
    phone: '+91 98457 77889',
    is_verified: true
  },
  {
    id: 'usr-rajesh-contractor',
    name: 'Rajesh Kumar',
    email: 'rajesh@greenreclaim.in',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'contractor',
    company_name: 'GreenReclaim C&D Processing Contractor',
    location: 'Whitefield, Bangalore',
    phone: '+91 98451 98765',
    is_verified: true
  },
  {
    id: 'usr-anita-buyer',
    name: 'Anita Desai',
    email: 'anita@ecoblocks.org',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'buyer',
    company_name: 'EcoBlocks Pavers Ltd',
    location: 'Koramangala, Bangalore',
    phone: '+91 98452 55555',
    is_verified: true
  },
  {
    id: 'usr-priya-buyer',
    name: 'Priya Nambiar',
    email: 'priya@greenstructures.co',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'buyer',
    company_name: 'GreenStructures Modular Precast',
    location: 'Sarjapur Road, Bangalore',
    phone: '+91 98456 55667',
    is_verified: true
  },
  {
    id: 'usr-admin-root',
    name: 'System Governance',
    email: 'admin@rebuild.eco',
    password_hash: DEFAULT_PASSWORD_HASH,
    role: 'admin',
    company_name: 'ReBuild Governance Root',
    location: 'Bangalore, India',
    phone: '+91 98453 00000',
    is_verified: true
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-skyline-01',
    name: 'Skyline Heights Commercial Complex',
    code: 'SKH-2026',
    location: 'Indiranagar 100ft Rd, Bangalore',
    city: 'Bangalore',
    coordinates: [12.9716, 77.6412],
    status: 'Active',
    phase: 'Demolition',
    startDate: '2026-01-15',
    totalWasteKg: 5240,
    reusedKg: 2180,
    recycledKg: 1420,
    landfillKg: 1640,
    diversionRate: 68.7,
    activeWorkers: 14,
    machinesAssigned: 4,
    siteManager: 'Ihsan Al-Mansoor',
    budgetSaved: 48500
  },
  {
    id: 'proj-metro-02',
    name: 'Metro Line Extension Pier 44-58',
    code: 'BMR-440',
    location: 'Outer Ring Road, Bellandur, Bangalore',
    city: 'Bangalore',
    coordinates: [12.9352, 77.6834],
    status: 'Active',
    phase: 'Excavation',
    startDate: '2026-02-01',
    totalWasteKg: 18400,
    reusedKg: 11200,
    recycledKg: 5400,
    landfillKg: 1800,
    diversionRate: 90.2,
    activeWorkers: 28,
    machinesAssigned: 7,
    siteManager: 'Ramesh Patel',
    budgetSaved: 162000
  },
  {
    id: 'proj-ecopark-03',
    name: 'EcoPark Sustainable Residential Tower',
    code: 'ECO-901',
    location: 'Whitefield Main Rd, Bangalore',
    city: 'Bangalore',
    coordinates: [12.9698, 77.7499],
    status: 'Active',
    phase: 'Structural',
    startDate: '2025-11-20',
    totalWasteKg: 9100,
    reusedKg: 5800,
    recycledKg: 2400,
    landfillKg: 900,
    diversionRate: 90.1,
    activeWorkers: 18,
    machinesAssigned: 3,
    siteManager: 'Priya Sharma',
    budgetSaved: 84000
  }
];

export const INITIAL_WASTE_RECORDS = [
  {
    id: 'wst-101',
    projectId: 'proj-skyline-01',
    projectName: 'Skyline Heights Commercial Complex',
    material: 'Brick',
    quantityKg: 800,
    condition: 'Reusable',
    phase: 'Demolition',
    imageUrl: '/assets/materials/brick.jpg',
    aiPrediction: {
      detectedMaterial: 'Brick',
      confidence: 94.2,
      inferenceTimeMs: 24,
      modelArchitecture: 'Vision-CNN-CDW-ResNet34 (High-Speed Tensor)',
      isConfirmed: true,
      isUserCorrected: false,
      detectedFeatures: ['Terracotta spectral reflectance', 'Mortar separation alignment', 'Granular porous matrix']
    },
    gpsLocation: { lat: 12.9716, lng: 77.6412, address: 'Indiranagar 100ft Rd, Bangalore' },
    loggedBy: 'Ihsan Al-Mansoor',
    createdAt: '2026-09-01T10:30:00.000Z',
    status: 'Listed on Marketplace',
    notes: 'Clean palletized red masonry from 3rd floor demolition.'
  },
  {
    id: 'wst-102',
    projectId: 'proj-skyline-01',
    projectName: 'Skyline Heights Commercial Complex',
    material: 'Metal',
    quantityKg: 1420,
    condition: 'Recyclable',
    phase: 'Demolition',
    imageUrl: '/assets/materials/metal.jpg',
    aiPrediction: {
      detectedMaterial: 'Metal',
      confidence: 96.1,
      inferenceTimeMs: 22,
      modelArchitecture: 'Vision-CNN-CDW-ResNet34 (High-Speed Tensor)',
      isConfirmed: true,
      isUserCorrected: false,
      detectedFeatures: ['Specular rebar ribs', 'High tensile steel profile', 'Metallic reflectance']
    },
    gpsLocation: { lat: 12.9716, lng: 77.6412, address: 'Indiranagar 100ft Rd, Bangalore' },
    loggedBy: 'Ihsan Al-Mansoor',
    createdAt: '2026-09-01T11:45:00.000Z',
    status: 'Listed on Marketplace',
    notes: 'Structural steel rebar offcuts tied in bundles.'
  },
  {
    id: 'wst-103',
    projectId: 'proj-metro-02',
    projectName: 'Metro Line Extension Pier 44-58',
    material: 'Concrete',
    quantityKg: 3500,
    condition: 'Recyclable',
    phase: 'Excavation',
    imageUrl: '/assets/materials/concrete.jpg',
    aiPrediction: {
      detectedMaterial: 'Concrete',
      confidence: 91.7,
      inferenceTimeMs: 25,
      modelArchitecture: 'Vision-CNN-CDW-ResNet34 (High-Speed Tensor)',
      isConfirmed: true,
      isUserCorrected: false,
      detectedFeatures: ['Cementitious grey matrix', 'Aggregate exposure', 'High fracture toughness']
    },
    gpsLocation: { lat: 12.9352, lng: 77.6834, address: 'Outer Ring Road, Bellandur, Bangalore' },
    loggedBy: 'Ramesh Patel',
    createdAt: '2026-09-01T14:15:00.000Z',
    status: 'Verified',
    notes: 'Demolished pier cap foundation rubble.'
  }
];

export const INITIAL_MARKETPLACE = [
  {
    id: 'mkt-01',
    title: 'Reclaimed Red Clay Bricks (Clean Palletized)',
    material: 'Brick',
    quantityKg: 800,
    condition: 'Reusable',
    pricePerKg: 8,
    isFree: false,
    sellerId: 'usr-ihsan-contractor',
    sellerName: 'Ihsan Al-Mansoor',
    sellerCompany: 'Skyline Infrastructure & Developers',
    sellerPhone: '+91 98450 12345',
    sellerEmail: 'ihsan@skylinebuilders.com',
    locationName: 'Indiranagar 100ft Rd, Bangalore',
    coordinates: [12.9716, 77.6412],
    distanceKm: 4.8,
    imageUrl: '/assets/materials/brick.jpg',
    description: 'Cleaned terracotta masonry, zero mortar residue. Palletized and ready for direct site delivery or masonry re-use.',
    status: 'AVAILABLE',
    viewsCount: 42,
    inquiriesCount: 6,
    createdAt: '2026-09-01T10:35:00.000Z'
  },
  {
    id: 'mkt-02',
    title: 'High-Tensile Steel Rebar Offcuts (Fe-500D)',
    material: 'Metal',
    quantityKg: 1420,
    condition: 'Recyclable',
    pricePerKg: 34,
    isFree: false,
    sellerId: 'usr-rajesh-seller',
    sellerName: 'Rajesh Kumar',
    sellerCompany: 'GreenReclaim Material Yard',
    sellerPhone: '+91 98451 98765',
    sellerEmail: 'rajesh@greenreclaim.in',
    locationName: 'Whitefield Industrial Zone, Bangalore',
    coordinates: [12.9698, 77.7499],
    distanceKm: 14.2,
    imageUrl: '/assets/materials/metal.jpg',
    description: '12mm to 25mm structural steel rebar offcuts. Bundled with crane hook straps. Ideal for induction smelting or reinforcement mesh.',
    status: 'AVAILABLE',
    viewsCount: 88,
    inquiriesCount: 12,
    createdAt: '2026-09-01T11:50:00.000Z'
  },
  {
    id: 'mkt-03',
    title: 'Crushed Concrete Rubble & Sub-Base Aggregate',
    material: 'Concrete',
    quantityKg: 1200,
    condition: 'Reusable',
    pricePerKg: 0,
    isFree: true,
    sellerId: 'usr-ecopark',
    sellerName: 'Priya Sharma',
    sellerCompany: 'EcoPark Development',
    sellerPhone: '+91 98454 22222',
    sellerEmail: 'priya@ecopark.in',
    locationName: 'Sarjapur Rd, Bangalore',
    coordinates: [12.9152, 77.6745],
    distanceKm: 9.6,
    imageUrl: '/assets/materials/concrete.jpg',
    description: 'Graded 40mm down crushed concrete aggregate. Free for immediate site pickup. Perfect for road sub-base and drainage backfill.',
    status: 'AVAILABLE',
    viewsCount: 65,
    inquiriesCount: 9,
    createdAt: '2026-09-01T14:20:00.000Z'
  }
];

export const INITIAL_MACHINES = [
  {
    id: 'mac-01',
    machineId: 'MAC-CAT-320',
    name: 'CAT 320 GC Hydraulic Excavator',
    type: 'Excavator',
    model: 'CAT 320 GC Series',
    operatorName: 'Suresh Gowda',
    assignedProjectId: 'proj-skyline-01',
    assignedProjectName: 'Skyline Heights Commercial Complex',
    status: 'Active',
    workingHours: 1420.5,
    fuelUsageLitersPerHour: 14.2,
    lastMaintenanceDate: '2026-08-15',
    nextServiceDue: '2026-10-01',
    efficiencyScore: 94,
    coordinates: [12.9716, 77.6412]
  },
  {
    id: 'mac-02',
    machineId: 'MAC-JCB-3DX',
    name: 'JCB 3DX Super Backhoe Loader',
    type: 'JCB / Backhoe',
    model: '3DX Super 4WD',
    operatorName: 'Manjunath R.',
    assignedProjectId: 'proj-skyline-01',
    assignedProjectName: 'Skyline Heights Commercial Complex',
    status: 'Active',
    workingHours: 890.0,
    fuelUsageLitersPerHour: 8.5,
    lastMaintenanceDate: '2026-08-20',
    nextServiceDue: '2026-09-25',
    efficiencyScore: 91,
    coordinates: [12.9720, 77.6415]
  },
  {
    id: 'mac-03',
    machineId: 'MAC-TEREX-J11',
    name: 'Terex Finlay J-1175 Jaw Crusher',
    type: 'Mobile Crusher',
    model: 'Finlay J-1175 High Capacity',
    operatorName: 'Karthik Rao',
    assignedProjectId: 'proj-metro-02',
    assignedProjectName: 'Metro Line Extension Pier 44-58',
    status: 'Active',
    workingHours: 2150.0,
    fuelUsageLitersPerHour: 24.0,
    lastMaintenanceDate: '2026-08-10',
    nextServiceDue: '2026-09-30',
    efficiencyScore: 96,
    coordinates: [12.9352, 77.6834]
  }
];

export const INITIAL_WORKERS = [
  {
    id: 'wkr-01',
    workerId: 'WKR-MSN-101',
    name: 'Govindappa Naik',
    role: 'Senior Mason',
    skillLevel: 'Expert',
    assignedProjectId: 'proj-skyline-01',
    assignedProjectName: 'Skyline Heights Commercial Complex',
    attendanceStatus: 'Present',
    checkInTime: '07:45 AM',
    hoursWorkedToday: 8.0,
    overtimeHoursToday: 1.5,
    dailyWage: 950,
    phone: '+91 98450 11001',
    safetyCertified: true
  },
  {
    id: 'wkr-02',
    workerId: 'WKR-OPR-102',
    name: 'Suresh Gowda',
    role: 'Excavator Operator',
    skillLevel: 'Certified Class A',
    assignedProjectId: 'proj-skyline-01',
    assignedProjectName: 'Skyline Heights Commercial Complex',
    attendanceStatus: 'Present',
    checkInTime: '08:00 AM',
    hoursWorkedToday: 8.0,
    overtimeHoursToday: 0.0,
    dailyWage: 1200,
    phone: '+91 98450 11002',
    safetyCertified: true
  },
  {
    id: 'wkr-03',
    workerId: 'WKR-CRP-103',
    name: 'Anand Kumar',
    role: 'Formwork Carpenter',
    skillLevel: 'Senior',
    assignedProjectId: 'proj-skyline-01',
    assignedProjectName: 'Skyline Heights Commercial Complex',
    attendanceStatus: 'Present',
    checkInTime: '08:05 AM',
    hoursWorkedToday: 8.0,
    overtimeHoursToday: 2.0,
    dailyWage: 900,
    phone: '+91 98450 11003',
    safetyCertified: true
  }
];

// Physical Disk Database File Path
const DB_FILE_PATH = path.resolve(__dirname, '../../database/data_store.json');

export const memoryStore = {
  users: [...INITIAL_VERIFIED_USERS],
  projects: [...INITIAL_PROJECTS],
  wasteRecords: [...INITIAL_WASTE_RECORDS],
  marketplaceListings: [...INITIAL_MARKETPLACE],
  buyerRequests: [] as any[],
  machines: [...INITIAL_MACHINES],
  workers: [...INITIAL_WORKERS],
  auditLogs: [] as any[]
};

// Permanent Disk Save
export function saveToDisk() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB Disk Save Error]', err);
  }
}

// Load from Permanent Disk
export function loadFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const loaded = JSON.parse(raw);
      if (loaded.users) memoryStore.users = loaded.users;
      if (loaded.projects) memoryStore.projects = loaded.projects;
      if (loaded.wasteRecords) memoryStore.wasteRecords = loaded.wasteRecords;
      if (loaded.marketplaceListings) memoryStore.marketplaceListings = loaded.marketplaceListings;
      if (loaded.buyerRequests) memoryStore.buyerRequests = loaded.buyerRequests;
      if (loaded.machines) memoryStore.machines = loaded.machines;
      if (loaded.workers) memoryStore.workers = loaded.workers;
      if (loaded.auditLogs) memoryStore.auditLogs = loaded.auditLogs;
      console.log(`[Database Engine] Successfully loaded persisted data store from ${DB_FILE_PATH}`);
    } else {
      saveToDisk();
      console.log(`[Database Engine] Initialized new persistent data store at ${DB_FILE_PATH}`);
    }
  } catch (err) {
    console.error('[DB Disk Load Error]', err);
  }
}

export async function initDatabase(): Promise<boolean> {
  // 1. First ensure physical disk storage is loaded
  loadFromDisk();

  try {
    // 2. Try MySQL connection
    const tempConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    console.log(`[MySQL] Connected successfully to database: ${config.database}`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('contractor', 'seller', 'buyer', 'admin') NOT NULL DEFAULT 'contractor',
        company_name VARCHAR(255) NOT NULL,
        avatar_url TEXT,
        location VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    for (const u of memoryStore.users) {
      await conn.query(`
        INSERT INTO users (id, name, email, password_hash, role, company_name, location, phone, is_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role);
      `, [u.id, u.name, u.email, u.password_hash, u.role, u.company_name, u.location, u.phone, true]);
    }

    conn.release();
    isMySqlConnected = true;
    return true;
  } catch (error: any) {
    console.log(`[Database Notice] MySQL server connection not active on localhost:3306. Operating with Permanent Physical Disk File Database (${DB_FILE_PATH}).`);
    isMySqlConnected = false;
    return false;
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (isMySqlConnected && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (e) {
      console.error('[MySQL Query Error]', e);
    }
  }
  return [];
}

export function isDbConnected(): boolean {
  return isMySqlConnected;
}
