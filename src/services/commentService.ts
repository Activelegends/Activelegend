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
    try {
      // First check if the user has already liked the comment
      const { data: existingLike, error: fetchError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingLike) {
        // If the user has already liked the comment, remove the like
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (deleteError) {
          throw deleteError;
        }
      } else {
        // If the user hasn't liked the comment yet, add a like
        const { error: insertError } = await supabase
          .from('comment_likes')
          .insert([{ comment_id: commentId, user_id: userId }]);
        
        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
      throw error;
    }
  },

  async hasLiked(commentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasLiked:', error);
      return false;
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