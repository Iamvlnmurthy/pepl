# 🗄️ PHASE 1: DATABASE SCHEMA & CORE ARCHITECTURE

## 📋 Overview

This phase covers the complete PostgreSQL database schema for the HRMS platform. Every table, index, constraint, trigger, and function needed for production.

**What's Included:**
- ✅ Complete database schema (40+ tables)
- ✅ All relationships and foreign keys
- ✅ Performance indexes
- ✅ Data validation constraints
- ✅ Triggers for automation
- ✅ Utility functions
- ✅ Row-level security (RLS)
- ✅ Audit logging
- ✅ Sample data seeding

---

## 🏗️ TECHNOLOGY STACK

```yaml
Database: PostgreSQL 15+
Hosting: Google Cloud SQL / Neon / Supabase
Extensions Required:
  - uuid-ossp (UUID generation)
  - pg_trgm (Full-text search)
  - pgcrypto (Encryption)
Backup: Automated daily backups, 30-day retention
Replication: Master-slave for read scaling
```

---

## 📊 COMPLETE DATABASE SCHEMA

### 1. ORGANIZATION HIERARCHY

```sql
-- ============================================================================
-- GROUPS (Parent Organization)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Groups Table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#3B82F6',
  
  -- Settings (JSONB for flexibility)
  settings JSONB DEFAULT '{
    "timezone": "Asia/Kolkata",
    "currency": "INR",
    "date_format": "DD/MM/YYYY",
    "fiscal_year_start": "04-01"
  }'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT groups_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Index for soft delete queries
CREATE INDEX idx_groups_active ON groups(id) WHERE deleted_at IS NULL;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE groups IS 'Parent organization (e.g., Holding company managing multiple businesses)';
COMMENT ON COLUMN groups.settings IS 'JSON configuration: timezone, currency, date formats, fiscal year';

-- ============================================================================
-- COMPANIES (Vivencia, ONROL, Oblique Media)
-- ============================================================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  
  -- Basic Information
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- VIV, ONR, OBL
  
  -- Indian Statutory Compliance Details
  gstin VARCHAR(15) UNIQUE, -- GST Identification Number
  pan VARCHAR(10) UNIQUE, -- Permanent Account Number
  tan VARCHAR(10) UNIQUE, -- Tax Deduction Account Number
  pf_registration_number VARCHAR(50), -- Provident Fund
  esi_registration_number VARCHAR(50), -- Employee State Insurance
  professional_tax_number VARCHAR(50), -- PT Registration
  labour_welfare_fund_number VARCHAR(50), -- LWF (if applicable)
  
  -- Address
  registered_address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(6),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(15),
  website VARCHAR(255),
  
  -- Business Details
  industry VARCHAR(100),
  business_type VARCHAR(50), -- Private Limited, LLP, Partnership, etc.
  
  -- Settings
  settings JSONB DEFAULT '{
    "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "week_start": "Monday",
    "standard_work_hours": 9,
    "late_arrival_grace_minutes": 15,
    "attendance_tracking": true,
    "biometric_enabled": false,
    "geo_fencing_enabled": true
  }'::jsonb,
  
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  currency VARCHAR(3) DEFAULT 'INR',
  language VARCHAR(10) DEFAULT 'en',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  incorporation_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  
  -- Constraints
  CONSTRAINT valid_gstin CHECK (
    gstin IS NULL OR 
    gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
  ),
  CONSTRAINT valid_pan CHECK (
    pan IS NULL OR 
    pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
  ),
  CONSTRAINT valid_pincode CHECK (
    pincode IS NULL OR 
    pincode ~ '^[0-9]{6}$'
  ),
  CONSTRAINT valid_phone CHECK (
    phone IS NULL OR 
    phone ~ '^[0-9]{10,15}$'
  )
);

-- Indexes
CREATE INDEX idx_companies_group ON companies(group_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_code ON companies(code) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_active ON companies(is_active) WHERE deleted_at IS NULL;

-- Trigger
CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE companies IS 'Individual companies under a group (e.g., Vivencia, ONROL, Oblique Media)';
COMMENT ON COLUMN companies.gstin IS 'Format: 22AAAAA0000A1Z5 (State Code + PAN + Entity + Check + Z + Check Digit)';
COMMENT ON COLUMN companies.settings IS 'Company-specific configurations for attendance, leaves, etc.';

-- ============================================================================
-- DEPARTMENTS
-- ============================================================================

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  
  -- Department Info
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  
  -- Financial Tracking
  cost_center_code VARCHAR(50),
  budget_code VARCHAR(50),
  
  -- Hierarchy (for nested departments)
  level INTEGER DEFAULT 1,
  path VARCHAR(500), -- Materialized path: /1/5/12/ for quick hierarchy queries
  
  -- Head of Department (will be linked after employees table)
  hod_employee_id UUID, -- Foreign key added later
  
  -- Contact
  email VARCHAR(255),
  phone VARCHAR(15),
  location VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  CONSTRAINT department_level_valid CHECK (level > 0 AND level <= 10)
);

-- Indexes
CREATE INDEX idx_departments_company ON departments(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_parent ON departments(parent_department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_path ON departments USING gin(path gin_trgm_ops);
CREATE INDEX idx_departments_code ON departments(company_id, code) WHERE deleted_at IS NULL;

-- Trigger
CREATE TRIGGER trg_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-calculate level and path
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
    SELECT level, path INTO parent_level, parent_path
    FROM departments
    WHERE id = NEW.parent_department_id;
    
    NEW.level := parent_level + 1;
    NEW.path := parent_path || NEW.id::TEXT || '/';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_departments_hierarchy
  BEFORE INSERT OR UPDATE OF parent_department_id ON departments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_department_hierarchy();

COMMENT ON TABLE departments IS 'Organizational departments with hierarchical structure';
COMMENT ON COLUMN departments.path IS 'Materialized path for efficient hierarchy queries (e.g., /1/5/12/)';

-- ============================================================================
-- ROLES (Job Positions)
-- ============================================================================

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  
  -- Role Information
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  job_description TEXT,
  responsibilities TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  
  -- Classification
  level VARCHAR(50), -- Junior, Mid-Level, Senior, Lead, Manager, Director, VP, C-Level
  job_family VARCHAR(100), -- Engineering, Sales, Marketing, HR, Finance, Operations
  job_category VARCHAR(100), -- Technical, Non-Technical, Management
  
  -- Role Type Flags
  is_sales_role BOOLEAN DEFAULT FALSE,
  is_managerial_role BOOLEAN DEFAULT FALSE,
  is_technical_role BOOLEAN DEFAULT FALSE,
  is_client_facing BOOLEAN DEFAULT FALSE,
  
  -- Reporting Structure
  reports_to_role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  
  -- Compensation Range
  min_ctc DECIMAL(12,2),
  max_ctc DECIMAL(12,2),
  typical_ctc DECIMAL(12,2),
  
  -- Employment Type
  default_employment_type VARCHAR(50) DEFAULT 'Full-time', -- Full-time, Part-time, Contract
  
  -- Vacancy
  total_positions INTEGER DEFAULT 1,
  filled_positions INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_hiring BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  
  CONSTRAINT valid_ctc_range CHECK (
    min_ctc IS NULL OR max_ctc IS NULL OR min_ctc <= max_ctc
  ),
  CONSTRAINT valid_positions CHECK (
    filled_positions >= 0 AND filled_positions <= total_positions
  )
);

-- Indexes
CREATE INDEX idx_roles_company ON roles(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_department ON roles(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_sales ON roles(company_id, is_sales_role) 
  WHERE is_sales_role = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_roles_hiring ON roles(company_id, is_hiring) 
  WHERE is_hiring = TRUE AND deleted_at IS NULL;

-- Trigger
CREATE TRIGGER trg_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE roles IS 'Job roles/positions within the organization';
COMMENT ON COLUMN roles.is_sales_role IS 'Sales roles are eligible for sales incentives';

-- ============================================================================
-- EMPLOYEES (The Heart of HRMS)
-- ============================================================================

CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Multi-tenancy
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  
  -- Employee Code (Auto-generated: VIV001, ONR045, OBL023)
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  
  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(255), -- Preferred name (e.g., "Mike" instead of "Michael")
  
  -- Contact Information
  personal_email VARCHAR(255) UNIQUE NOT NULL,
  work_email VARCHAR(255) UNIQUE,
  phone VARCHAR(15) UNIQUE,
  alternate_phone VARCHAR(15),
  
  -- Demographics (Optional - for compliance/reporting only)
  date_of_birth DATE,
  gender VARCHAR(20), -- Male, Female, Other, Prefer not to say
  blood_group VARCHAR(5), -- A+, B+, AB+, O+, A-, B-, AB-, O-
  marital_status VARCHAR(20), -- Single, Married, Divorced, Widowed
  nationality VARCHAR(100) DEFAULT 'Indian',
  
  -- Government IDs (Encrypted in production)
  pan VARCHAR(10),
  aadhaar_number VARCHAR(12), -- Store encrypted
  uan VARCHAR(12), -- Universal Account Number (PF)
  passport_number VARCHAR(20),
  driving_license VARCHAR(20),
  
  -- Address
  current_address TEXT,
  permanent_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(6),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(15),
  emergency_contact_relation VARCHAR(50),
  emergency_contact_address TEXT,
  
  -- Employment Details
  employment_type VARCHAR(50) NOT NULL, -- Full-time, Trainer, Freelancer, Intern, Consultant, Part-time
  contract_type VARCHAR(50), -- Permanent, Fixed-term, Project-based
  
  joining_date DATE NOT NULL,
  confirmation_date DATE,
  probation_end_date DATE,
  probation_period_months INTEGER DEFAULT 6,
  
  notice_period_days INTEGER DEFAULT 30,
  
  -- Manager Hierarchy
  reporting_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Work Arrangement
  work_mode VARCHAR(50) DEFAULT 'Office', -- Office, Remote, Hybrid
  office_location VARCHAR(100),
  work_shift VARCHAR(50) DEFAULT 'Day', -- Day, Night, Rotational
  
  -- Bank Details
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(20),
  bank_ifsc VARCHAR(11),
  bank_account_type VARCHAR(20), -- Savings, Current
  
  -- Status Management
  status VARCHAR(50) DEFAULT 'active', -- active, on_notice, on_leave, suspended, exited
  exit_date DATE,
  exit_reason TEXT,
  exit_type VARCHAR(50), -- Resignation, Termination, Retirement, End of Contract, Layoff
  eligible_for_rehire BOOLEAN DEFAULT TRUE,
  
  -- Rehire Logic
  is_rehire BOOLEAN DEFAULT FALSE,
  previous_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  previous_exit_date DATE,
  rehire_date DATE,
  
  -- Authentication
  password_hash TEXT,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  last_login TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  
  -- Two-Factor Authentication
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  totp_secret VARCHAR(255),
  
  -- Profile
  avatar_url TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "sms": false,
    "push": true,
    "whatsapp": false
  }'::jsonb,
  
  -- Privacy
  profile_visibility VARCHAR(20) DEFAULT 'company', -- public, company, department, private
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT valid_employee_pan CHECK (
    pan IS NULL OR pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
  ),
  CONSTRAINT valid_employee_pincode CHECK (
    pincode IS NULL OR pincode ~ '^[0-9]{6}$'
  ),
  CONSTRAINT valid_employee_status CHECK (
    status IN ('active', 'on_notice', 'on_leave', 'suspended', 'exited')
  ),
  CONSTRAINT valid_employee_gender CHECK (
    gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say')
  ),
  CONSTRAINT valid_blood_group CHECK (
    blood_group IS NULL OR blood_group IN ('A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-')
  ),
  CONSTRAINT valid_ifsc CHECK (
    bank_ifsc IS NULL OR bank_ifsc ~ '^[A-Z]{4}0[A-Z0-9]{6}$'
  ),
  CONSTRAINT joining_before_exit CHECK (
    exit_date IS NULL OR exit_date >= joining_date
  ),
  CONSTRAINT probation_after_joining CHECK (
    probation_end_date IS NULL OR probation_end_date > joining_date
  )
);

-- Critical Indexes for Performance
CREATE INDEX idx_employees_company ON employees(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_department ON employees(department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_role ON employees(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_status ON employees(company_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_manager ON employees(reporting_manager_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_work_email ON employees(work_email) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_personal_email ON employees(personal_email) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_phone ON employees(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_code ON employees(employee_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_joining_date ON employees(joining_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_exit_date ON employees(exit_date) WHERE exit_date IS NOT NULL;
CREATE INDEX idx_employees_probation ON employees(company_id, probation_end_date) 
  WHERE probation_end_date IS NOT NULL AND status = 'active';

-- Full-text search index on employee names and codes
CREATE INDEX idx_employees_name_search ON employees USING gin(
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(middle_name, '') || ' ' ||
    COALESCE(last_name, '') || ' ' || 
    COALESCE(employee_code, '') || ' ' ||
    COALESCE(work_email, '')
  )
) WHERE deleted_at IS NULL;

-- Trigger
CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-set confirmation date after probation
CREATE OR REPLACE FUNCTION auto_confirm_probation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.probation_end_date IS NOT NULL 
     AND NEW.probation_end_date IS NOT NULL
     AND CURRENT_DATE > NEW.probation_end_date
     AND NEW.confirmation_date IS NULL
     AND NEW.status = 'active' THEN
    NEW.confirmation_date := NEW.probation_end_date;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employees_auto_confirm
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_probation();

-- Function to generate employee code
CREATE OR REPLACE FUNCTION generate_employee_code(p_company_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_company_code VARCHAR(10);
  v_next_number INTEGER;
  v_employee_code VARCHAR(50);
BEGIN
  -- Get company code
  SELECT code INTO v_company_code 
  FROM companies 
  WHERE id = p_company_id;
  
  -- Get next sequence number for this company
  SELECT COALESCE(
    MAX(CAST(REGEXP_REPLACE(employee_code, '[^0-9]', '', 'g') AS INTEGER)), 
    0
  ) + 1
  INTO v_next_number
  FROM employees
  WHERE company_id = p_company_id
    AND employee_code ~ ('^' || v_company_code || '[0-9]+$');
  
  -- Format: VIV001, ONR042, OBL015
  v_employee_code := v_company_code || LPAD(v_next_number::TEXT, 3, '0');
  
  RETURN v_employee_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE employees IS 'Core employee master table - the heart of HRMS';
COMMENT ON COLUMN employees.employee_code IS 'Auto-generated unique code per company (VIV001, ONR045)';
COMMENT ON COLUMN employees.aadhaar_number IS 'CRITICAL: Must be encrypted in production using pgcrypto';
COMMENT ON COLUMN employees.is_rehire IS 'TRUE if employee left and rejoined';

-- Add foreign key for HOD (now that employees table exists)
ALTER TABLE departments 
  ADD CONSTRAINT fk_departments_hod 
  FOREIGN KEY (hod_employee_id) 
  REFERENCES employees(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- EMPLOYEE HISTORY (Audit Trail for Changes)
-- ============================================================================

CREATE TABLE employee_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  
  -- Change Tracking
  change_type VARCHAR(50) NOT NULL, -- role_change, salary_revision, promotion, transfer, department_change, status_change, manager_change
  
  -- Field-level tracking
  field_name VARCHAR(100),
  previous_value JSONB,
  new_value JSONB,
  
  -- Effective Date
  effective_date DATE NOT NULL,
  
  -- Reason
  remarks TEXT,
  attachment_url TEXT,
  
  -- Approval
  approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES employees(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_employee_history_employee ON employee_history(employee_id, created_at DESC);
CREATE INDEX idx_employee_history_type ON employee_history(employee_id, change_type);
CREATE INDEX idx_employee_history_effective ON employee_history(effective_date);

COMMENT ON TABLE employee_history IS 'Immutable audit trail of all employee changes';
COMMENT ON COLUMN employee_history.previous_value IS 'JSON snapshot of old value';
COMMENT ON COLUMN employee_history.new_value IS 'JSON snapshot of new value';

-- ============================================================================
-- CONTINUE IN NEXT FILE DUE TO SIZE...
-- ============================================================================
```

**END OF PHASE 1 - PART 1**

This file contains:
- ✅ Groups, Companies, Departments, Roles
- ✅ Complete Employees table with all fields
- ✅ Employee History for audit trail
- ✅ All indexes, constraints, triggers
- ✅ Utility functions (employee code generation, etc.)

**Next files will contain:**
- Phase 1 Part 2: Attendance, Leaves, Holidays
- Phase 1 Part 3: Salary, Payroll
- Phase 1 Part 4: Sales & Incentives
- Phase 1 Part 5: Performance, Recruitment, Expenses, Documents
- Phase 1 Part 6: Notifications, Audit Logs, AI Tables, Views
