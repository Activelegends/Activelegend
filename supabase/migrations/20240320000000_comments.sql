-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS comments_game_id_idx ON public.comments(game_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at);

-- Enable Row Level Security
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;

-- Create policies
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT
    USING (is_hidden = false);

CREATE POLICY "Users can insert their own comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments"
    ON public.comments
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_roles
            WHERE role = 'admin'
        )
    );

-- Create function to toggle comment like
CREATE OR REPLACE FUNCTION public.toggle_comment_like(comment_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    user_id := auth.uid();
    
    -- Check if user has already liked the comment
    IF EXISTS (
        SELECT 1 FROM public.comment_likes
        WHERE comment_id = toggle_comment_like.comment_id
        AND user_id = auth.uid()
    ) THEN
        -- Unlike
        DELETE FROM public.comment_likes
        WHERE comment_id = toggle_comment_like.comment_id
        AND user_id = auth.uid();
        
        UPDATE public.comments
        SET likes_count = likes_count - 1
        WHERE id = toggle_comment_like.comment_id;
    ELSE
        -- Like
        INSERT INTO public.comment_likes (comment_id, user_id)
        VALUES (toggle_comment_like.comment_id, auth.uid());
        
        UPDATE public.comments
        SET likes_count = likes_count + 1
        WHERE id = toggle_comment_like.comment_id;
    END IF;
END;
$$;

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Enable Row Level Security for comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.comment_likes;

-- Create policies for comment_likes
CREATE POLICY "Comment likes are viewable by everyone"
    ON public.comment_likes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own likes"
    ON public.comment_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
    ON public.comment_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to get comment with user data
CREATE OR REPLACE FUNCTION public.get_comment_with_user(comment_id UUID)
RETURNS TABLE (
    id UUID,
    game_id UUID,
    user_id UUID,
    content TEXT,
    likes_count INTEGER,
    created_at TIMESTAMPTZ,
    is_approved BOOLEAN,
    is_hidden BOOLEAN,
    user_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.game_id,
        c.user_id,
        c.content,
        c.likes_count,
        c.created_at,
        c.is_approved,
        c.is_hidden,
        jsonb_build_object(
            'id', u.id,
            'display_name', u.raw_user_meta_data->>'display_name',
            'avatar_url', u.raw_user_meta_data->>'avatar_url'
        ) as user_data
    FROM public.comments c
    JOIN auth.users u ON c.user_id = u.id
    WHERE c.id = comment_id;
END;
$$; 