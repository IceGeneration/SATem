-- Change the found_date column from DATE to TEXT to allow flexible date formats
ALTER TABLE lost_found_items 
ALTER COLUMN found_date TYPE TEXT;

-- Update any existing NULL values to empty string if needed
UPDATE lost_found_items 
SET found_date = '' 
WHERE found_date IS NULL;
