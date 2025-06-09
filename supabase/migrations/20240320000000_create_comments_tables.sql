-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Create RLS policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy for reading comments (only approved comments)
CREATE POLICY "Users can view approved comments"
    ON comments FOR SELECT
    USING (status = 'approved');

-- Policy for inserting comments (authenticated users only)
CREATE POLICY "Authenticated users can insert comments"
    ON comments FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy for updating own comments (authenticated users)
CREATE POLICY "Users can update their own comments"
    ON comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy for admin access (full CRUD)
CREATE POLICY "Admin has full access"
    ON comments FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'email' = 'active.legendss@gmail.com'
    )
    WITH CHECK (
        auth.jwt() ->> 'email' = 'active.legendss@gmail.com'
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 