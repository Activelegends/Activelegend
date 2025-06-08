import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData } from '../types/comment';

export const commentService = {
  async getComments(gameId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users!inner(
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('game_id', gameId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
    return data || [];
  },

  async addComment(comment: CommentFormData): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        ...comment,
        user_id: user.id,
        is_approved: true // Auto-approve comments for now
      }])
      .select(`
        *,
        user:users!inner(
          id,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
    return data;
  },

  async toggleLike(commentId: string): Promise<void> {
    const { error } = await supabase.rpc('toggle_comment_like', {
      comment_id: commentId
    });

    if (error) throw error;
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  async hideComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({ is_hidden: true })
      .eq('id', commentId);

    if (error) throw error;
  },

  async approveComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({ is_approved: true })
      .eq('id', commentId);

    if (error) throw error;
  },

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
}; 