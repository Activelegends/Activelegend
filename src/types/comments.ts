export interface User {
  id: string;
  display_name: string;
  profile_image_url: string | null;
  is_special: boolean;
}

export interface Comment {
  id: string;
  content: string;
  game_id: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_approved: boolean;
  user: User | null;
}

export interface CommentFormData {
  content: string;
  game_id: string;
  parent_comment_id?: string;
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

export interface LikeState {
  liked: boolean;
  count: number;
  loading: boolean;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
} 