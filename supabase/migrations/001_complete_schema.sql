-- =====================================================
-- ATTESTATION PORTAL — COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 1. EXTEND profiles TABLE
-- ─────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- ─────────────────────────────────────────────────────
-- 2. EXTEND applications TABLE
-- ─────────────────────────────────────────────────────
ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_officer_id UUID REFERENCES auth.users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS forwarded_to_director_id UUID REFERENCES auth.users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS forwarded_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS officer_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS director_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS director_decision TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS director_decided_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS checked_in_by UUID REFERENCES auth.users(id);

-- ─────────────────────────────────────────────────────
-- 3. ENSURE appointment_slots TABLE EXISTS
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointment_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 5,
  is_available BOOLEAN DEFAULT true,
  tier TEXT DEFAULT 'Standard + Express',
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, time)
);

-- ─────────────────────────────────────────────────────
-- 4. CREATE blackout_dates TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blackout_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Public holiday',
  block_bookings BOOLEAN DEFAULT true,
  cancel_existing BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- 5. CREATE roles_permissions TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  permission_name TEXT NOT NULL,
  can_create BOOLEAN DEFAULT false,
  can_read BOOLEAN DEFAULT false,
  can_update BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, module, permission_name)
);

-- ─────────────────────────────────────────────────────
-- 6. CREATE audit_logs TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  category TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_name TEXT,
  reference_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);

-- ─────────────────────────────────────────────────────
-- 7. CREATE fees_config TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fees_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL UNIQUE,
  price_ghs DECIMAL(10,2) NOT NULL,
  turnaround_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- 8. CREATE sms_templates TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL UNIQUE,
  template_text TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- 9. CREATE portal_settings TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- 10. CREATE support_tickets TABLE
-- ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  application_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────────────
-- 11. INDEXES for performance
-- ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_applications_officer ON applications(assigned_officer_id);
CREATE INDEX IF NOT EXISTS idx_applications_director ON applications(forwarded_to_director_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_date ON appointment_slots(date);
CREATE INDEX IF NOT EXISTS idx_blackout_dates_date ON blackout_dates(date);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ─────────────────────────────────────────────────────
-- 12. ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────────────

-- appointment_slots: anyone can read, admin can write
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read appointment_slots" ON appointment_slots FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert appointment_slots" ON appointment_slots FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update appointment_slots" ON appointment_slots FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Admin can delete appointment_slots" ON appointment_slots FOR DELETE USING (true);

-- blackout_dates: anyone can read, admin can write
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read blackout_dates" ON blackout_dates FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert blackout_dates" ON blackout_dates FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update blackout_dates" ON blackout_dates FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Admin can delete blackout_dates" ON blackout_dates FOR DELETE USING (true);

-- audit_logs: admin/officer can read, system can write
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Staff can read audit_logs" ON audit_logs FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "System can insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- fees_config: anyone can read, admin can write
ALTER TABLE fees_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read fees_config" ON fees_config FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert fees_config" ON fees_config FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update fees_config" ON fees_config FOR UPDATE USING (true);

-- sms_templates: admin can read/write
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Admin can read sms_templates" ON sms_templates FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert sms_templates" ON sms_templates FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update sms_templates" ON sms_templates FOR UPDATE USING (true);

-- portal_settings: anyone can read, admin can write
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read portal_settings" ON portal_settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert portal_settings" ON portal_settings FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update portal_settings" ON portal_settings FOR UPDATE USING (true);

-- support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Staff can read support_tickets" ON support_tickets FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Staff can insert support_tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Staff can update support_tickets" ON support_tickets FOR UPDATE USING (true);

-- roles_permissions
ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can read roles_permissions" ON roles_permissions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin can insert roles_permissions" ON roles_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Admin can update roles_permissions" ON roles_permissions FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Admin can delete roles_permissions" ON roles_permissions FOR DELETE USING (true);

-- ─────────────────────────────────────────────────────
-- 13. SEED DATA — Fees
-- ─────────────────────────────────────────────────────
INSERT INTO fees_config (tier, price_ghs, turnaround_days, is_active)
VALUES 
  ('Standard', 200.00, 10, true),
  ('Express', 450.00, 3, true)
ON CONFLICT (tier) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 14. SEED DATA — Default Permissions (matching current RolesPermissions.jsx)
-- ─────────────────────────────────────────────────────
INSERT INTO roles_permissions (role, module, permission_name, can_create, can_read, can_update, can_delete)
VALUES
  -- Officer permissions
  ('Officer', 'SUBMISSIONS', 'Submissions', false, true, true, false),
  ('Officer', 'SUBMISSIONS', 'Reject submissions', false, false, true, false),
  ('Officer', 'SUBMISSIONS', 'Director sign-off', false, false, false, false),
  ('Officer', 'APPOINTMENTS', 'Appointment calendar', false, true, true, false),
  ('Officer', 'APPOINTMENTS', 'Check-in citizen', false, false, true, false),
  ('Officer', 'REVENUE', 'Revenue report', false, false, false, false),
  ('Officer', 'REVENUE', 'Settlement log', false, false, false, false),
  ('Officer', 'CONFIGURATION', 'Slot configuration', false, false, false, false),
  ('Officer', 'CONFIGURATION', 'Blackout dates', false, false, false, false),
  ('Officer', 'CONFIGURATION', 'Fees & tiers', false, false, false, false),
  ('Officer', 'CONFIGURATION', 'SMS notifications', false, false, false, false),
  ('Officer', 'USERS & ACCESS', 'User management', false, false, false, false),
  ('Officer', 'USERS & ACCESS', 'Roles & permissions', false, false, false, false),
  ('Officer', 'IT SUPPORT', 'Support tickets', true, true, true, false),
  ('Officer', 'IT SUPPORT', 'Audit logs', false, false, false, false),
  -- Director permissions
  ('Director', 'SUBMISSIONS', 'Submissions', false, true, true, false),
  ('Director', 'SUBMISSIONS', 'Reject submissions', false, false, true, false),
  ('Director', 'SUBMISSIONS', 'Director sign-off', false, false, true, false),
  ('Director', 'APPOINTMENTS', 'Appointment calendar', false, false, true, false),
  ('Director', 'APPOINTMENTS', 'Check-in citizen', false, false, false, false),
  ('Director', 'REVENUE', 'Revenue report', false, true, false, false),
  ('Director', 'REVENUE', 'Settlement log', false, true, false, false),
  ('Director', 'CONFIGURATION', 'Slot configuration', false, false, false, false),
  ('Director', 'CONFIGURATION', 'Blackout dates', false, false, false, false),
  ('Director', 'CONFIGURATION', 'Fees & tiers', false, false, false, false),
  ('Director', 'CONFIGURATION', 'SMS notifications', false, false, false, false),
  ('Director', 'USERS & ACCESS', 'User management', false, false, false, false),
  ('Director', 'USERS & ACCESS', 'Roles & permissions', false, false, false, false),
  ('Director', 'IT SUPPORT', 'Support tickets', true, true, true, false),
  ('Director', 'IT SUPPORT', 'Audit logs', false, false, false, false),
  -- Admin permissions
  ('Admin', 'SUBMISSIONS', 'Submissions', false, true, true, false),
  ('Admin', 'SUBMISSIONS', 'Reject submissions', false, false, true, false),
  ('Admin', 'SUBMISSIONS', 'Director sign-off', false, false, false, false),
  ('Admin', 'APPOINTMENTS', 'Appointment calendar', false, true, true, false),
  ('Admin', 'APPOINTMENTS', 'Check-in citizen', false, false, true, false),
  ('Admin', 'REVENUE', 'Revenue report', false, true, false, false),
  ('Admin', 'REVENUE', 'Settlement log', false, true, false, false),
  ('Admin', 'CONFIGURATION', 'Slot configuration', true, true, true, true),
  ('Admin', 'CONFIGURATION', 'Blackout dates', true, true, true, true),
  ('Admin', 'CONFIGURATION', 'Fees & tiers', true, true, true, false),
  ('Admin', 'CONFIGURATION', 'SMS notifications', true, true, true, false),
  ('Admin', 'USERS & ACCESS', 'User management', true, true, true, true),
  ('Admin', 'USERS & ACCESS', 'Roles & permissions', true, true, true, false),
  ('Admin', 'IT SUPPORT', 'Support tickets', true, true, true, false),
  ('Admin', 'IT SUPPORT', 'Audit logs', false, true, false, false)
ON CONFLICT (role, module, permission_name) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 15. SEED DATA — SMS Templates
-- ─────────────────────────────────────────────────────
INSERT INTO sms_templates (event_type, template_text, is_enabled)
VALUES
  ('application_submitted', 'Dear {name}, your attestation application {app_id} has been received. You will be notified of your appointment details.', true),
  ('appointment_reminder', 'Reminder: Your attestation appointment is scheduled for {date} at {time}. Please arrive 15 minutes early.', true),
  ('status_approved', 'Congratulations! Your attestation application {app_id} has been approved. Please collect your documents.', true),
  ('status_rejected', 'Your attestation application {app_id} requires attention. Please log in to the portal for details.', true),
  ('appointment_cancelled', 'Your appointment on {date} has been cancelled due to {reason}. Please reschedule via the portal.', true)
ON CONFLICT (event_type) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 16. SEED DATA — Portal Settings
-- ─────────────────────────────────────────────────────
INSERT INTO portal_settings (key, value)
VALUES
  ('portal_open', 'true'::jsonb),
  ('maintenance_message', '"The portal is currently under maintenance. Please try again later."'::jsonb),
  ('max_daily_appointments', '50'::jsonb),
  ('office_hours_start', '"08:00"'::jsonb),
  ('office_hours_end', '"16:00"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 17. FUNCTION: Round-robin officer assignment
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION assign_officer_round_robin()
RETURNS UUID AS $$
DECLARE
  selected_officer UUID;
BEGIN
  -- Pick the active officer with the fewest current assignments
  SELECT p.id INTO selected_officer
  FROM profiles p
  LEFT JOIN applications a ON a.assigned_officer_id = p.id 
    AND a.status NOT IN ('Approved', 'Rejected', 'Completed')
  WHERE p.role = 'officer' AND p.status = 'Active'
  GROUP BY p.id
  ORDER BY COUNT(a.id) ASC, RANDOM()
  LIMIT 1;

  RETURN selected_officer;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────
-- 18. FUNCTION: Select available director (max 5/day)
-- ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION select_available_director()
RETURNS UUID AS $$
DECLARE
  selected_director UUID;
BEGIN
  -- Pick an active director who has been forwarded to fewer than 5 times today
  SELECT p.id INTO selected_director
  FROM profiles p
  LEFT JOIN applications a ON a.forwarded_to_director_id = p.id 
    AND a.forwarded_at::date = CURRENT_DATE
  WHERE p.role = 'director' AND p.status = 'Active'
  GROUP BY p.id
  HAVING COUNT(a.id) < 5
  ORDER BY COUNT(a.id) ASC, RANDOM()
  LIMIT 1;

  RETURN selected_director;
END;
$$ LANGUAGE plpgsql;
