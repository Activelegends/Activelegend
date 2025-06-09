export type CommentStatus = 'pending' | 'approved' | 'hidden';

export interface Comment {
    id: string;
    game_id: string;
    user_id: string;
    content: string;
    likes_count: number;
    status: CommentStatus;
    created_at: string;
    updated_at: string;
    user?: {
        display_name: string;
        email: string;
    };
}

export interface CommentFormData {
    content: string;
    game_id: string;
}

export interface CommentError {
    message: string;
    field?: string;
} 