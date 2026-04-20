-- Create suppliers table for admin supplier management
-- Run this SQL in your PostgreSQL database

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
