-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  personality JSONB DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '{}'::jsonb,
  goals JSONB DEFAULT '{}'::jsonb,
  motivators JSONB DEFAULT '{}'::jsonb,
  streak_current INTEGER DEFAULT 0,
  streak_best INTEGER DEFAULT 0,
  streak_last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for user_preferences
DROP POLICY IF EXISTS "Users can only access their own preferences" ON user_preferences;
CREATE POLICY "Users can only access their own preferences"
ON user_preferences
USING (auth.uid() = user_id);

-- Add realtime
alter publication supabase_realtime add table user_preferences;
