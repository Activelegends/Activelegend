-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  profile_image_url TEXT,
  avatar_url TEXT,
  is_special BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT content_length CHECK (char_length(content) >= 5 AND char_length(content) <= 500)
);

-- Create comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON public.comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON public.comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON public.comment_likes(user_id);

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS ensure_user_exists_before_comment ON public.comments;
DROP TRIGGER IF EXISTS ensure_user_exists_before_like ON public.comment_likes;
DROP TRIGGER IF EXISTS update_comment_likes_count_insert ON public.comment_likes;
DROP TRIGGER IF EXISTS update_comment_likes_count_delete ON public.comment_likes;

-- Then drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_user_exists() CASCADE;
DROP FUNCTION IF EXISTS public.update_comment_likes_count() CASCADE;

-- Create function to update likes_count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to ensure user exists
CREATE OR REPLACE FUNCTION public.ensure_user_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.user_id) THEN
    INSERT INTO public.users (id, email, display_name)
    SELECT id, email, raw_user_meta_data->>'full_name'
    FROM auth.users
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, profile_image_url, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    profile_image_url = COALESCE(EXCLUDED.profile_image_url, users.profile_image_url),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle user update
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    display_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      users.display_name,
      SPLIT_PART(NEW.email, '@', 1)
    ),
    profile_image_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      users.profile_image_url
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      users.avatar_url
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_update();

CREATE TRIGGER ensure_user_exists_before_comment
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_exists();

CREATE TRIGGER ensure_user_exists_before_like
  BEFORE INSERT ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_exists();

CREATE TRIGGER update_comment_likes_count_insert
  AFTER INSERT ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_likes_count();

CREATE TRIGGER update_comment_likes_count_delete
  AFTER DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_likes_count();

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.comment_likes;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON public.users FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'active.legendss@gmail.com'
  );

CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (is_approved = true);

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
  ON public.comments FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'active.legendss@gmail.com'
  );

-- Updated comment_likes policies
CREATE POLICY "Comment likes are viewable by everyone"
  ON public.comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own likes"
  ON public.comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.comment_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own likes"
  ON public.comment_likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all likes"
  ON public.comment_likes FOR ALL
  USING (
    auth.jwt() ->> 'email' = 'active.legendss@gmail.com'
  ); 