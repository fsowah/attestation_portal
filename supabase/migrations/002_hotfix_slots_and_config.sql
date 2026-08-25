-- =====================================================
-- 002 — HOTFIX: slot upsert constraint + config table mismatches
-- Run this in the Supabase SQL Editor. Safe to re-run.
-- =====================================================

-- ─────────────────────────────────────────────────────
-- 1. FIX "there is no unique or exclusion constraint
--    matching the ON CONFLICT specification"
--
-- EditSlotDrawer.jsx upserts with onConflict: 'date,time'.
-- Your live appointment_slots table has no UNIQUE(date, time)
-- constraint (the table existed before migration 001, so
-- CREATE TABLE IF NOT EXISTS skipped it — and 001 also aborted
-- on invalid CREATE POLICY IF NOT EXISTS syntax).
-- ─────────────────────────────────────────────────────

-- Remove any duplicate (date, time) rows first, keeping the earliest:
DELETE FROM appointment_slots
WHERE id NOT IN (
  SELECT DISTINCT ON (date, time) id
  FROM appointment_slots
  ORDER BY date, time, created_at ASC
);

ALTER TABLE appointment_slots DROP CONSTRAINT IF EXISTS appointment_slots_date_time_key;
ALTER TABLE appointment_slots ADD CONSTRAINT appointment_slots_date_time_key UNIQUE (date, time);

-- ─────────────────────────────────────────────────────
-- 2. sms_templates: schema used template_text / is_enabled but
--    SmsNotifications.jsx reads/writes message_template / is_active.
--    Rename the columns to match the frontend.
-- ─────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'sms_templates' AND column_name = 'template_text') THEN
    ALTER TABLE sms_templates RENAME COLUMN template_text TO message_template;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'sms_templates' AND column_name = 'is_enabled') THEN
    ALTER TABLE sms_templates RENAME COLUMN is_enabled TO is_active;
  END IF;
END $$;

-- Seed templates if the table is empty (uses the corrected column names):
INSERT INTO sms_templates (event_type, message_template, is_active)
VALUES
  ('application_submitted', 'Dear {{full_name}}, your attestation application {{app_id}} has been received. You will be notified of your appointment details.', true),
  ('appointment_reminder', 'Reminder: Your attestation appointment is scheduled for {{date}} at {{time}}. Please arrive 15 minutes early.', true),
  ('status_approved', 'Congratulations! Your attestation application {{app_id}} has been approved. Please collect your documents.', true),
  ('status_rejected', 'Your attestation application {{app_id}} requires attention. Please log in to the portal for details.', true),
  ('appointment_cancelled', 'Your appointment on {{date}} has been cancelled. Please reschedule via the portal.', true)
ON CONFLICT (event_type) DO NOTHING;

-- ─────────────────────────────────────────────────────
-- 3. portal_settings: PortalSettings.jsx does .order('category')
--    and upserts id / category / description — none of which
--    existed in the original schema. Add them.
-- ─────────────────────────────────────────────────────
ALTER TABLE portal_settings ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE portal_settings ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';
ALTER TABLE portal_settings ADD COLUMN IF NOT EXISTS description TEXT;

INSERT INTO portal_settings (key, value)
VALUES
  ('portal_open', 'true'::jsonb),
  ('maintenance_message', '"The portal is currently under maintenance. Please try again later."'::jsonb),
  ('max_daily_appointments', '50'::jsonb),
  ('office_hours_start', '"08:00"'::jsonb),
  ('office_hours_end', '"16:00"'::jsonb)
ON CONFLICT (key) DO NOTHING;

UPDATE portal_settings SET category = 'General',      description = 'Portal open for new applications'            WHERE key = 'portal_open';
UPDATE portal_settings SET category = 'General',      description = 'Message shown while the portal is closed'    WHERE key = 'maintenance_message';
UPDATE portal_settings SET category = 'Appointments', description = 'Maximum appointments per day'                WHERE key = 'max_daily_appointments';
UPDATE portal_settings SET category = 'Appointments', description = 'Office hours start'                          WHERE key = 'office_hours_start';
UPDATE portal_settings SET category = 'Appointments', description = 'Office hours end'                            WHERE key = 'office_hours_end';

-- ─────────────────────────────────────────────────────
-- 4. RLS POLICIES — original 001 used CREATE POLICY IF NOT EXISTS,
--    which is NOT valid PostgreSQL and made the whole migration
--    fail (and roll back) in the SQL editor. Recreate them all
--    with valid, idempotent syntax. Without these, any table with
--    RLS enabled but no policy rejects every read/write.
-- ─────────────────────────────────────────────────────

ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read appointment_slots"  ON appointment_slots;
DROP POLICY IF EXISTS "Admin can insert appointment_slots" ON appointment_slots;
DROP POLICY IF EXISTS "Admin can update appointment_slots" ON appointment_slots;
DROP POLICY IF EXISTS "Admin can delete appointment_slots" ON appointment_slots;
CREATE POLICY "Anyone can read appointment_slots"  ON appointment_slots FOR SELECT USING (true);
CREATE POLICY "Admin can insert appointment_slots" ON appointment_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update appointment_slots" ON appointment_slots FOR UPDATE USING (true);
CREATE POLICY "Admin can delete appointment_slots" ON appointment_slots FOR DELETE USING (true);

ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read blackout_dates"  ON blackout_dates;
DROP POLICY IF EXISTS "Admin can insert blackout_dates" ON blackout_dates;
DROP POLICY IF EXISTS "Admin can update blackout_dates" ON blackout_dates;
DROP POLICY IF EXISTS "Admin can delete blackout_dates" ON blackout_dates;
CREATE POLICY "Anyone can read blackout_dates"  ON blackout_dates FOR SELECT USING (true);
CREATE POLICY "Admin can insert blackout_dates" ON blackout_dates FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update blackout_dates" ON blackout_dates FOR UPDATE USING (true);
CREATE POLICY "Admin can delete blackout_dates" ON blackout_dates FOR DELETE USING (true);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff can read audit_logs"    ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit_logs" ON audit_logs;
CREATE POLICY "Staff can read audit_logs"    ON audit_logs FOR SELECT USING (true);
CREATE POLICY "System can insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);

ALTER TABLE fees_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read fees_config"  ON fees_config;
DROP POLICY IF EXISTS "Admin can insert fees_config" ON fees_config;
DROP POLICY IF EXISTS "Admin can update fees_config" ON fees_config;
CREATE POLICY "Anyone can read fees_config"  ON fees_config FOR SELECT USING (true);
CREATE POLICY "Admin can insert fees_config" ON fees_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update fees_config" ON fees_config FOR UPDATE USING (true);

ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can read sms_templates"   ON sms_templates;
DROP POLICY IF EXISTS "Admin can insert sms_templates" ON sms_templates;
DROP POLICY IF EXISTS "Admin can update sms_templates" ON sms_templates;
CREATE POLICY "Admin can read sms_templates"   ON sms_templates FOR SELECT USING (true);
CREATE POLICY "Admin can insert sms_templates" ON sms_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update sms_templates" ON sms_templates FOR UPDATE USING (true);

ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read portal_settings"  ON portal_settings;
DROP POLICY IF EXISTS "Admin can insert portal_settings" ON portal_settings;
DROP POLICY IF EXISTS "Admin can update portal_settings" ON portal_settings;
CREATE POLICY "Anyone can read portal_settings"  ON portal_settings FOR SELECT USING (true);
CREATE POLICY "Admin can insert portal_settings" ON portal_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update portal_settings" ON portal_settings FOR UPDATE USING (true);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff can read support_tickets"   ON support_tickets;
DROP POLICY IF EXISTS "Staff can insert support_tickets" ON support_tickets;
DROP POLICY IF EXISTS "Staff can update support_tickets" ON support_tickets;
CREATE POLICY "Staff can read support_tickets"   ON support_tickets FOR SELECT USING (true);
CREATE POLICY "Staff can insert support_tickets" ON support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update support_tickets" ON support_tickets FOR UPDATE USING (true);

ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read roles_permissions" ON roles_permissions;
DROP POLICY IF EXISTS "Admin can insert roles_permissions" ON roles_permissions;
DROP POLICY IF EXISTS "Admin can update roles_permissions" ON roles_permissions;
DROP POLICY IF EXISTS "Admin can delete roles_permissions" ON roles_permissions;
CREATE POLICY "Anyone can read roles_permissions" ON roles_permissions FOR SELECT USING (true);
CREATE POLICY "Admin can insert roles_permissions" ON roles_permissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update roles_permissions" ON roles_permissions FOR UPDATE USING (true);
CREATE POLICY "Admin can delete roles_permissions" ON roles_permissions FOR DELETE USING (true);
