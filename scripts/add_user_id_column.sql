-- Adiciona a coluna user_id na tabela whatsapp_instances
-- Isso permite que o código antigo (que usa user_id) funcione

-- 1. Adiciona a coluna user_id
ALTER TABLE whatsapp_instances 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Popula user_id baseado no owner_id do projeto
UPDATE whatsapp_instances wi
SET user_id = p.owner_id
FROM projects p
WHERE wi.project_id = p.id
AND wi.user_id IS NULL;

-- 3. Cria índice para performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_user_id 
ON whatsapp_instances(user_id);

-- 4. Adiciona RLS policy para user_id (mantendo compatibilidade)
DROP POLICY IF EXISTS "Users can view their own instances by user_id" ON whatsapp_instances;
CREATE POLICY "Users can view their own instances by user_id"
ON whatsapp_instances FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create instances with user_id" ON whatsapp_instances;
CREATE POLICY "Users can create instances with user_id"
ON whatsapp_instances FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own instances by user_id" ON whatsapp_instances;
CREATE POLICY "Users can update their own instances by user_id"
ON whatsapp_instances FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own instances by user_id" ON whatsapp_instances;
CREATE POLICY "Users can delete their own instances by user_id"
ON whatsapp_instances FOR DELETE
USING (auth.uid() = user_id);
