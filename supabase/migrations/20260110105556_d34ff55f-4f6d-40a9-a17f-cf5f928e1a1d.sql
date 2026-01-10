-- Create enum for item types
CREATE TYPE public.item_type AS ENUM ('note', 'task', 'idea', 'event', 'goal', 'project');

-- Create enum for item status
CREATE TYPE public.item_status AS ENUM ('active', 'completed', 'archived', 'in_progress', 'raw', 'evolving');

-- Create enum for priority
CREATE TYPE public.priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create items table (main table for all content types)
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.item_type NOT NULL,
  content TEXT NOT NULL,
  title TEXT,
  status public.item_status NOT NULL DEFAULT 'active',
  priority public.priority_level DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  parent_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  is_important BOOLEAN DEFAULT false,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create connections table for mind map relationships
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_id, target_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Items RLS policies
CREATE POLICY "Users can view their own items" 
  ON public.items FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items" 
  ON public.items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
  ON public.items FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" 
  ON public.items FOR DELETE 
  USING (auth.uid() = user_id);

-- Connections RLS policies
CREATE POLICY "Users can view their own connections" 
  ON public.connections FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections" 
  ON public.connections FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections" 
  ON public.connections FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_type ON public.items(type);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX idx_items_due_date ON public.items(due_date);
CREATE INDEX idx_connections_user_id ON public.connections(user_id);
CREATE INDEX idx_connections_source ON public.connections(source_id);
CREATE INDEX idx_connections_target ON public.connections(target_id);