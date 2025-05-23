-- Create users table (public.users is required for Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  progress INTEGER DEFAULT 0,
  impact INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('lifetime', 'medium-term', 'daily')),
  parent_goal_id UUID REFERENCES public.goals(id),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  estimated_time INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 0,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  completed BOOLEAN DEFAULT false,
  in_progress BOOLEAN DEFAULT false,
  goal_id UUID REFERENCES public.goals(id),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  earned BOOLEAN DEFAULT false,
  date TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  reward TEXT,
  progress INTEGER DEFAULT 0,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_preferences table (for storing user settings, including streak)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL UNIQUE,
  theme TEXT DEFAULT 'light',
  notification_enabled BOOLEAN DEFAULT true,
  streak_current INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  streak_last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subscriptions table (for future Stripe integration)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT,
  status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
DROP POLICY IF EXISTS "Users can view their own data";
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data";
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Goals table policies
DROP POLICY IF EXISTS "Users can view their own goals";
CREATE POLICY "Users can view their own goals"
ON public.goals
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals";
CREATE POLICY "Users can insert their own goals"
ON public.goals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals";
CREATE POLICY "Users can update their own goals"
ON public.goals
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals";
CREATE POLICY "Users can delete their own goals"
ON public.goals
FOR DELETE
USING (auth.uid() = user_id);

-- Tasks table policies
DROP POLICY IF EXISTS "Users can view their own tasks";
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tasks";
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks";
CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks";
CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Achievements table policies
DROP POLICY IF EXISTS "Users can view their own achievements";
CREATE POLICY "Users can view their own achievements"
ON public.achievements
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own achievements";
CREATE POLICY "Users can insert their own achievements"
ON public.achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own achievements";
CREATE POLICY "Users can update their own achievements"
ON public.achievements
FOR UPDATE
USING (auth.uid() = user_id);

-- Milestones table policies
DROP POLICY IF EXISTS "Users can view their own milestones";
CREATE POLICY "Users can view their own milestones"
ON public.milestones
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own milestones";
CREATE POLICY "Users can insert their own milestones"
ON public.milestones
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own milestones";
CREATE POLICY "Users can update their own milestones"
ON public.milestones
FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own milestones";
CREATE POLICY "Users can delete their own milestones"
ON public.milestones
FOR DELETE
USING (auth.uid() = user_id);

-- User preferences table policies
DROP POLICY IF EXISTS "Users can view their own preferences";
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences";
CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences";
CREATE POLICY "Users can update their own preferences"
ON public.user_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Subscriptions table policies
DROP POLICY IF EXISTS "Users can view their own subscriptions";
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.achievements;
alter publication supabase_realtime add table public.milestones;
alter publication supabase_realtime add table public.user_preferences;
alter publication supabase_realtime add table public.subscriptions;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create a trigger to create user preferences when a user is created
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON public.users
FOR EACH ROW EXECUTE PROCEDURE create_user_preferences();