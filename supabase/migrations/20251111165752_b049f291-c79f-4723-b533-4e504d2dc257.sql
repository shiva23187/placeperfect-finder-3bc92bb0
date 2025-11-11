-- Add property_images table for multiple images per property
CREATE TABLE public.property_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on property_images
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view property images
CREATE POLICY "Anyone can view property images" 
ON public.property_images 
FOR SELECT 
USING (true);

-- Property owners can insert images for their properties
CREATE POLICY "Property owners can insert images" 
ON public.property_images 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_id 
    AND properties.user_id = auth.uid()
  )
);

-- Property owners can delete their property images
CREATE POLICY "Property owners can delete images" 
ON public.property_images 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_id 
    AND properties.user_id = auth.uid()
  )
);

-- Create property_visits table for scheduling visits
CREATE TABLE public.property_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on property_visits
ALTER TABLE public.property_visits ENABLE ROW LEVEL SECURITY;

-- Users can view their own visit requests
CREATE POLICY "Users can view their own visits" 
ON public.property_visits 
FOR SELECT 
USING (auth.uid() = user_id);

-- Property owners can view visits for their properties
CREATE POLICY "Property owners can view visits" 
ON public.property_visits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_id 
    AND properties.user_id = auth.uid()
  )
);

-- Authenticated users can insert visit requests
CREATE POLICY "Users can request visits" 
ON public.property_visits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own visit requests
CREATE POLICY "Users can update their visits" 
ON public.property_visits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Property owners can update visit status
CREATE POLICY "Property owners can update visit status" 
ON public.property_visits 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = property_id 
    AND properties.user_id = auth.uid()
  )
);

-- Add trigger for property_visits updated_at
CREATE TRIGGER update_property_visits_updated_at
BEFORE UPDATE ON public.property_visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();