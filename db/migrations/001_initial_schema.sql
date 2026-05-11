-- =============================================
-- 001_initial_schema.sql
-- All 6 HopeDB tables for Hope Inc. SMS
-- =============================================

-- 1. customer table (no record_status, no stamp)
CREATE TABLE customer (
  custNo       VARCHAR(10)  PRIMARY KEY,
  custName     VARCHAR(100) NOT NULL,
  address      VARCHAR(200),
  payTerm      VARCHAR(50)
);

-- 2. employee table (no record_status, no stamp)
CREATE TABLE employee (
  empNo        VARCHAR(10)  PRIMARY KEY,
  lastName     VARCHAR(50)  NOT NULL,
  firstName    VARCHAR(50)  NOT NULL,
  gender       CHAR(1),
  hireDate     DATE
);

-- 3. product table (no record_status, no stamp)
CREATE TABLE product (
  prodCode     VARCHAR(10)  PRIMARY KEY,
  description  VARCHAR(200) NOT NULL,
  unit         VARCHAR(20)
);

-- 4. priceHist table (no record_status, no stamp)
CREATE TABLE priceHist (
  prodCode     VARCHAR(10)  NOT NULL REFERENCES product(prodCode),
  effDate      DATE         NOT NULL,
  unitPrice    NUMERIC(10,2) NOT NULL,
  PRIMARY KEY (prodCode, effDate)
);

-- 5. sales table (WITH record_status and stamp)
CREATE TABLE sales (
  transNo      VARCHAR(10)  PRIMARY KEY,
  salesDate    DATE         NOT NULL,
  custNo       VARCHAR(10)  NOT NULL REFERENCES customer(custNo),
  empNo        VARCHAR(10)  NOT NULL REFERENCES employee(empNo),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp        TIMESTAMPTZ  DEFAULT NOW()
);

-- 6. salesDetail table (WITH record_status and stamp)
CREATE TABLE salesDetail (
  transNo      VARCHAR(10)  NOT NULL REFERENCES sales(transNo),
  prodCode     VARCHAR(10)  NOT NULL REFERENCES product(prodCode),
  quantity     INT          NOT NULL,
  unitPrice    NUMERIC(10,2) NOT NULL,
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp        TIMESTAMPTZ  DEFAULT NOW(),
  PRIMARY KEY (transNo, prodCode)
);