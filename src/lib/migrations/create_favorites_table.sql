-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, game_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_game_id ON favorites(game_id);

-- Add RLS policies
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own favorites
CREATE POLICY "Users can view their own favorites"
ON favorites FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own favorites
CREATE POLICY "Users can add their own favorites"
ON favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own favorites
CREATE POLICY "Users can remove their own favorites"
ON favorites FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for the favorites table
ALTER PUBLICATION supabase_realtime ADD TABLE favorites;

-- Enable row level security for realtime
ALTER TABLE favorites REPLICA IDENTITY FULL; 