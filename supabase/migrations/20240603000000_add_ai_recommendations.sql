-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES public.tasks(id),
  recommendation_type TEXT CHECK (recommendation_type IN ('priority', 'scheduling', 'strategy')),
  content TEXT NOT NULL,
  reasoning TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_recommendations
DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view their own recommendations"
ON public.ai_recommendations
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can insert their own recommendations"
ON public.ai_recommendations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can update their own recommendations"
ON public.ai_recommendations
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can delete their own recommendations"
ON public.ai_recommendations
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Enable realtime
alter publication supabase_realtime add table public.ai_recommendations;