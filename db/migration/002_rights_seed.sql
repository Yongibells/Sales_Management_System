-- =============================================
-- 002_rights_seed.sql
-- 4 modules, 13 rights, SUPERADMIN seed
-- =============================================

-- 1. user table
CREATE TABLE "user" (
  userId        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  user_type     VARCHAR(20)  NOT NULL DEFAULT 'USER',
  record_status VARCHAR(10)  NOT NULL DEFAULT 'INACTIVE'
);

-- 2. Module table
CREATE TABLE "Module" (
  moduleId      SERIAL       PRIMARY KEY,
  moduleName    VARCHAR(50)  NOT NULL UNIQUE
);

-- 3. user_module table
CREATE TABLE user_module (
  userId        UUID         NOT NULL REFERENCES "user"(userId),
  moduleId      INT          NOT NULL REFERENCES "Module"(moduleId),
  PRIMARY KEY (userId, moduleId)
);

-- 4. rights table
CREATE TABLE rights (
  rightsId      SERIAL       PRIMARY KEY,
  rightsName    VARCHAR(50)  NOT NULL UNIQUE,
  moduleId      INT          NOT NULL REFERENCES "Module"(moduleId)
);

-- 5. UserModule_Rights table
CREATE TABLE "UserModule_Rights" (
  userId        UUID         NOT NULL REFERENCES "user"(userId),
  rightsId      INT          NOT NULL REFERENCES rights(rightsId),
  value         INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (userId, rightsId)
);

-- =============================================
-- Seed 4 modules
-- =============================================
INSERT INTO "Module" (moduleName) VALUES
  ('Sales_Mod'),
  ('SD_Mod'),
  ('Lookup_Mod'),
  ('Adm_Mod');

-- =============================================
-- Seed 13 rights
-- =============================================
INSERT INTO rights (rightsName, moduleId) VALUES
  ('SALES_VIEW',    1),
  ('SALES_ADD',     1),
  ('SALES_EDIT',    1),
  ('SALES_DEL',     1),
  ('SD_VIEW',       2),
  ('SD_ADD',        2),
  ('SD_EDIT',       2),
  ('SD_DEL',        2),
  ('CUST_LOOKUP',   3),
  ('EMP_LOOKUP',    3),
  ('PROD_LOOKUP',   3),
  ('PRICE_LOOKUP',  3),
  ('ADM_USER',      4);