export interface SiteSettings {
  title: string;
  description: string;
  logo: string;
  socialMedia: {
    instagram?: string;
    telegram?: string;
    youtube?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export interface SettingsState {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
} 