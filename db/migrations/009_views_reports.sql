-- ================================================
-- 009_views_reports.sql
-- Report Views
-- ================================================

-- View 1: sales_by_employee
CREATE OR REPLACE VIEW sales_by_employee AS
SELECT
  e.empno,
  e.lastname || ', ' || e.firstname AS empname,
  COUNT(DISTINCT s.transno) AS total_transactions,
  SUM(sd.qty * ph.unitprice) AS total_revenue
FROM sales s
JOIN employee e ON e.empno = s.empno
JOIN salesdetail sd ON sd.transno = s.transno
JOIN pricehist ph ON ph.prodcode = sd.prodcode
  AND ph.effdate = (
    SELECT MAX(effdate) FROM pricehist
    WHERE prodcode = sd.prodcode
  )
WHERE s.record_status = 'ACTIVE'
GROUP BY e.empno, e.lastname, e.firstname
ORDER BY total_revenue DESC;

-- View 2: sales_by_customer
CREATE OR REPLACE VIEW sales_by_customer AS
SELECT
  c.custno,
  c.custname,
  COUNT(DISTINCT s.transno) AS total_transactions,
  SUM(sd.qty * ph.unitprice) AS total_spend
FROM sales s
JOIN customer c ON c.custno = s.custno
JOIN salesdetail sd ON sd.transno = s.transno
JOIN pricehist ph ON ph.prodcode = sd.prodcode
  AND ph.effdate = (
    SELECT MAX(effdate) FROM pricehist
    WHERE prodcode = sd.prodcode
  )
WHERE s.record_status = 'ACTIVE'
GROUP BY c.custno, c.custname
ORDER BY total_spend DESC;

-- View 3: top_products_sold
CREATE OR REPLACE VIEW top_products_sold AS
SELECT
  p.prodcode,
  p.description,
  p.unit,
  SUM(sd.qty) AS total_qty_sold,
  SUM(sd.qty * ph.unitprice) AS total_revenue
FROM salesdetail sd
JOIN product p ON p.prodcode = sd.prodcode
JOIN pricehist ph ON ph.prodcode = sd.prodcode
  AND ph.effdate = (
    SELECT MAX(effdate) FROM pricehist
    WHERE prodcode = sd.prodcode
  )
WHERE sd.record_status = 'ACTIVE'
GROUP BY p.prodcode, p.description, p.unit
ORDER BY total_revenue DESC;

-- View 4: monthly_sales_trend
CREATE OR REPLACE VIEW monthly_sales_trend AS
SELECT
  TO_CHAR(s.salesdate, 'YYYY-MM') AS sale_month,
  COUNT(DISTINCT s.transno) AS transaction_count,
  SUM(sd.qty * ph.unitprice) AS total_revenue
FROM sales s
JOIN salesdetail sd ON sd.transno = s.transno
JOIN pricehist ph ON ph.prodcode = sd.prodcode
  AND ph.effdate = (
    SELECT MAX(effdate) FROM pricehist
    WHERE prodcode = sd.prodcode
  )
WHERE s.record_status = 'ACTIVE'
GROUP BY TO_CHAR(s.salesdate, 'YYYY-MM')
ORDER BY sale_month ASC;