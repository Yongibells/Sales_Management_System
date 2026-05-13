-- 005_trigger_provision_user.sql
-- Provision new user with default module/rights on registration

CREATE OR REPLACE FUNCTION provision_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_sales_mod_id INT;
  v_sd_mod_id INT;
  v_lookup_mod_id INT;
  v_adm_mod_id INT;
BEGIN
  -- Insert into user table with INACTIVE status
  INSERT INTO "user" (userid, user_type, record_status)
  VALUES (NEW.id, 'USER', 'INACTIVE')
  ON CONFLICT (userid) DO NOTHING;

  -- Get module IDs
  SELECT moduleid INTO v_sales_mod_id FROM "Module" WHERE modulename = 'Sales_Mod';
  SELECT moduleid INTO v_sd_mod_id FROM "Module" WHERE modulename = 'SD_Mod';
  SELECT moduleid INTO v_lookup_mod_id FROM "Module" WHERE modulename = 'Lookup_Mod';
  SELECT moduleid INTO v_adm_mod_id FROM "Module" WHERE modulename = 'Adm_Mod';

  -- Insert user_module rows
  INSERT INTO user_module (userid, moduleid)
  VALUES
    (NEW.id, v_sales_mod_id),
    (NEW.id, v_sd_mod_id),
    (NEW.id, v_lookup_mod_id),
    (NEW.id, v_adm_mod_id)
  ON CONFLICT DO NOTHING;

  -- Insert rights rows with defaults
  INSERT INTO "UserModule_Rights" (userid, rightsid, rightvalue)
  SELECT NEW.id, rightsid,
    CASE
      WHEN rightname IN ('SALES_VIEW', 'SD_VIEW', 'CUST_LOOKUP', 'EMP_LOOKUP', 'PROD_LOOKUP', 'PRICE_LOOKUP') THEN 1
      ELSE 0
    END
  FROM rights
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION provision_new_user();