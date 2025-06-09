import type { User } from '@supabase/supabase-js';

export interface Comment {
  id: string;
  content: string;
  game_id: string;
  user_id: string;
  user: User;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_approved: boolean;
  parent_comment_id: string | null;
  likes_count: number;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  game_id: string;
  parent_comment_id?: string;
}

export interface LikeState {
  liked: boolean;
  loading: boolean;
  count: number;
} 