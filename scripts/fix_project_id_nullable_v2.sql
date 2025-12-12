-- Remove the NOT NULL constraint from project_id column
-- This allows instances to be created with just user_id (Railway backend)

-- First, drop any existing foreign key constraint on project_id
ALTER TABLE whatsapp_instances 
DROP CONSTRAINT IF EXISTS whatsapp_instances_project_id_fkey;

-- Now alter the column to allow NULL values
ALTER TABLE whatsapp_instances 
ALTER COLUMN project_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULLs
ALTER TABLE whatsapp_instances 
ADD CONSTRAINT whatsapp_instances_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'whatsapp_instances' 
AND column_name IN ('project_id', 'user_id');
