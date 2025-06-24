-- Update the image_url column to handle longer base64 strings
ALTER TABLE lost_found_items 
ALTER COLUMN image_url TYPE TEXT;
