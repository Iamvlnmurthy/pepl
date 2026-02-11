# 🗄️ PHASE 1 - PART 2: ATTENDANCE, LEAVE & HOLIDAY MANAGEMENT

## 📋 Overview

This part covers the complete attendance tracking, leave management, and holiday calendar systems.

**What's Included:**
- ✅ Attendance table with geo-tracking
- ✅ Work hours calculation triggers
- ✅ Late mark detection
- ✅ Correction workflow
- ✅ Leave types configuration
- ✅ Leave balances with pro-rata
- ✅ Leave applications with approval
- ✅ Holiday calendar
- ✅ Weekend configuration

---

## 📊 ATTENDANCE MANAGEMENT SCHEMA

```sql
-- ============================================================================
-- ATTENDANCE TRACKING
-- ============================================================================

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Date
  date DATE NOT NULL,
  
  -- Check-in/out with timezone support
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  
  -- Location Tracking (for geo-fencing)
  check_in_location JSONB, -- {lat: 12.9716, lng: 77.5946, address: "Bangalore"}
  check_out_location JSONB,
  check_in_device_info JSONB, -- {device: "iPhone 13", ip: "192.168.1.1", browser: "Safari"}
  check_out_device_info JSONB,
  
  -- Work Hours (Auto-calculated)
  work_hours DECIMAL(4,2), -- 9.5 hours
  overtime_hours DECIMAL(4,2), -- 1.5 hours
  break_hours DECIMAL(4,2) DEFAULT 0, -- Lunch/tea breaks
  productive_hours DECIMAL(4,2), -- work_hours - break_hours
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending', 
  -- Values: present, absent, half_day, wfh, on_leave, holiday, week_off, comp_off
  
  -- Late Mark Detection
  is_late BOOLEAN DEFAULT FALSE,
  late_by_minutes INTEGER,
  grace_period_used BOOLEAN DEFAULT FALSE,
  late_mark_reason TEXT,
  
  -- Early Departure
  is_early_departure BOOLEAN DEFAULT FALSE,
  early_by_minutes INTEGER,
  early_departure_reason TEXT,
  
  -- Special Cases
  is_wfh BOOLEAN DEFAULT FALSE,
  is_overtime BOOLEAN DEFAULT FALSE,
  is_weekend_work BOOLEAN DEFAULT FALSE,
  is_holiday_work BOOLEAN DEFAULT FALSE,
  
  -- Trainer-specific (for Vivencia trainers)
  is_trainer_session BOOLEAN DEFAULT FALSE,
  trainer_session_hours DECIMAL(4,2),
  session_details JSONB, -- {topic: "React Advanced", participants: 25, start_time: "10:00", end_time: "13:00"}
  
  -- Shift Information
  shift_name VARCHAR(50), -- Morning, Evening, Night
  shift_start_time TIME,
  shift_end_time TIME,
  
  -- Corrections & Approvals
  is_corrected BOOLEAN DEFAULT FALSE,
  correction_reason TEXT,
  original_check_in TIMESTAMPTZ,
  original_check_out TIMESTAMPTZ,
  correction_requested_at TIMESTAMP,
  corrected_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Approval workflow
  correction_status VARCHAR(50), -- pending, approved, rejected
  correction_approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  correction_approved_at TIMESTAMP,
  correction_rejection_reason TEXT,
  
  -- Remarks
  remarks TEXT, -- System-generated notes
  employee_remarks TEXT, -- Employee can add notes (e.g., "Client meeting offsite")
  manager_remarks TEXT, -- Manager comments
  
  -- Locking (before payroll processing)
  is_locked BOOLEAN DEFAULT FALSE,
  locked_at TIMESTAMP,
  locked_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT attendance_unique_employee_date UNIQUE(employee_id, date),
  CONSTRAINT check_out_after_check_in CHECK (
    check_out IS NULL OR check_in IS NULL OR check_out > check_in
  ),
  CONSTRAINT valid_work_hours CHECK (
    work_hours IS NULL OR (work_hours >= 0 AND work_hours <= 24)
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('present', 'absent', 'half_day', 'wfh', 'on_leave', 'holiday', 'week_off', 'comp_off')
  )
);

-- Indexes for Performance
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date DESC);
CREATE INDEX idx_attendance_company_date ON attendance(company_id, date DESC);
CREATE INDEX idx_attendance_status ON attendance(company_id, status, date) 
  WHERE is_locked = FALSE;
CREATE INDEX idx_attendance_corrections_pending ON attendance(employee_id) 
  WHERE is_corrected = TRUE AND correction_status = 'pending';
CREATE INDEX idx_attendance_unlocked ON attendance(company_id, date) 
  WHERE is_locked = FALSE;
CREATE INDEX idx_attendance_late_marks ON attendance(employee_id, date) 
  WHERE is_late = TRUE;

-- Trigger to auto-calculate work hours
CREATE OR REPLACE FUNCTION calculate_work_hours()
RETURNS TRIGGER AS $$
DECLARE
  standard_start_time TIME;
  standard_end_time TIME;
  grace_minutes INTEGER;
BEGIN
  -- Get company settings
  SELECT 
    COALESCE((settings->>'standard_start_time')::TIME, '09:30:00'::TIME),
    COALESCE((settings->>'standard_end_time')::TIME, '18:30:00'::TIME),
    COALESCE((settings->>'late_arrival_grace_minutes')::INTEGER, 15)
  INTO standard_start_time, standard_end_time, grace_minutes
  FROM companies
  WHERE id = NEW.company_id;
  
  -- Calculate work hours if both check-in and check-out exist
  IF NEW.check_out IS NOT NULL AND NEW.check_in IS NOT NULL THEN
    NEW.work_hours := ROUND(
      EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in))::NUMERIC / 3600, 
      2
    );
    
    -- Calculate productive hours (excluding breaks)
    NEW.productive_hours := NEW.work_hours - COALESCE(NEW.break_hours, 0);
    
    -- Determine if overtime (work_hours > 9)
    IF NEW.work_hours > 9 THEN
      NEW.is_overtime := TRUE;
      NEW.overtime_hours := NEW.work_hours - 9;
    END IF;
    
    -- Set status as present if work hours > 4
    IF NEW.work_hours >= 4 AND NEW.work_hours < 6 THEN
      NEW.status := 'half_day';
    ELSIF NEW.work_hours >= 6 THEN
      NEW.status := 'present';
    END IF;
  END IF;
  
  -- Late mark detection
  IF NEW.check_in IS NOT NULL THEN
    DECLARE
      check_in_time TIME;
      late_minutes INTEGER;
    BEGIN
      check_in_time := (NEW.check_in AT TIME ZONE 'Asia/Kolkata')::TIME;
      late_minutes := EXTRACT(EPOCH FROM (check_in_time - standard_start_time))::INTEGER / 60;
      
      IF late_minutes > grace_minutes THEN
        NEW.is_late := TRUE;
        NEW.late_by_minutes := late_minutes;
      ELSIF late_minutes > 0 AND late_minutes <= grace_minutes THEN
        NEW.grace_period_used := TRUE;
      END IF;
    END;
  END IF;
  
  -- Early departure detection
  IF NEW.check_out IS NOT NULL THEN
    DECLARE
      check_out_time TIME;
      early_minutes INTEGER;
    BEGIN
      check_out_time := (NEW.check_out AT TIME ZONE 'Asia/Kolkata')::TIME;
      early_minutes := EXTRACT(EPOCH FROM (standard_end_time - check_out_time))::INTEGER / 60;
      
      IF early_minutes > 30 THEN -- Left more than 30 mins early
        NEW.is_early_departure := TRUE;
        NEW.early_by_minutes := early_minutes;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_work_hours
  BEFORE INSERT OR UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION calculate_work_hours();

-- Trigger to prevent editing locked attendance
CREATE OR REPLACE FUNCTION prevent_locked_attendance_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_locked = TRUE AND NEW.is_locked = TRUE THEN
    -- Allow only unlocking by authorized users
    IF OLD.check_in IS DISTINCT FROM NEW.check_in 
       OR OLD.check_out IS DISTINCT FROM NEW.check_out THEN
      RAISE EXCEPTION 'Cannot modify locked attendance. Unlock first.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_locked_edit
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION prevent_locked_attendance_edit();

-- Trigger for updated_at
CREATE TRIGGER trg_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE attendance IS 'Daily attendance tracking with auto-calculation of work hours and late marks';
COMMENT ON COLUMN attendance.check_in_location IS 'JSON: {lat, lng, address} for geo-fencing validation';
COMMENT ON COLUMN attendance.is_locked IS 'Locked records cannot be edited (locked before payroll processing)';

-- ============================================================================
-- LEAVE MANAGEMENT SYSTEM
-- ============================================================================

-- Leave Types Configuration
CREATE TABLE leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Leave Type Details
  name VARCHAR(100) NOT NULL, -- Paid Leave, Sick Leave, Casual Leave, etc.
  code VARCHAR(20) NOT NULL, -- PL, SL, CL, LWP, CO, ML, PL
  short_name VARCHAR(50),
  description TEXT,
  
  -- Configuration
  is_paid BOOLEAN DEFAULT TRUE,
  annual_quota INTEGER, -- NULL for unlimited (e.g., LWP)
  
  -- Accrual Settings
  pro_rata_applicable BOOLEAN DEFAULT TRUE, -- Calculate based on joining date
  accrual_frequency VARCHAR(20), -- monthly, quarterly, annual, none
  accrual_start_month INTEGER DEFAULT 1, -- January
  
  -- Carry Forward Rules
  carry_forward_allowed BOOLEAN DEFAULT FALSE,
  max_carry_forward INTEGER, -- Max days that can be carried forward
  carry_forward_expiry_months INTEGER, -- Carried forward leaves expire after X months
  
  -- Encashment
  encashment_allowed BOOLEAN DEFAULT FALSE,
  min_balance_for_encashment INTEGER,
  max_encashment_days INTEGER,
  
  -- Restrictions
  min_days_notice_required INTEGER DEFAULT 0, -- Days in advance to apply
  max_consecutive_days INTEGER, -- Max continuous leave allowed
  min_balance_required DECIMAL(4,1) DEFAULT 0, -- Minimum balance to maintain
  can_apply_negative BOOLEAN DEFAULT FALSE, -- Can apply even if balance is 0
  
  -- Sandwich Leave Rules
  count_weekend_as_leave BOOLEAN DEFAULT FALSE,
  count_holidays_as_leave BOOLEAN DEFAULT FALSE,
  allow_sandwich_leave BOOLEAN DEFAULT TRUE,
  
  -- Applicability
  applicable_gender VARCHAR(20), -- all, male, female
  applicable_marital_status VARCHAR(20), -- all, married, single
  min_tenure_months INTEGER DEFAULT 0, -- Minimum tenure to avail
  
  -- Approval Workflow
  requires_approval BOOLEAN DEFAULT TRUE,
  approval_levels INTEGER DEFAULT 1, -- Number of approval levels
  auto_approve_upto_days INTEGER, -- Auto-approve if <= X days
  
  -- UI/Display
  color_code VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for UI
  icon_name VARCHAR(50), -- Icon identifier
  display_order INTEGER DEFAULT 100,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Constraints
  CONSTRAINT leave_type_code_unique UNIQUE(company_id, code),
  CONSTRAINT valid_accrual_frequency CHECK (
    accrual_frequency IS NULL OR 
    accrual_frequency IN ('monthly', 'quarterly', 'annual', 'none')
  ),
  CONSTRAINT valid_applicable_gender CHECK (
    applicable_gender IS NULL OR 
    applicable_gender IN ('all', 'male', 'female')
  )
);

-- Indexes
CREATE INDEX idx_leave_types_company ON leave_types(company_id) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_leave_types_active ON leave_types(company_id, is_active) 
  WHERE is_active = TRUE AND deleted_at IS NULL;

-- Trigger
CREATE TRIGGER trg_leave_types_updated_at
  BEFORE UPDATE ON leave_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE leave_types IS 'Leave type configurations per company';
COMMENT ON COLUMN leave_types.pro_rata_applicable IS 'If TRUE, calculate leave based on joining date within year';

-- Pre-populate default leave types for all companies
CREATE OR REPLACE FUNCTION seed_default_leave_types()
RETURNS VOID AS $$
BEGIN
  INSERT INTO leave_types (
    company_id, name, code, is_paid, annual_quota, carry_forward_allowed, 
    max_carry_forward, color_code, display_order
  )
  SELECT 
    c.id,
    lt.name,
    lt.code,
    lt.is_paid,
    lt.annual_quota,
    lt.carry_forward_allowed,
    lt.max_carry_forward,
    lt.color_code,
    lt.display_order
  FROM companies c
  CROSS JOIN (VALUES
    ('Paid Leave', 'PL', TRUE, 18, TRUE, 5, '#10B981', 1),
    ('Sick Leave', 'SL', TRUE, 12, FALSE, NULL, '#F59E0B', 2),
    ('Casual Leave', 'CL', TRUE, 12, FALSE, NULL, '#3B82F6', 3),
    ('Comp Off', 'CO', TRUE, NULL, FALSE, NULL, '#8B5CF6', 4),
    ('Leave Without Pay', 'LWP', FALSE, NULL, FALSE, NULL, '#EF4444', 5),
    ('Maternity Leave', 'ML', TRUE, 182, FALSE, NULL, '#EC4899', 6),
    ('Paternity Leave', 'PTL', TRUE, 15, FALSE, NULL, '#06B6D4', 7)
  ) AS lt(name, code, is_paid, annual_quota, carry_forward_allowed, max_carry_forward, color_code, display_order)
  WHERE c.deleted_at IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM leave_types 
      WHERE company_id = c.id AND code = lt.code
    );
END;
$$ LANGUAGE plpgsql;

-- Leave Balances (Monthly Snapshot)
CREATE TABLE leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  
  -- Period
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  
  -- Balance Tracking
  opening_balance DECIMAL(5,2) DEFAULT 0,
  accrued DECIMAL(5,2) DEFAULT 0, -- Credited this month
  used DECIMAL(5,2) DEFAULT 0, -- Debited this month
  lapsed DECIMAL(5,2) DEFAULT 0, -- Expired carry forward
  carry_forward DECIMAL(5,2) DEFAULT 0, -- Brought forward from previous year
  closing_balance DECIMAL(5,2) DEFAULT 0, -- opening + accrued - used - lapsed
  
  -- Adjustments
  manual_adjustment DECIMAL(5,2) DEFAULT 0,
  adjustment_reason TEXT,
  adjusted_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Encashment
  encashed DECIMAL(5,2) DEFAULT 0,
  encashment_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT leave_balance_unique UNIQUE(employee_id, leave_type_id, year, month),
  CONSTRAINT valid_year CHECK (year >= 2020 AND year <= 2100),
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12)
);

-- Indexes
CREATE INDEX idx_leave_balances_employee ON leave_balances(employee_id, year DESC, month DESC);
CREATE INDEX idx_leave_balances_type ON leave_balances(leave_type_id, year, month);
CREATE INDEX idx_leave_balances_period ON leave_balances(year, month);

-- Trigger
CREATE TRIGGER trg_leave_balances_updated_at
  BEFORE UPDATE ON leave_balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-calculate closing balance
CREATE OR REPLACE FUNCTION calculate_leave_closing_balance()
RETURNS TRIGGER AS $$
BEGIN
  NEW.closing_balance := 
    NEW.opening_balance + 
    NEW.accrued + 
    NEW.carry_forward + 
    NEW.manual_adjustment - 
    NEW.used - 
    NEW.lapsed - 
    NEW.encashed;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_closing_balance
  BEFORE INSERT OR UPDATE ON leave_balances
  FOR EACH ROW
  EXECUTE FUNCTION calculate_leave_closing_balance();

COMMENT ON TABLE leave_balances IS 'Monthly snapshot of leave balances per employee per leave type';
COMMENT ON COLUMN leave_balances.accrued IS 'Leaves credited in this month (pro-rata calculation)';

-- Leave Applications
CREATE TABLE leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
  
  -- Application Number
  application_number VARCHAR(50) UNIQUE, -- LA-2025-001
  
  -- Leave Duration
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  total_days DECIMAL(4,1) NOT NULL,
  
  -- Half Day Options
  is_half_day BOOLEAN DEFAULT FALSE,
  half_day_type VARCHAR(20), -- first_half, second_half
  half_day_date DATE,
  
  -- Reason
  reason TEXT NOT NULL,
  contact_during_leave VARCHAR(15), -- Phone number
  address_during_leave TEXT,
  
  -- Sandwich Leave Detection (Auto-calculated)
  is_sandwich_leave BOOLEAN DEFAULT FALSE,
  sandwich_days INTEGER DEFAULT 0,
  weekend_count INTEGER DEFAULT 0,
  holiday_count INTEGER DEFAULT 0,
  actual_leave_days DECIMAL(4,1), -- Excluding weekends/holidays if configured
  
  -- Attachment
  attachment_url TEXT,
  
  -- Status Workflow
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled, withdrawn
  
  -- Multi-level Approval
  approval_level INTEGER DEFAULT 1,
  current_approver_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Final Approval
  approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Cancellation
  cancelled_at TIMESTAMP,
  cancelled_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  
  -- Withdrawn by employee
  withdrawn_at TIMESTAMP,
  withdrawal_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT valid_leave_dates CHECK (to_date >= from_date),
  CONSTRAINT valid_total_days CHECK (total_days > 0),
  CONSTRAINT valid_leave_status CHECK (
    status IN ('pending', 'approved', 'rejected', 'cancelled', 'withdrawn')
  ),
  CONSTRAINT valid_half_day_type CHECK (
    half_day_type IS NULL OR 
    half_day_type IN ('first_half', 'second_half')
  )
);

-- Indexes
CREATE INDEX idx_leave_applications_employee ON leave_applications(employee_id, status);
CREATE INDEX idx_leave_applications_approver ON leave_applications(current_approver_id) 
  WHERE status = 'pending';
CREATE INDEX idx_leave_applications_dates ON leave_applications(from_date, to_date);
CREATE INDEX idx_leave_applications_company ON leave_applications(company_id, status);
CREATE INDEX idx_leave_applications_type ON leave_applications(leave_type_id);

-- Trigger
CREATE TRIGGER trg_leave_applications_updated_at
  BEFORE UPDATE ON leave_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate application number
CREATE OR REPLACE FUNCTION generate_leave_application_number()
RETURNS TRIGGER AS $$
DECLARE
  v_year INTEGER;
  v_sequence INTEGER;
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE);
  
  SELECT COALESCE(MAX(CAST(SPLIT_PART(application_number, '-', 3) AS INTEGER)), 0) + 1
  INTO v_sequence
  FROM leave_applications
  WHERE application_number LIKE 'LA-' || v_year || '-%';
  
  NEW.application_number := 'LA-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_leave_application_number
  BEFORE INSERT ON leave_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION generate_leave_application_number();

COMMENT ON TABLE leave_applications IS 'Leave applications with approval workflow';

-- ============================================================================
-- HOLIDAYS & CALENDAR
-- ============================================================================

CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Holiday Details
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) DEFAULT 'public', -- public, optional, restricted
  
  -- Optional Holiday Rules
  is_optional BOOLEAN DEFAULT FALSE,
  max_optional_per_year INTEGER DEFAULT 2,
  
  -- Applicability
  applicable_locations JSONB, -- ['Bangalore', 'Hyderabad', 'Mumbai']
  applicable_departments JSONB, -- [dept_id, dept_id]
  applicable_states JSONB, -- ['Karnataka', 'Telangana']
  
  -- Details
  description TEXT,
  is_recurring BOOLEAN DEFAULT FALSE, -- Repeats every year
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES employees(id) ON DELETE SET NULL,
  
  CONSTRAINT holiday_unique_company_date UNIQUE(company_id, date, name)
);

-- Indexes
CREATE INDEX idx_holidays_company_date ON holidays(company_id, date) 
  WHERE is_active = TRUE;
CREATE INDEX idx_holidays_year ON holidays(company_id, EXTRACT(YEAR FROM date)) 
  WHERE is_active = TRUE;

-- Trigger
CREATE TRIGGER trg_holidays_updated_at
  BEFORE UPDATE ON holidays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE holidays IS 'Company-wide and location-specific holidays';
COMMENT ON COLUMN holidays.is_optional IS 'Optional holidays that employees can choose to avail';

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to calculate leave days (excluding weekends/holidays if configured)
CREATE OR REPLACE FUNCTION calculate_leave_days(
  p_from_date DATE,
  p_to_date DATE,
  p_company_id UUID,
  p_leave_type_id UUID,
  p_is_half_day BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  total_days DECIMAL(4,1),
  weekend_count INTEGER,
  holiday_count INTEGER,
  sandwich_days INTEGER,
  actual_leave_days DECIMAL(4,1)
) AS $$
DECLARE
  v_count_weekends BOOLEAN;
  v_count_holidays BOOLEAN;
  v_working_days INTEGER;
  v_weekend_count INTEGER := 0;
  v_holiday_count INTEGER := 0;
  v_current_date DATE;
BEGIN
  -- Get leave type settings
  SELECT 
    count_weekend_as_leave,
    count_holidays_as_leave
  INTO v_count_weekends, v_count_holidays
  FROM leave_types
  WHERE id = p_leave_type_id;
  
  -- Calculate total days
  total_days := (p_to_date - p_from_date) + 1;
  
  IF p_is_half_day THEN
    total_days := 0.5;
    weekend_count := 0;
    holiday_count := 0;
    sandwich_days := 0;
    actual_leave_days := 0.5;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Count weekends
  v_current_date := p_from_date;
  WHILE v_current_date <= p_to_date LOOP
    IF EXTRACT(DOW FROM v_current_date) IN (0, 6) THEN -- Sunday=0, Saturday=6
      v_weekend_count := v_weekend_count + 1;
    END IF;
    v_current_date := v_current_date + 1;
  END LOOP;
  
  -- Count holidays
  SELECT COUNT(*) INTO v_holiday_count
  FROM holidays
  WHERE company_id = p_company_id
    AND date BETWEEN p_from_date AND p_to_date
    AND is_active = TRUE;
  
  weekend_count := v_weekend_count;
  holiday_count := v_holiday_count;
  sandwich_days := v_weekend_count + v_holiday_count;
  
  -- Calculate actual leave days
  actual_leave_days := total_days;
  IF NOT v_count_weekends THEN
    actual_leave_days := actual_leave_days - v_weekend_count;
  END IF;
  IF NOT v_count_holidays THEN
    actual_leave_days := actual_leave_days - v_holiday_count;
  END IF;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to accrue monthly leave balance
CREATE OR REPLACE FUNCTION accrue_monthly_leave(
  p_employee_id UUID,
  p_leave_type_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_annual_quota INTEGER;
  v_joining_date DATE;
  v_monthly_accrual DECIMAL(5,2);
  v_pro_rata_applicable BOOLEAN;
BEGIN
  -- Get leave type settings
  SELECT annual_quota, pro_rata_applicable
  INTO v_annual_quota, v_pro_rata_applicable
  FROM leave_types
  WHERE id = p_leave_type_id;
  
  IF v_annual_quota IS NULL THEN
    RETURN 0; -- Unlimited leave type
  END IF;
  
  -- Get employee joining date
  SELECT joining_date INTO v_joining_date
  FROM employees
  WHERE id = p_employee_id;
  
  -- Calculate monthly accrual
  v_monthly_accrual := v_annual_quota / 12.0;
  
  -- Apply pro-rata if applicable
  IF v_pro_rata_applicable AND 
     EXTRACT(YEAR FROM v_joining_date) = p_year AND
     EXTRACT(MONTH FROM v_joining_date) = p_month THEN
    -- Pro-rata for mid-month joiners
    v_monthly_accrual := v_monthly_accrual * 
      (DATE_PART('day', DATE_TRUNC('month', v_joining_date) + INTERVAL '1 month' - INTERVAL '1 day') - 
       DATE_PART('day', v_joining_date) + 1) / 
      DATE_PART('day', DATE_TRUNC('month', v_joining_date) + INTERVAL '1 month' - INTERVAL '1 day');
  END IF;
  
  RETURN ROUND(v_monthly_accrual, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION accrue_monthly_leave IS 'Calculate pro-rata leave accrual for a month';

```

**END OF PHASE 1 - PART 2**

This file contains:
- ✅ Complete attendance tracking system
- ✅ Auto-calculation of work hours
- ✅ Late mark detection with grace period
- ✅ Attendance correction workflow
- ✅ Leave types configuration (paid, unpaid, carry forward)
- ✅ Leave balances with monthly accrual
- ✅ Leave applications with approval
- ✅ Holiday calendar
- ✅ Utility functions for leave calculations

**Remaining files:**
- Phase 1 Part 3: Salary & Payroll
- Phase 1 Part 4: Sales & Incentives
- Phase 1 Part 5: Performance, Recruitment, Expenses
- Phase 1 Part 6: Notifications, Audit, AI Tables
