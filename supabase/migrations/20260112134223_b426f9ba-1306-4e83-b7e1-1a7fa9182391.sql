-- Adicionar campo para ordenação personalizada
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;