-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Visible games are viewable by everyone" ON games;

-- Add status column to games table
ALTER TABLE games
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'coming_soon'
CHECK (status IN ('in_progress', 'released', 'coming_soon'));

-- Add content_blocks column to games table
ALTER TABLE games
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);

-- Create index on content_blocks for faster JSON operations
CREATE INDEX IF NOT EXISTS idx_games_content_blocks ON games USING gin (content_blocks);

-- Recreate the policy
CREATE POLICY "Visible games are viewable by everyone"
ON games FOR SELECT
USING (is_visible = true); 