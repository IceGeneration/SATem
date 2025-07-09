-- Add image_url column to news table
ALTER TABLE news 
ADD COLUMN image_url TEXT;

-- Update existing records to have null image_url (which is fine)
-- No need to update existing records as NULL is acceptable for optional images
