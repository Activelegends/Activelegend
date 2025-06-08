export interface Comment {
  id: string;
  game_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
  is_approved?: boolean;
  is_hidden?: boolean;
}

export interface CommentFormData {
  content: string;
  game_id: string;
}

export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
} 