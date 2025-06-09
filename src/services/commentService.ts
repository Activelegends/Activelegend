import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData } from '../types/comment';

export const commentService = {
  async getComments(gameId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          game_id,
          user_id,
          content,
          likes_count,
          created_at,
          is_approved,
          is_hidden,
          user:users (
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

      return (data || []).map(comment => ({
        ...comment,
        user: comment.user?.[0] || null
      })) as Comment[];
    } catch (error) {
      console.error('Error in getComments:', error);
      throw error;
    }
  },

  async addComment(comment: CommentFormData): Promise<Comment> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: insertedComment, error: insertError } = await supabase
        .from('comments')
        .insert({
          game_id: comment.game_id,
          user_id: user.id,
          content: comment.content,
          is_approved: true,
          is_hidden: false,
          likes_count: 0
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting comment:', insertError);
        throw insertError;
      }

      const { data: completeComment, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          game_id,
          user_id,
          content,
          likes_count,
          created_at,
          is_approved,
          is_hidden,
          user:users (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('id', insertedComment.id)
        .single();

      if (fetchError) {
        console.error('Error fetching inserted comment:', fetchError);
        throw fetchError;
      }

      return {
        ...completeComment,
        user: completeComment.user?.[0] || null
      } as Comment;
    } catch (error) {
      console.error('Error in addComment:', error);
      throw error;
    }
  },

  async toggleLike(commentId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('toggle_comment_like', {
        comment_id: commentId
      });

      if (error) {
        console.error('Error toggling like:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in toggleLike:', error);
      throw error;
    }
  },

  async deleteComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    }
  },

  async hideComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_hidden: true })
        .eq('id', commentId);

      if (error) {
        console.error('Error hiding comment:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in hideComment:', error);
      throw error;
    }
  },

  async approveComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_approved: true })
        .eq('id', commentId);

      if (error) {
        console.error('Error approving comment:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in approveComment:', error);
      throw error;
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
          filter: `game_id=eq.${gameId}`
        },
        callback
      )
      .subscribe();
  }
}; 