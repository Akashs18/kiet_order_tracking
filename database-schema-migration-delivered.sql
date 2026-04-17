-- Migration: Add DELIVERED status support to orders table
-- Description: Adds delivered_at timestamp column to track when orders are delivered

ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP DEFAULT NULL;

-- Verify the migration
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'orders' AND column_name = 'delivered_at';
