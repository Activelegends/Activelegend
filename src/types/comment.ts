export interface User {
  id: string;
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
  likes_count: number;
  user: User;
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

export interface DatabaseComment {
  id: string;
  content: string;
  user_id: string;
  game_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  likes_count: number;
  user: {
    id: string;
    display_name: string | null;
    profile_image_url: string | null;
  };
  replies?: DatabaseComment[];
}

export interface Like {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
} 