import { supabase } from '../lib/supabase';
import type { TermsAndConditions, UserTermsAcceptance } from '../types/terms';

class TermsService {
  async getActiveTerms(): Promise<TermsAndConditions | null> {
    try {
      const { data, error } = await supabase
        .from('terms_and_conditions')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active terms:', error);
      throw error;
    }
  }

  async getUserTermsAcceptance(userId: string): Promise<UserTermsAcceptance | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('terms_accepted_version, terms_accepted_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user terms acceptance:', error);
      throw error;
    }
  }

  async acceptTerms(userId: string, version: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          terms_accepted_version: version,
          terms_accepted_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error accepting terms:', error);
      throw error;
    }
  }

  async createNewTerms(terms: Omit<TermsAndConditions, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      // First, deactivate all current terms
      const { error: deactivateError } = await supabase
        .from('terms_and_conditions')
        .update({ is_active: false })
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      // Then, insert the new terms
      const { error: insertError } = await supabase
        .from('terms_and_conditions')
        .insert([terms]);

      if (insertError) throw insertError;
    } catch (error) {
      console.error('Error creating new terms:', error);
      throw error;
    }
  }

  async updateTerms(termsId: string, terms: Partial<TermsAndConditions>): Promise<void> {
    try {
      const { error } = await supabase
        .from('terms_and_conditions')
        .update(terms)
        .eq('id', termsId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating terms:', error);
      throw error;
    }
  }
}

export const termsService = new TermsService(); 