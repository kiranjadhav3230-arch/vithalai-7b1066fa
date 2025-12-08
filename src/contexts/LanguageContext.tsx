import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  languageLabel: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vithal-ai-language';

const languageLabels: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी'
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage on initial render
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
      return stored as Language;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'hi' || stored === 'mr')) {
      setLanguageState(stored as Language);
    }
  }, []);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage,
        languageLabel: languageLabels[language]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useGlobalLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useGlobalLanguage must be used within a LanguageProvider');
  }
  return context;
};
