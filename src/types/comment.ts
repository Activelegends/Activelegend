export interface User {
  id: string;
  email: string;
  display_name: string | null;
  profile_image_url: string | null;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  game_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_approved: boolean;
  user: User;
  likes_count: number;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  game_id: string;
  parent_id?: string | null;
  user_id: string;
}

export interface LikeState {
  liked: boolean;
  count: number;
  loading: boolean;
} 