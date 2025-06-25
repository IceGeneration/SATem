-- Add item_type column to distinguish between lost and found items
ALTER TABLE lost_found_items 
ADD COLUMN item_type VARCHAR(10) DEFAULT 'found' CHECK (item_type IN ('lost', 'found'));

-- Update existing records to be 'found' type
UPDATE lost_found_items SET item_type = 'found' WHERE item_type IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_lost_found_item_type ON lost_found_items(item_type);
