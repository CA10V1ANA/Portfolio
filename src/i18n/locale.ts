export type SupportedLocale = 'pt-BR' | 'en' | 'es';

export interface LocaleMetadata {
  code: SupportedLocale;
  shortCode: string;
  label: string;
  nativeLabel: string;
  htmlLang: string;
}

export const SUPPORTED_LOCALES: LocaleMetadata[] = [
  { code: 'pt-BR', shortCode: 'PT', label: 'Português (Brasil)', nativeLabel: 'Português (Brasil)', htmlLang: 'pt-BR' },
  { code: 'en', shortCode: 'EN', label: 'English', nativeLabel: 'English', htmlLang: 'en' },
  { code: 'es', shortCode: 'ES', label: 'Español', nativeLabel: 'Español', htmlLang: 'es' },
];

export const DEFAULT_LOCALE: SupportedLocale = 'pt-BR';

export const LOCALE_STORAGE_KEY = 'portfolio.locale';

export function resolveLocale(browserLang: string): SupportedLocale {
  const lang = browserLang.toLowerCase();
  if (lang.startsWith('pt')) return 'pt-BR';
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('es')) return 'es';
  return DEFAULT_LOCALE;
}

export function getLocaleMetadata(locale: SupportedLocale): LocaleMetadata {
  return SUPPORTED_LOCALES.find((item) => item.code === locale) ?? SUPPORTED_LOCALES[0];
}
