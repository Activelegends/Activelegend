import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData, DatabaseComment, Like } from '../types/comment';

class CommentService {
  async getComments(gameId: string): Promise<Comment[]> {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        user_id,
        game_id,
        parent_id,
        created_at,
        updated_at,
        is_pinned,
        likes_count,
        user:users (
          id,
          display_name,
          profile_image_url
        ),
        replies:comments (
          id,
          content,
          created_at,
          is_pinned,
          likes_count,
          user:users (
            id,
            display_name,
            profile_image_url
          )
        )
      `)
      .eq('game_id', gameId)
      .is('parent_id', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (comments || []) as unknown as Comment[];
  }

  async addComment(commentData: CommentFormData): Promise<Comment> {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content: commentData.content,
        game_id: commentData.game_id,
        parent_id: commentData.parent_id || null,
        user_id: commentData.user_id,
        is_pinned: false,
        likes_count: 0
      })
      .select(`
        id,
        content,
        user_id,
        game_id,
        parent_id,
        created_at,
        updated_at,
        is_pinned,
        likes_count,
        user:users (
          id,
          display_name,
          profile_image_url
        )
      `)
      .single();

    if (error) throw error;
    return comment as unknown as Comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }

  async toggleLike(commentId: string, userId: string): Promise<void> {
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', (existingLike as Like).id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('likes')
        .insert([{ comment_id: commentId, user_id: userId }]);

      if (error) throw error;
    }
  }

  async hasLiked(commentId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    return !!data;
  }

  async togglePin(commentId: string): Promise<void> {
    const { data: comment } = await supabase
      .from('comments')
      .select('is_pinned')
      .eq('id', commentId)
      .single();

    if (!comment) throw new Error('Comment not found');

    const { error } = await supabase
      .from('comments')
      .update({ is_pinned: !comment.is_pinned })
      .eq('id', commentId);

    if (error) throw error;
  }

  async toggleApproval(commentId: string): Promise<void> {
    try {
      const { data: comment, error: fetchError } = await supabase
        .from('comments')
        .select('is_approved')
        .eq('id', commentId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('comments')
        .update({ is_approved: !comment.is_approved })
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling approval:', error);
      throw error;
    }
  }

  subscribeToComments(gameId: string, callback: (payload: any) => void) {
    return supabase
      .channel('comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `game_id=eq.${gameId}`
        },
        callback
      )
      .subscribe();
  }
}

export const commentService = new CommentService(); 