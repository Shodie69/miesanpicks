-- This SQL script seeds the database with sample data
-- It can be run directly in the Supabase SQL editor

-- First, create a test user in the users table
-- Note: This assumes you've already created a user in Supabase Auth
-- with the ID below. Replace with your actual user ID.
INSERT INTO users (id, email, username, full_name, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@example.com', 'admin', 'Admin User', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create categories
INSERT INTO categories (name, slug, description, is_default, display_order, created_at, updated_at)
VALUES
  ('Everything', 'everything', 'All products', true, 0, NOW(), NOW()),
  ('Tablet', 'tablet', 'Tablet devices', false, 1, NOW(), NOW()),
  ('Laptop', 'laptop', 'Laptop computers', false, 2, NOW(), NOW()),
  ('Keyboard', 'keyboard', 'Computer keyboards', false, 3, NOW(), NOW()),
  ('Mousepad', 'mousepad', 'Mouse pads', false, 4, NOW(), NOW()),
  ('Guide', 'guide', 'Product guides', false, 5, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING
RETURNING id, slug;

-- Create products
INSERT INTO products (
  title, description, price, discount_percentage, image_url, 
  source, source_url, rating, review_count, is_hidden, 
  is_pinned, clicks, shares, commission, user_id, created_at, updated_at
)
VALUES
  (
    'Shopple''s Starter Guide for You', 
    'A guide to get started with Shopple', 
    NULL, NULL, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, NULL, NULL, false, 
    false, 1, 0, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  ),
  (
    'NUMVIBE P60 Pro Max New 5G Tablet Android Original Computer WiFi Dual SIM', 
    'High-performance tablet with 5G connectivity', 
    2699, 10, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, 5, 114, false, 
    false, 1, 3, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  ),
  (
    '(SONTU®) Tablet Mini 1 2 3 4 (Best Quality Guaranteed)', 
    'Compact tablet for everyday use', 
    NULL, NULL, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, NULL, NULL, false, 
    false, 1, 0, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  ),
  (
    'K221 Kechi K7 Pro+ Wireless Three-Mode Mechanical Keyboard', 
    'Premium mechanical keyboard with multiple connectivity options', 
    2899, 15, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, 5, 222, false, 
    false, 0, 6, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  ),
  (
    'Lenovo Laptop | Intel i7/i5/i3 & Celeron 4GB 16GB RAM 128GB SSD', 
    'Powerful Lenovo laptop for work and entertainment', 
    2999, 5, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, 5, 321, false, 
    false, 0, 0, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  ),
  (
    'ARTISAN mouse pad NINJA FX Zero ( S / M / L / XL | Soft / Mid / Hard )', 
    'Professional gaming mousepad with multiple size and hardness options', 
    2200, NULL, '/placeholder.svg?height=160&width=160', 
    'shopple.ph', NULL, 5, 84, false, 
    false, 10, 0, 0, '00000000-0000-0000-0000-000000000000', NOW(), NOW()
  )
RETURNING id;

-- Create product-category relationships
-- Note: You'll need to replace the IDs below with the actual IDs from your database
-- This is just a template
INSERT INTO product_categories (product_id, category_id)
VALUES
  -- Replace these IDs with actual IDs from your database
  ('product1-id', (SELECT id FROM categories WHERE slug = 'guide')),
  ('product2-id', (SELECT id FROM categories WHERE slug = 'tablet')),
  ('product3-id', (SELECT id FROM categories WHERE slug = 'tablet')),
  ('product4-id', (SELECT id FROM categories WHERE slug = 'keyboard')),
  ('product5-id', (SELECT id FROM categories WHERE slug = 'laptop')),
  ('product6-id', (SELECT id FROM categories WHERE slug = 'mousepad')),
  -- Add everything category to all products
  ('product1-id', (SELECT id FROM categories WHERE slug = 'everything')),
  ('product2-id', (SELECT id FROM categories WHERE slug = 'everything')),
  ('product3-id', (SELECT id FROM categories WHERE slug = 'everything')),
  ('product4-id', (SELECT id FROM categories WHERE slug = 'everything')),
  ('product5-id', (SELECT id FROM categories WHERE slug = 'everything')),
  ('product6-id', (SELECT id FROM categories WHERE slug = 'everything'));
