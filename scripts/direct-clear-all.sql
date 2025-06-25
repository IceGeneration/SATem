-- Direct SQL approach to clear all data
-- This is the fastest and most reliable way

-- Delete all items from the table
DELETE FROM lost_found_items;

-- Reset the auto-increment sequence to start from 1
ALTER SEQUENCE lost_found_items_id_seq RESTART WITH 1;

-- Verify the table is empty
SELECT COUNT(*) as remaining_items FROM lost_found_items;

-- Show table structure to confirm everything is working
\d lost_found_items;
