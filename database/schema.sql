-- ==========================================================
-- REBUILD PLATFORM - COMPLETE MYSQL RELATIONAL DATABASE SCHEMA
-- Construction & Demolition Waste Intelligence + Circular Marketplace
-- ==========================================================

CREATE DATABASE IF NOT EXISTS rebuild_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rebuild_db;

-- 1. USERS TABLE
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status ENUM('Active', 'Planning', 'Completed', 'On Hold') DEFAULT 'Active',
  phase ENUM('Demolition', 'Excavation', 'Structural', 'Finishing', 'Fit-out') DEFAULT 'Demolition',
  start_date DATE NOT NULL,
  total_waste_kg DECIMAL(12, 2) DEFAULT 0.00,
  reused_kg DECIMAL(12, 2) DEFAULT 0.00,
  recycled_kg DECIMAL(12, 2) DEFAULT 0.00,
  landfill_kg DECIMAL(12, 2) DEFAULT 0.00,
  diversion_rate DECIMAL(5, 2) DEFAULT 100.00,
  active_workers INT DEFAULT 0,
  machines_assigned INT DEFAULT 0,
  site_manager VARCHAR(255) NOT NULL,
  budget_saved DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. WASTE RECORDS & AI CLASSIFICATION MANIFEST TABLE
CREATE TABLE IF NOT EXISTS waste_records (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL,
  material ENUM('Brick', 'Concrete', 'Wood', 'Metal', 'Drywall', 'Plastic', 'Asphalt', 'Ceramic', 'Mixed') NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  material_condition ENUM('Reusable', 'Recyclable', 'Landfill-only') NOT NULL,
  project_phase ENUM('Demolition', 'Excavation', 'Structural', 'Finishing', 'Fit-out') NOT NULL,
  image_url TEXT NOT NULL,
  ai_detected_material VARCHAR(50) NOT NULL,
  ai_confidence DECIMAL(5, 2) NOT NULL,
  ai_inference_time_ms INT NOT NULL DEFAULT 380,
  ai_model_architecture VARCHAR(100) DEFAULT 'Vision-CNN-CDW-ResNet34',
  is_confirmed BOOLEAN DEFAULT TRUE,
  confirmed_material VARCHAR(50),
  is_user_corrected BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address_text VARCHAR(255),
  logged_by VARCHAR(255) NOT NULL,
  status ENUM('Verified', 'Pending Review', 'Listed on Marketplace', 'Recycled') DEFAULT 'Verified',
  marketplace_listing_id VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. MARKETPLACE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  material ENUM('Brick', 'Concrete', 'Wood', 'Metal', 'Drywall', 'Plastic', 'Asphalt', 'Ceramic', 'Mixed') NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  material_condition ENUM('Reusable', 'Recyclable', 'Landfill-only') NOT NULL,
  price_per_kg DECIMAL(10, 2) DEFAULT 0.00,
  is_free BOOLEAN DEFAULT FALSE,
  seller_id VARCHAR(64) NOT NULL,
  seller_name VARCHAR(255) NOT NULL,
  seller_company VARCHAR(255) NOT NULL,
  seller_phone VARCHAR(50),
  seller_email VARCHAR(255),
  location_name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  status ENUM('AVAILABLE', 'MATCHED', 'CLOSED') DEFAULT 'AVAILABLE',
  views_count INT DEFAULT 0,
  inquiries_count INT DEFAULT 0,
  waste_record_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. BUYER PROCUREMENT & DISPATCH REQUESTS TABLE
CREATE TABLE IF NOT EXISTS buyer_requests (
  id VARCHAR(64) PRIMARY KEY,
  listing_id VARCHAR(64) NOT NULL,
  listing_title VARCHAR(255) NOT NULL,
  material VARCHAR(50) NOT NULL,
  quantity_requested_kg DECIMAL(10, 2) NOT NULL,
  buyer_id VARCHAR(64) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_company VARCHAR(255) NOT NULL,
  buyer_latitude DECIMAL(10, 8) NOT NULL,
  buyer_longitude DECIMAL(11, 8) NOT NULL,
  distance_km DECIMAL(8, 2) NOT NULL,
  status ENUM('PENDING', 'ACCEPTED', 'DISPATCHED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  offer_price_total DECIMAL(12, 2) NOT NULL,
  delivery_option ENUM('Self Pickup', 'Shared Logistics', 'Direct Delivery') DEFAULT 'Self Pickup',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. MACHINES & FLEET TELEMATICS TABLE
CREATE TABLE IF NOT EXISTS machines (
  id VARCHAR(64) PRIMARY KEY,
  machine_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  machine_type ENUM('Excavator', 'JCB', 'Concrete Mixer', 'Crane', 'Truck', 'Generator', 'Crusher') NOT NULL,
  model VARCHAR(100) NOT NULL,
  operator_name VARCHAR(255) NOT NULL,
  assigned_project_id VARCHAR(64),
  status ENUM('Active', 'Available', 'Under Maintenance') DEFAULT 'Active',
  working_hours DECIMAL(10, 2) DEFAULT 0.00,
  fuel_usage_liters_per_hour DECIMAL(6, 2) DEFAULT 15.00,
  last_maintenance_date DATE,
  next_service_due DATE,
  efficiency_score INT DEFAULT 90,
  latitude DECIMAL(10, 8) DEFAULT 12.97160000,
  longitude DECIMAL(11, 8) DEFAULT 77.59460000,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. WORKFORCE & LABOUR ROSTER TABLE
CREATE TABLE IF NOT EXISTS workers (
  id VARCHAR(64) PRIMARY KEY,
  worker_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('Mason', 'Carpenter', 'Electrician', 'Plumber', 'Helper', 'Machine Operator', 'Site Engineer') NOT NULL,
  skill_level ENUM('Senior', 'Intermediate', 'Apprentice') DEFAULT 'Intermediate',
  assigned_project_id VARCHAR(64),
  attendance_status ENUM('Present', 'Absent', 'Overtime') DEFAULT 'Present',
  check_in_time VARCHAR(20) DEFAULT '08:00 AM',
  hours_worked_today DECIMAL(4, 2) DEFAULT 8.00,
  overtime_hours_today DECIMAL(4, 2) DEFAULT 0.00,
  daily_wage DECIMAL(10, 2) NOT NULL,
  phone VARCHAR(50),
  safety_certified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. INDEXES FOR HIGH PERFORMANCE QUERYING
CREATE INDEX idx_waste_records_project ON waste_records(project_id);
CREATE INDEX idx_waste_records_material ON waste_records(material);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_material ON marketplace_listings(material);
CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_workers_project ON workers(assigned_project_id);
