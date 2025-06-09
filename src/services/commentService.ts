import { supabase } from '../lib/supabase';
import type { Comment, CommentFormData } from '../types/comment';

class CommentService {
  async getComments(gameId: string): Promise<Comment[]> {
    try {
      // Get pinned comments first
      const { data: pinnedComments, error: pinnedError } = await supabase
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
          is_approved,
          user:users (
            id,
            email,
            display_name,
            profile_image_url
          )
        `)
        .eq('game_id', gameId)
        .eq('is_pinned', true)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (pinnedError) {
        console.error('Error fetching pinned comments:', pinnedError);
        throw pinnedError;
      }

      // Get normal comments
      const { data: normalComments, error: normalError } = await supabase
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
          is_approved,
          user:users (
            id,
            email,
            display_name,
            profile_image_url
          )
        `)
        .eq('game_id', gameId)
        .eq('is_pinned', false)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (normalError) {
        console.error('Error fetching normal comments:', normalError);
        throw normalError;
      }

      // Combine pinned and normal comments
      const allComments = [...(pinnedComments || []), ...(normalComments || [])];

      // Get likes count for all comments
      const commentsWithLikes = await Promise.all(
        allComments.map(async (comment) => {
          const { count, error: likesError } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('comment_id', comment.id);

          if (likesError) {
            console.error(`Error getting likes count for comment ${comment.id}:`, likesError);
            return { ...comment, likes_count: 0 };
          }

          return { ...comment, likes_count: count || 0 };
        })
      );

      // Get all replies for all comments
      const { data: allReplies, error: repliesError } = await supabase
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
          is_approved,
          user:users (
            id,
            email,
            display_name,
            profile_image_url
          )
        `)
        .eq('game_id', gameId)
        .not('parent_id', 'is', null)
        .order('created_at', { ascending: true });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
        return commentsWithLikes;
      }

      // Get likes count for all replies
      const repliesWithLikes = await Promise.all(
        (allReplies || []).map(async (reply) => {
          const { count, error: replyLikesError } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('comment_id', reply.id);

          if (replyLikesError) {
            console.error(`Error getting likes count for reply ${reply.id}:`, replyLikesError);
            return { ...reply, likes_count: 0 };
          }

          return { ...reply, likes_count: count || 0 };
        })
      );

      // Organize comments with their replies
      const commentsWithReplies = commentsWithLikes.map(comment => ({
        ...comment,
        replies: repliesWithLikes.filter(reply => reply.parent_id === comment.id)
      }));

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
        .insert([{
          content: commentData.content,
          game_id: commentData.game_id,
          parent_id: commentData.parent_id || null,
          user_id: commentData.user_id,
          is_pinned: false,
          is_approved: true
        }])
        .select(`
          id,
          content,
          user_id,
          game_id,
          parent_id,
          created_at,
          updated_at,
          is_pinned,
          is_approved,
          user:users (
            id,
            email,
            display_name,
            profile_image_url
          )
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }

      return { ...data, likes_count: 0, replies: [] } as unknown as Comment;
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

  async togglePin(commentId: string): Promise<void> {
    try {
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
    } catch (error) {
      console.error('Error toggling pin:', error);
      throw error;
    }
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