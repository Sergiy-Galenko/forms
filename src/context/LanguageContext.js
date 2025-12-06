import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE, translations } from '../locales/translations';

const LanguageContext = createContext();

const resolveKey = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    if (acc && acc[part] !== undefined) {
      return acc[part];
    }
    return null;
  }, obj);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = LANGUAGES[language]?.locale || language;
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (LANGUAGES[lang]) {
      setLanguageState(lang);
    }
  }, []);

  const locale = LANGUAGES[language]?.locale || LANGUAGES[DEFAULT_LANGUAGE].locale;

  const t = useCallback(
    (key, vars = {}) => {
      const value =
        resolveKey(translations[language], key) ??
        resolveKey(translations[DEFAULT_LANGUAGE], key) ??
        key;

      if (typeof value !== 'string') return key;

      return value.replace(/{(\w+)}/g, (_, varName) => {
        return vars[varName] !== undefined ? vars[varName] : `{${varName}}`;
      });
    },
    [language]
  );

  const formatDate = useCallback(
    (value, options = {}) => {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    [locale]
  );

  const formatDateTime = useCallback(
    (value, options = {}) => {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        ...options
      }).format(date);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      locale,
      formatDate,
      formatDateTime
    }),
    [language, setLanguage, t, locale, formatDate, formatDateTime]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
