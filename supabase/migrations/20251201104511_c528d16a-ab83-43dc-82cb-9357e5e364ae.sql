-- Create import_settings table for configurable import timing
CREATE TABLE public.import_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled boolean NOT NULL DEFAULT false,
  frequency text NOT NULL DEFAULT 'every_2_days' CHECK (frequency IN ('daily', 'every_2_days', 'weekly')),
  import_hour integer NOT NULL DEFAULT 10 CHECK (import_hour >= 0 AND import_hour <= 23),
  last_import_at timestamp with time zone,
  next_import_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.import_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage import settings
CREATE POLICY "Admins can view import settings" ON public.import_settings
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update import settings" ON public.import_settings
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create imported_recipes table for tracking imports and preventing duplicates
CREATE TABLE public.imported_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_recipe_id uuid NOT NULL,
  source_project text NOT NULL DEFAULT 'recipe-pixie',
  local_recipe_id uuid REFERENCES public.recipes(id) ON DELETE SET NULL,
  imported_at timestamp with time zone NOT NULL DEFAULT now(),
  raw_data jsonb,
  UNIQUE(source_recipe_id, source_project)
);

-- Enable RLS
ALTER TABLE public.imported_recipes ENABLE ROW LEVEL SECURITY;

-- Only admins can view imported recipes log
CREATE POLICY "Admins can view imported recipes" ON public.imported_recipes
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Insert initial settings row
INSERT INTO public.import_settings (enabled, frequency, import_hour)
VALUES (false, 'every_2_days', 10);

-- Add trigger for updated_at on import_settings
CREATE TRIGGER update_import_settings_updated_at
  BEFORE UPDATE ON public.import_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();