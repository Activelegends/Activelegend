export interface Comment {
  id: string;
  game_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  likes_count: number;
  is_pinned: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  profile_image_url: string;
  is_special: boolean;
  display_name?: string;
}

export interface CommentFormData {
  content: string;
  game_id: string;
  parent_comment_id?: string | null;
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  submittingError: string | null;
} 