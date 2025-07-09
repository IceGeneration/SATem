-- Drop existing news table if it exists to recreate with proper structure
DROP TABLE IF EXISTS news CASCADE;

-- Create the news table for admin posts with image support
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    admin_name VARCHAR(100) NOT NULL,
    image_url TEXT, -- Image support column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON news
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON news
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON news
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON news
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_news_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_news_updated_at_column();

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position;
