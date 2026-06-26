// Lightweight i18n for an SSR Astro site. Locale comes from the first URL
// segment (/el/, /de/ …); the default locale (en) has no prefix.
import { translations, type TranslationKey } from './translations';

export const LOCALES = ['en', 'el', 'de', 'fr', 'es', 'it', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  el: 'Ελληνικά',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: 'gb',
  el: 'gr',
  de: 'de',
  fr: 'fr',
  es: 'es',
  it: 'it',
  nl: 'nl',
};

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

/** Pull the locale + the un-prefixed path out of a pathname. */
export function parsePath(pathname: string): { locale: Locale; path: string } {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (seg && isLocale(seg) && seg !== DEFAULT_LOCALE) {
    const path = pathname.replace(new RegExp(`^/${seg}`), '') || '/';
    return { locale: seg, path };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/** Build a localized URL for a given path (default locale = no prefix). */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return `/${locale}${clean === '/' ? '/' : clean}`;
}

/** Returns a translator bound to a locale, with fallback to English. */
export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return (
      translations[locale]?.[key] ??
      translations[DEFAULT_LOCALE][key] ??
      key
    );
  };
}
