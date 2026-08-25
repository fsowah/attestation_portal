-- =====================================================
-- FIX USER DELETION FOREIGN KEY CONSTRAINTS
-- Run this in Supabase SQL Editor
-- =====================================================
-- This script dynamically finds all foreign keys referencing auth.users(id)
-- and updates them to either ON DELETE CASCADE (for profiles.id) 
-- or ON DELETE SET NULL (for audit logs, created_by, etc.)
-- This prevents the "Database error deleting user" issue in the Supabase Dashboard.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            tc.table_schema, 
            tc.table_name, 
            kcu.column_name, 
            tc.constraint_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'users' AND ccu.table_schema = 'auth'
    LOOP
        -- Drop the existing constraint
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.constraint_name);
        
        -- Add it back with the proper ON DELETE rule
        IF r.table_name = 'profiles' AND r.column_name = 'id' THEN
            -- The main profile row should be deleted when the auth user is deleted
            EXECUTE format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE CASCADE', 
                           r.table_schema, r.table_name, r.constraint_name, r.column_name);
        ELSE
            -- Anything else (e.g. applications, logs) should just set the reference to NULL
            -- to preserve the historical data
            EXECUTE format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE SET NULL', 
                           r.table_schema, r.table_name, r.constraint_name, r.column_name);
        END IF;
    END LOOP;
END;
$$;
