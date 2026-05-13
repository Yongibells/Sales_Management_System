-- Enable RLS
ALTER TABLE salesdetail ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT
CREATE POLICY "salesdetail_select_policy" ON salesdetail
FOR SELECT
USING (
  record_status = 'ACTIVE'
  OR
  (SELECT user_type FROM "user"
   WHERE userid = auth.uid())
   IN ('ADMIN', 'SUPERADMIN')
);

-- Policy 2: INSERT (SD_ADD = 1)
CREATE POLICY "salesdetail_insert_policy" ON salesdetail
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SD_ADD'
    AND umr.isallowed = 1
  )
);

-- Policy 3: UPDATE edit (SD_EDIT = 1)
CREATE POLICY "salesdetail_update_policy" ON salesdetail
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SD_EDIT'
    AND umr.isallowed = 1
  )
);

-- Policy 4: UPDATE record_status INACTIVE (SD_DEL = 1)
CREATE POLICY "salesdetail_softdelete_policy" ON salesdetail
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM usermodule_rights umr
    JOIN rights r ON r.rightsid = umr.rightsid
    WHERE umr.userid = auth.uid()
    AND r.rightsname = 'SD_DEL'
    AND umr.isallowed = 1
  )
);

-- Policy 5: Recovery - ADMIN/SUPERADMIN only
CREATE POLICY "salesdetail_recover_policy" ON salesdetail
FOR UPDATE
USING (
  (SELECT user_type FROM "user"
   WHERE userid = auth.uid())
   IN ('ADMIN', 'SUPERADMIN')
);