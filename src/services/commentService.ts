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
          display_name,
          profile_image_url,
          is_special
        )
      `)
      .eq('game_id', gameId)
      .is('parent_comment_id', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getReplies(commentId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users (
          id,
          email,
          display_name,
          profile_image_url,
          is_special
        )
      `)
      .eq('parent_comment_id', commentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addComment(comment: CommentFormData): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateComment(commentId: string, updates: Partial<Comment>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  async toggleLike(commentId: string, userId: string): Promise<void> {
    const { data: existingLike, error: fetchError } = await supabase
      .from('comment_likes')
      .select()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingLike) {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('comment_likes')
        .insert([{ comment_id: commentId, user_id: userId }]);
      if (error) throw error;
    }
  },

  async togglePin(commentId: string): Promise<void> {
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('is_pinned')
      .eq('id', commentId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('comments')
      .update({ is_pinned: !comment.is_pinned })
      .eq('id', commentId);

    if (error) throw error;
  },

  async toggleApproval(commentId: string): Promise<void> {
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

  subscribeToLikes(commentId: string, callback: (payload: any) => void) {
    return supabase
      .channel('likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_likes',
          filter: `comment_id=eq.${commentId}`,
        },
        callback
      )
      .subscribe();
  },
}; 