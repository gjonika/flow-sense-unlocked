
-- Add new columns to the projects table
ALTER TABLE public.projects 
ADD COLUMN account_used TEXT,
ADD COLUMN chat_links TEXT[] DEFAULT '{}',
ADD COLUMN analysis_text TEXT,
ADD COLUMN tasks JSONB DEFAULT '[]';
