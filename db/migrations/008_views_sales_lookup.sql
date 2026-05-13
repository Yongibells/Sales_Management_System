-- 008_views_sales_lookup.sql
-- Views: sales_with_lookup and salesdetail_with_product

CREATE OR REPLACE VIEW sales_with_lookup AS
SELECT 
  s.transno,
  s.salesdate,
  s.record_status,
  c.custno,
  c.custname,
  e.empno,
  e.firstname || ' ' || e.lastname AS empname
FROM sales s
JOIN customer c ON s.custno = c.custno
JOIN employee e ON s.empno = e.empno;

CREATE OR REPLACE VIEW salesdetail_with_product AS
SELECT 
  sd.transno,
  sd.record_status,
  p.prodcode,
  p.description,
  p.unit,
  sd.quantity
FROM salesdetail sd
JOIN product p ON sd.prodcode = p.prodcode;