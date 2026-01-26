-- Add reminder_at column to items table for reminders
ALTER TABLE public.items ADD COLUMN reminder_at timestamp with time zone DEFAULT NULL;