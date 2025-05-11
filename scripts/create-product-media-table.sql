-- Create product_media table
CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'thumbnail')),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON product_media(product_id);

-- Create RLS policies
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- Policy for selecting product media (anyone can view)
CREATE POLICY select_product_media ON product_media
  FOR SELECT USING (true);

-- Policy for inserting product media (authenticated users only)
CREATE POLICY insert_product_media ON product_media
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy for updating product media (authenticated users only)
CREATE POLICY update_product_media ON product_media
  FOR UPDATE TO authenticated USING (true);

-- Policy for deleting product media (authenticated users only)
CREATE POLICY delete_product_media ON product_media
  FOR DELETE TO authenticated USING (true);
