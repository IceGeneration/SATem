-- Update the database schema to use single description field
-- Remove the full_description column and keep only description
ALTER TABLE lost_found_items DROP COLUMN IF EXISTS full_description;

-- Make sure description column can handle longer text
ALTER TABLE lost_found_items ALTER COLUMN description TYPE TEXT;
