-- ============================================================================
-- PEPL HRMS - UNIFIED DATABASE SCHEMA (PRODUCTION READY)
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Utility Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. ORGANIZATION HIERARCHY

-- Groups Table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  settings JSONB DEFAULT '{"timezone": "Asia/Kolkata", "currency": "INR", "date_format": "DD/MM/YYYY", "fiscal_year_start": "04-01"}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT groups_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_groups_active ON groups(id) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Companies Table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  gstin VARCHAR(15) UNIQUE,
  pan VARCHAR(10) UNIQUE,
  tan VARCHAR(10) UNIQUE,
  pf_registration_number VARCHAR(50),
  esi_registration_number VARCHAR(50),
  professional_tax_number VARCHAR(50),
  labour_welfare_fund_number VARCHAR(50),
  registered_address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(6),
  country VARCHAR(100) DEFAULT 'India',
  email VARCHAR(255),
  phone VARCHAR(15),
  website VARCHAR(255),
  industry VARCHAR(100),
  business_type VARCHAR(50),
  settings JSONB DEFAULT '{"working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "week_start": "Monday", "standard_work_hours": 9, "late_arrival_grace_minutes": 15, "attendance_tracking": true, "biometric_enabled": false, "geo_fencing_enabled": true}'::jsonb,
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  currency VARCHAR(3) DEFAULT 'INR',
  language VARCHAR(10) DEFAULT 'en',
  is_active BOOLEAN DEFAULT TRUE,
  incorporation_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT valid_gstin CHECK (gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
  CONSTRAINT valid_pan CHECK (pan IS NULL OR pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  CONSTRAINT valid_pincode CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^[0-9]{10,15}$')
);

CREATE INDEX idx_companies_group ON companies(group_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_code ON companies(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_active ON companies(is_active) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Departments Table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  cost_center_code VARCHAR(50),
  budget_code VARCHAR(50),
  level INTEGER DEFAULT 1,
  path VARCHAR(500),
  hod_employee_id UUID,
  email VARCHAR(255),
  phone VARCHAR(15),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT department_level_valid CHECK (level > 0 AND level <= 10)
);

CREATE INDEX idx_departments_company ON departments(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_parent ON departments(parent_department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_path ON departments USING gin(path gin_trgm_ops);
CREATE INDEX idx_departments_code ON departments(company_id, code) WHERE deleted_at IS NULL;
CREATE TRIGGER trg_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION calculate_department_hierarchy()
RETURNS TRIGGER AS $$
DECLARE
  parent_level INTEGER;
  parent_path VARCHAR(500);
BEGIN
  IF NEW.parent_department_id IS NULL THEN
    NEW.level := 1;
    NEW.path := '/' || NEW.id::TEXT || '/';
  ELSE
    SELECT level, path INTO parent_level, parent_path FROM departments WHERE id = NEW.parent_department_id;
    NEW.level := parent_level + 1;
    NEW.path := parent_path || NEW.id::TEXT || '/';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_departments_hierarchy BEFORE INSERT OR UPDATE OF parent_department_id ON departments FOR EACH ROW EXECUTE FUNCTION calculate_department_hierarchy();

-- Roles Table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  job_description TEXT,
  responsibilities TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  level VARCHAR(50),
  job_family VARCHAR(100),
  job_category VARCHAR(100),
  is_sales_role BOOLEAN DEFAULT FALSE,
  is_managerial_role BOOLEAN DEFAULT FALSE,
  is_technical_role BOOLEAN DEFAULT FALSE,
  is_client_facing BOOLEAN DEFAULT FALSE,
  reports_to_role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  min_ctc DECIMAL(12,2),
  max_ctc DECIMAL(12,2),
  typical_ctc DECIMAL(12,2),
  default_employment_type VARCHAR(50) DEFAULT 'Full-time',
  total_positions INTEGER DEFAULT 1,
  filled_positions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_hiring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT valid_ctc_range CHECK (min_ctc IS NULL OR max_ctc IS NULL OR min_ctc <= max_ctc),
  CONSTRAINT valid_positions CHECK (filled_positions >= 0 AND filled_positions <= total_positions)
);

CREATE INDEX idx_roles_company ON roles(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_department ON roles(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_sales ON roles(company_id, is_sales_role) WHERE is_sales_role = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_roles_hiring ON roles(company_id, is_hiring) WHERE is_hiring = TRUE AND deleted_at IS NULL;
CREATE TRIGGER trg_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Employees Table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(255),
  personal_email VARCHAR(255) UNIQUE NOT NULL,
  work_email VARCHAR(255) UNIQUE,
  phone VARCHAR(15) UNIQUE,
  alternate_phone VARCHAR(15),
  date_of_birth DATE,
  gender VARCHAR(20),
  blood_group VARCHAR(5),
  marital_status VARCHAR(20),
  nationality VARCHAR(100) DEFAULT 'Indian',
  pan VARCHAR(10),
  aadhaar_number TEXT,
  uan VARCHAR(12),
  passport_number VARCHAR(20),
  driving_license VARCHAR(20),
  current_address TEXT,
  permanent_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(6),
  country VARCHAR(100) DEFAULT 'India',
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(15),
  emergency_contact_relation VARCHAR(50),
  emergency_contact_address TEXT,
  employment_type VARCHAR(50) NOT NULL,
  contract_type VARCHAR(50),
  joining_date DATE NOT NULL,
  confirmation_date DATE,
  probation_end_date DATE,
  probation_period_months INTEGER DEFAULT 6,
  notice_period_days INTEGER DEFAULT 30,
  reporting_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  work_mode VARCHAR(50) DEFAULT 'Office',
  office_location VARCHAR(100),
  work_shift VARCHAR(50) DEFAULT 'Day',
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_account_type VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active',
  exit_date DATE,
  exit_reason TEXT,
  exit_type VARCHAR(50),
  eligible_for_rehire BOOLEAN DEFAULT TRUE,
  is_rehire BOOLEAN DEFAULT FALSE,
  previous_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  previous_exit_date DATE,
  rehire_date DATE,
  password_hash TEXT,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  totp_secret VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true, "whatsapp": false}'::jsonb,
  profile_visibility VARCHAR(20) DEFAULT 'company',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  CONSTRAINT valid_employee_pan CHECK (pan IS NULL OR pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  CONSTRAINT valid_employee_pincode CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$'),
  CONSTRAINT valid_employee_status CHECK (status IN ('active', 'on_notice', 'on_leave', 'suspended', 'exited')),
  CONSTRAINT valid_employee_gender CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  CONSTRAINT valid_blood_group CHECK (blood_group IS NULL OR blood_group IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')),
  CONSTRAINT valid_ifsc CHECK (bank_ifsc IS NULL OR bank_ifsc ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  CONSTRAINT joining_before_exit CHECK (exit_date IS NULL OR exit_date >= joining_date),
  CONSTRAINT probation_after_joining CHECK (probation_end_date IS NULL OR probation_end_date > joining_date)
);

CREATE INDEX idx_employees_company ON employees(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_department ON employees(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_role ON employees(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_status ON employees(company_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_manager ON employees(reporting_manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_code ON employees(employee_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_name_search ON employees USING gin(to_tsvector('english', COALESCE(first_name, '') || ' ' || COALESCE(middle_name, '') || ' ' || COALESCE(last_name, '') || ' ' || COALESCE(employee_code, '') || ' ' || COALESCE(work_email, '')));
CREATE TRIGGER trg_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- HOD FK
ALTER TABLE departments ADD CONSTRAINT fk_departments_hod FOREIGN KEY (hod_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 2. ATTENDANCE & LEAVE

-- Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  check_in_location JSONB,
  check_out_location JSONB,
  work_hours DECIMAL(4,2),
  overtime_hours DECIMAL(4,2),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  is_late BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT attendance_unique_employee_date UNIQUE(employee_id, date)
);

CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date DESC);
CREATE TRIGGER trg_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Leave Types Table
CREATE TABLE leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  is_paid BOOLEAN DEFAULT TRUE,
  annual_quota INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT leave_type_code_unique UNIQUE(company_id, code)
);

-- Salary Components
CREATE TABLE salary_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- earning, deduction
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employee Salaries
CREATE TABLE employee_salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  annual_ctc DECIMAL(12,2) NOT NULL,
  effective_from DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Deals
CREATE TABLE sales_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  deal_name VARCHAR(255) NOT NULL,
  deal_value DECIMAL(15,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Incentive Calculations
CREATE TABLE incentive_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES sales_deals(id) ON DELETE CASCADE,
  calculated_incentive DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  insight_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Views
CREATE VIEW v_active_employees AS
SELECT e.id, e.employee_code, e.first_name, e.last_name, c.name as company_name, d.name as department_name
FROM employees e
JOIN companies c ON e.company_id = c.id
JOIN departments d ON e.department_id = d.id
WHERE e.status = 'active';
