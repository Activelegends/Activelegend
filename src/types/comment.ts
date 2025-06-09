export interface Comment {
  id: string;
  content: string;
  user_id: string;
  game_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
    profile_image_url: string | null;
  };
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