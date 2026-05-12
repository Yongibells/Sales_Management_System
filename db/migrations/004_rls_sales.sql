-- ================================================
-- 004_rls_sales.sql
-- RLS Policies for sales table
-- ================================================

-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT
-- USER sees ACTIVE only, ADMIN/SUPERADMIN sees all
CREATE POLICY "sales_select_policy" ON sales
FOR SELECT
USING (
  record_status = 'ACTIVE'
  OR
  (SELECT user_type FROM "user" 
   WHERE userid = auth.uid()) 
   IN ('ADMIN', 'SUPERADMIN')
);

-- Policy 2: INSERT (SALES_ADD = 1)
CREATE POLICY "sales_insert_policy" ON sales
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SALES_ADD'
    AND umr.isallowed = 1
  )
);

-- Policy 3: UPDATE edit (SALES_EDIT = 1)
CREATE POLICY "sales_update_edit_policy" ON sales
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SALES_EDIT'
    AND umr.isallowed = 1
  )
);

-- Policy 4: UPDATE record_status INACTIVE (SALES_DEL = 1)
CREATE POLICY "sales_softdelete_policy" ON sales
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SALES_DEL'
    AND umr.isallowed = 1
  )
);

-- Policy 5: UPDATE record_status ACTIVE - recovery
-- ADMIN/SUPERADMIN only
CREATE POLICY "sales_recover_policy" ON sales
FOR UPDATE
USING (
  (SELECT user_type FROM "user"
   WHERE userid = auth.uid())
   IN ('ADMIN', 'SUPERADMIN')
);