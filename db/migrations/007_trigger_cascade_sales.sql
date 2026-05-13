-- 007_trigger_cascade_sales.sql
-- Trigger: Cascade deactivate salesDetail when sale is deactivated

CREATE OR REPLACE FUNCTION cascade_deactivate_salesdetail()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.record_status = 'inactive' AND OLD.record_status = 'active' THEN
    UPDATE salesdetail
    SET record_status = 'inactive'
    WHERE transno = NEW.transno;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_cascade_deactivate_salesdetail
AFTER UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION cascade_deactivate_salesdetail();