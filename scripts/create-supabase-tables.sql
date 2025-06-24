-- Create the lost_found_items table with additional fields for claiming
CREATE TABLE IF NOT EXISTS lost_found_items (
    id BIGSERIAL PRIMARY KEY,
    object_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image_url VARCHAR(500),
    student_number VARCHAR(20) NOT NULL,
    student_nickname VARCHAR(100) NOT NULL,
    found_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location_found VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed')),
    claimed_by VARCHAR(255),
    claimed_date TIMESTAMP,
    claim_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON lost_found_items
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update
CREATE POLICY "Allow authenticated insert" ON lost_found_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON lost_found_items
    FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON lost_found_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_found_date ON lost_found_items(found_date DESC);
CREATE INDEX IF NOT EXISTS idx_lost_found_student ON lost_found_items(student_number);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lost_found_items_updated_at 
    BEFORE UPDATE ON lost_found_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
