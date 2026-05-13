-- Enable RLS sa lahat ng 4 lookup tables
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricehist ENABLE ROW LEVEL SECURITY;

-- SELECT only para sa lahat ng authenticated users
-- Customer
CREATE POLICY "customer_select_policy" ON customer
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Employee
CREATE POLICY "employee_select_policy" ON employee
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Product
CREATE POLICY "product_select_policy" ON product
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- PriceHist
CREATE POLICY "pricehist_select_policy" ON pricehist
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- NO INSERT, UPDATE, DELETE policies for these 4 tables