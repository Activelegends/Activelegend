export interface User {
  id: string;
  email: string;
  display_name?: string;
  profile_image_url?: string;
  is_special?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
      picture?: string;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
} 