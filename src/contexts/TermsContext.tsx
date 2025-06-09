import React, { createContext, useContext, useState, useEffect } from 'react';
import { termsService } from '../services/termsService';
import type { TermsAndConditions } from '../types/terms';

interface TermsContextType {
  terms: TermsAndConditions | null;
  loading: boolean;
  error: string | null;
  refreshTerms: () => Promise<void>;
}

const TermsContext = createContext<TermsContextType | undefined>(undefined);

export const TermsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [terms, setTerms] = useState<TermsAndConditions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTerms = async () => {
    try {
      setLoading(true);
      const activeTerms = await termsService.getActiveTerms();
      setTerms(activeTerms);
      setError(null);
    } catch (err) {
      console.error('Error loading terms:', err);
      setError('خطا در بارگذاری قوانین و مقررات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTerms();
  }, []);

  return (
    <TermsContext.Provider value={{ terms, loading, error, refreshTerms: loadTerms }}>
      {children}
    </TermsContext.Provider>
  );
};

export const useTerms = () => {
  const context = useContext(TermsContext);
  if (context === undefined) {
    throw new Error('useTerms must be used within a TermsProvider');
  }
  return context;
}; 