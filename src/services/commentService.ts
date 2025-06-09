import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData } from '../types/comment';

class CommentService {
  async getComments(gameId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:user_id (
            id,
            email,
            profile_image_url
          ),
          likes_count:likes(count)
        `)
        .eq('game_id', gameId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        (data as Comment[]).map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(`
              *,
              user:user_id (
                id,
                email,
                profile_image_url
              ),
              likes_count:likes(count)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      return commentsWithReplies;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async addComment(commentData: CommentFormData): Promise<Comment> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select(`
          *,
          user:user_id (
            id,
            email,
            profile_image_url
          ),
          likes_count:likes(count)
        `)
        .single();

      if (error) throw error;
      return data as Comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async hasLiked(commentId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  async toggleLike(commentId: string, userId: string): Promise<void> {
    try {
      const hasLiked = await this.hasLiked(commentId, userId);

      if (hasLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ comment_id: commentId, user_id: userId }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
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