'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface GeoInfo {
  country: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  locale: string;
  language: string;
  setLanguage: (lang: string) => void;
}

const CURRENCY_MAP: Record<string, { currency: string; symbol: string; rate: number; locale: string; lang: string }> = {
  US: { currency: 'USD', symbol: '$', rate: 1.27, locale: 'en-US', lang: 'en' },
  GB: { currency: 'GBP', symbol: '£', rate: 1, locale: 'en-GB', lang: 'en' },
  DE: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'de-DE', lang: 'de' },
  FR: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'fr-FR', lang: 'fr' },
  IT: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'it-IT', lang: 'it' },
  ES: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'es-ES', lang: 'es' },
  NL: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'nl-NL', lang: 'nl' },
  AT: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'de-AT', lang: 'de' },
  BE: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'fr-BE', lang: 'fr' },
  AU: { currency: 'AUD', symbol: 'A$', rate: 1.95, locale: 'en-AU', lang: 'en' },
  CA: { currency: 'CAD', symbol: 'C$', rate: 1.74, locale: 'en-CA', lang: 'en' },
  IN: { currency: 'INR', symbol: '₹', rate: 106, locale: 'en-IN', lang: 'en' },
  IE: { currency: 'EUR', symbol: '€', rate: 1.17, locale: 'en-IE', lang: 'en' },
  CH: { currency: 'CHF', symbol: 'CHF ', rate: 1.12, locale: 'de-CH', lang: 'de' },
};

const LANG_TO_COUNTRY: Record<string, string> = { en: 'GB', de: 'DE', fr: 'FR', es: 'ES' };

const DEFAULT_GEO: GeoInfo = {
  country: 'GB', currency: 'GBP', currencySymbol: '£',
  exchangeRate: 1, locale: 'en-GB', language: 'en', setLanguage: () => {},
};

const GeoContext = createContext<GeoInfo>(DEFAULT_GEO);

export function useGeo() { return useContext(GeoContext); }

function detectCountry(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles') || tz.startsWith('US/')) return 'US';
    if (tz.startsWith('Europe/Berlin') || tz === 'Europe/Vienna') return 'DE';
    if (tz.startsWith('Europe/Paris')) return 'FR';
    if (tz.startsWith('Europe/Rome')) return 'IT';
    if (tz.startsWith('Europe/Madrid')) return 'ES';
    if (tz.startsWith('Europe/Amsterdam')) return 'NL';
    if (tz.startsWith('Europe/Brussels')) return 'BE';
    if (tz.startsWith('Europe/Zurich')) return 'CH';
    if (tz.startsWith('Europe/Dublin')) return 'IE';
    if (tz.startsWith('Australia/')) return 'AU';
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver')) return 'CA';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'IN';
  } catch {}
  return 'GB';
}

export function GeoProvider({ children }: { children: React.ReactNode }) {
  const [geo, setGeo] = useState<GeoInfo>(DEFAULT_GEO);

  const setLanguage = useCallback((lang: string) => {
    const country = LANG_TO_COUNTRY[lang] || 'GB';
    const info = CURRENCY_MAP[country] || CURRENCY_MAP.GB;
    setGeo(prev => ({
      ...prev,
      language: lang,
      // Update currency to match language region
      country,
      currency: info.currency,
      currencySymbol: info.symbol,
      exchangeRate: info.rate,
      locale: info.locale,
    }));
    // Save preference
    try { localStorage.setItem('unicornds_lang', lang); } catch {}
  }, []);

  useEffect(() => {
    // Check saved preference first
    let savedLang: string | null = null;
    try { savedLang = localStorage.getItem('unicornds_lang'); } catch {}

    const country = detectCountry();
    const info = CURRENCY_MAP[country] || CURRENCY_MAP.GB;
    const detectedLang = savedLang || info.lang;

    setGeo({
      country: savedLang ? (LANG_TO_COUNTRY[savedLang] || country) : country,
      currency: savedLang ? (CURRENCY_MAP[LANG_TO_COUNTRY[savedLang] || 'GB']?.currency || info.currency) : info.currency,
      currencySymbol: savedLang ? (CURRENCY_MAP[LANG_TO_COUNTRY[savedLang] || 'GB']?.symbol || info.symbol) : info.symbol,
      exchangeRate: savedLang ? (CURRENCY_MAP[LANG_TO_COUNTRY[savedLang] || 'GB']?.rate || info.rate) : info.rate,
      locale: savedLang ? (CURRENCY_MAP[LANG_TO_COUNTRY[savedLang] || 'GB']?.locale || info.locale) : info.locale,
      language: detectedLang,
      setLanguage,
    });
  }, [setLanguage]);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
}

export function formatPrice(gbpAmount: number, geo: GeoInfo): string {
  if (gbpAmount === 0) return 'Free';
  const converted = gbpAmount * geo.exchangeRate;
  const rounded = Math.ceil(converted) - 0.01;
  return `${geo.currencySymbol}${rounded.toFixed(2)}`;
}
