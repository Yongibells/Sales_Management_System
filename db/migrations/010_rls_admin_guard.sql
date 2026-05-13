-- ================================================
-- 010_rls_admin_guard.sql
-- RLS for user table + UserModule_Rights
-- ADMIN cannot modify SUPERADMIN rows
-- ================================================

-- Enable RLS on user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- SELECT: all authenticated users can see users
CREATE POLICY "user_select_policy" ON "user"
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- UPDATE: ADMIN can only update record_status
-- WHERE user_type != 'SUPERADMIN'
CREATE POLICY "user_update_policy" ON "user"
FOR UPDATE
USING (
  (SELECT user_type FROM "user"
   WHERE userid = auth.uid()) = 'ADMIN'
  AND user_type != 'SUPERADMIN'
);

-- Enable RLS on usermodule_rights
ALTER TABLE usermodule_rights ENABLE ROW LEVEL SECURITY;

-- SELECT: all authenticated users
CREATE POLICY "umr_select_policy" ON usermodule_rights
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT/UPDATE/DELETE: ADMIN cannot modify
-- rows belonging to SUPERADMIN
CREATE POLICY "umr_insert_policy" ON usermodule_rights
FOR INSERT
WITH CHECK (
  (SELECT user_type FROM "user"
   WHERE userid = usermodule_rights.userid) != 'SUPERADMIN'
);

CREATE POLICY "umr_update_policy" ON usermodule_rights
FOR UPDATE
USING (
  (SELECT user_type FROM "user"
   WHERE userid = usermodule_rights.userid) != 'SUPERADMIN'
);

CREATE POLICY "umr_delete_policy" ON usermodule_rights
FOR DELETE
USING (
  (SELECT user_type FROM "user"
   WHERE userid = usermodule_rights.userid) != 'SUPERADMIN'
);