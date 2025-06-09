import { supabase } from '../lib/supabase';

export const authService = {
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile',
      },
    });

    if (error) throw error;
    return data;
  },

  async handleAuthStateChange(event: string, session: any) {
    if (event === 'SIGNED_IN' && session?.user) {
      // Update user profile with metadata
      const { error } = await supabase
        .from('users')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          display_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
          profile_image_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating user profile:', error);
      }
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },
}; 