-- Supabase Database Setup for Rosehill TPV Installations
-- Run this in the Supabase SQL Editor

-- Create installations table
CREATE TABLE installations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    installation_date DATE NOT NULL,
    application TEXT NOT NULL,
    description JSONB NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_installations_updated_at 
    BEFORE UPDATE ON installations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on installations" ON installations
    FOR ALL USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('installation-images', 'installation-images', true);

-- Create storage policy
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'installation-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'installation-images');

-- Insert some sample data (optional)
INSERT INTO installations (
    title, 
    location, 
    installation_date, 
    application, 
    description, 
    slug
) VALUES (
    'Sample Installation', 
    'Sample Location, UK', 
    '2024-01-01', 
    'playground',
    '["This is a sample installation description.", "It shows how the data structure works."]',
    'sample-installation'
);