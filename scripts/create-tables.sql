-- Create the lost_found_items table
CREATE TABLE IF NOT EXISTS lost_found_items (
    id SERIAL PRIMARY KEY,
    object_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    image_url VARCHAR(500),
    student_number VARCHAR(20) NOT NULL,
    student_nickname VARCHAR(100) NOT NULL,
    found_date DATE NOT NULL DEFAULT CURRENT_DATE,
    location_found VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'claimed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_lost_found_status ON lost_found_items(status);

-- Create an index on found_date for sorting
CREATE INDEX IF NOT EXISTS idx_lost_found_date ON lost_found_items(found_date DESC);
