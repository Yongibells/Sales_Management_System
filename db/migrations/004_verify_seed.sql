-- =============================================
-- 004_verify_seed.sql
-- Row count verification and FK integrity checks
-- =============================================

-- Row counts for all 6 tables
SELECT 'customer'    AS table_name, COUNT(*) AS row_count FROM customer
UNION ALL
SELECT 'employee',                  COUNT(*)              FROM employee
UNION ALL
SELECT 'product',                   COUNT(*)              FROM product
UNION ALL
SELECT 'priceHist',                 COUNT(*)              FROM priceHist
UNION ALL
SELECT 'sales',                     COUNT(*)              FROM sales
UNION ALL
SELECT 'salesDetail',               COUNT(*)              FROM salesDetail;

-- FK integrity check: sales → customer
SELECT s.transNo, s.custNo
FROM sales s
LEFT JOIN customer c ON s.custNo = c.custNo
WHERE c.custNo IS NULL;

-- FK integrity check: sales → employee
SELECT s.transNo, s.empNo
FROM sales s
LEFT JOIN employee e ON s.empNo = e.empNo
WHERE e.empNo IS NULL;

-- FK integrity check: salesDetail → sales
SELECT sd.transNo, sd.prodCode
FROM salesDetail sd
LEFT JOIN sales s ON sd.transNo = s.transNo
WHERE s.transNo IS NULL;

-- FK integrity check: salesDetail → product
SELECT sd.transNo, sd.prodCode
FROM salesDetail sd
LEFT JOIN product p ON sd.prodCode = p.prodCode
WHERE p.prodCode IS NULL;

-- FK integrity check: priceHist → product
SELECT ph.prodCode, ph.effDate
FROM priceHist ph
LEFT JOIN product p ON ph.prodCode = p.prodCode
WHERE p.prodCode IS NULL;

-- Verify record_status DEFAULT on sales
SELECT transNo, record_status FROM sales LIMIT 5;

-- Verify record_status DEFAULT on salesDetail
SELECT transNo, prodCode, record_status FROM salesDetail LIMIT 5;