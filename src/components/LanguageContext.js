'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('horizon_locale');
    if (saved && (saved === 'en' || saved === 'am')) {
      setLocale(saved);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    if (newLocale === 'en' || newLocale === 'am') {
      setLocale(newLocale);
      localStorage.setItem('horizon_locale', newLocale);
    }
  };

  // Safe nested translation fetcher: e.g. t('nav.home')
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[locale];
    
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        console.warn(`Translation path "${path}" not found in locale "${locale}"`);
        return path; // Fallback to printing path
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
