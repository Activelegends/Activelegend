import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData } from '../types/comments';

export const commentService = {
  async getComments(gameId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users (
          id,
          email,
          profile_image_url,
          is_special,
          display_name
        )
      `)
      .eq('game_id', gameId)
      .eq('is_approved', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addComment(comment: CommentFormData): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        ...comment,
        likes_count: 0,
        is_pinned: false,
        is_approved: true,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleLike(commentId: string, userId: string): Promise<void> {
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
    } else {
      await supabase
        .from('comment_likes')
        .insert([{ comment_id: commentId, user_id: userId }]);

      await supabase.rpc('increment_comment_likes', { comment_id: commentId });
    }
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
          filter: `game_id=eq.${gameId}`,
        },
        callback
      )
      .subscribe();
  },
}; 