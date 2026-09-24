import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBRCommon from './locales/pt-BR/common.json';
import ptBRPages from './locales/pt-BR/pages.json';
import ptBRProjects from './locales/pt-BR/projects.json';
import ptBRStack from './locales/pt-BR/stack.json';

import enCommon from './locales/en/common.json';
import enPages from './locales/en/pages.json';
import enProjects from './locales/en/projects.json';
import enStack from './locales/en/stack.json';

import esCommon from './locales/es/common.json';
import esPages from './locales/es/pages.json';
import esProjects from './locales/es/projects.json';
import esStack from './locales/es/stack.json';

import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from './locale';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        common: ptBRCommon,
        pages: ptBRPages,
        projects: ptBRProjects,
        stack: ptBRStack,
      },
      en: {
        common: enCommon,
        pages: enPages,
        projects: enProjects,
        stack: enStack,
      },
      es: {
        common: esCommon,
        pages: esPages,
        projects: esProjects,
        stack: esStack,
      },
    },
    fallbackLng: DEFAULT_LOCALE,
    defaultNS: 'common',
    ns: ['common', 'pages', 'projects', 'stack'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_STORAGE_KEY,
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => {
        const lang = lng.toLowerCase();
        if (lang.startsWith('pt')) return 'pt-BR';
        if (lang.startsWith('es')) return 'es';
        if (lang.startsWith('en')) return 'en';
        return DEFAULT_LOCALE;
      },
    },
    supportedLngs: ['pt-BR', 'en', 'es'],
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

// Set initial html lang
document.documentElement.lang = i18n.language;

export default i18n;
