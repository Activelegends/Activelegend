export interface TermsAndConditions {
  id: number;
  version: string;
  title: string;
  content_html: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTermsAcceptance {
  terms_accepted_version: number | null;
  terms_accepted_at: string | null;
} 