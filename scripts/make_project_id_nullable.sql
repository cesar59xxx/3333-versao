-- Remove a constraint NOT NULL da coluna project_id
-- Isso permite que o backend do Railway funcione sem project_id

ALTER TABLE whatsapp_instances 
ALTER COLUMN project_id DROP NOT NULL;

-- Verificar a estrutura atualizada
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'whatsapp_instances';
