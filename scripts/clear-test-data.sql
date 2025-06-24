-- Clear all existing test data from the lost_found_items table
DELETE FROM lost_found_items;

-- Reset the sequence to start from 1 again
ALTER SEQUENCE lost_found_items_id_seq RESTART WITH 1;
