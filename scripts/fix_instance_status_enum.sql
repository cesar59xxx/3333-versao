-- Add 'disconnected' value to the instance_status enum
-- This is needed because the backend code uses 'disconnected' as a status

ALTER TYPE instance_status ADD VALUE IF NOT EXISTS 'disconnected';
ALTER TYPE instance_status ADD VALUE IF NOT EXISTS 'connecting';
ALTER TYPE instance_status ADD VALUE IF NOT EXISTS 'connected';
ALTER TYPE instance_status ADD VALUE IF NOT EXISTS 'qr_code';
ALTER TYPE instance_status ADD VALUE IF NOT EXISTS 'error';
