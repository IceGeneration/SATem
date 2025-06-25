-- Drop the broken table if it exists
DROP TABLE IF EXISTS lost_found_items CASCADE;

-- Recreate the table with proper structure
CREATE TABLE lost_found_items (
    id BIGSERIAL PRIMARY KEY,
    object_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    student_number VARCHAR(20) NOT NULL,
    student_nickname VARCHAR(100) NOT NULL,
    found_date TEXT NOT NULL,
    location_found VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed')),
    item_type VARCHAR(10) DEFAULT 'found' CHECK (item_type IN ('lost', 'found')),
    claimed_by VARCHAR(255),
    claimed_date TIMESTAMP,
    claim_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" ON lost_found_items
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON lost_found_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON lost_found_items
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON lost_found_items
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON lost_found_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_found_created_at ON lost_found_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lost_found_item_type ON lost_found_items(item_type);
CREATE INDEX IF NOT EXISTS idx_lost_found_student ON lost_found_items(student_number);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_lost_found_items_updated_at 
    BEFORE UPDATE ON lost_found_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'lost_found_items' 
ORDER BY ordinal_position;
