'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/*                                 Types                                      */
/* -------------------------------------------------------------------------- */
type Lang = 'en' | 'am';

type TranslationValue = string | TranslationObject | TranslationFunction;
type TranslationFunction = (...args: string[]) => string;
interface TranslationObject {
  [key: string]: TranslationValue;
}

/* -------------------------------------------------------------------------- */
/*                              Translations                                  */
/* -------------------------------------------------------------------------- */
const translations: Record<Lang, TranslationObject> = {
  en: {
    nav: {
      buy: 'Buy',
      sell: 'Sell',
      rent: 'Rent',
      agents: 'Agents',
      about: 'About Us',
      login: 'Login / Sign Up',
    },

    hero: {
      title: 'Find Your Dream Home',
      subtitle: 'The best place to find your dream home.',
      searchPlaceholder: 'Enter a city, neighborhood, or address',
      searchBtn: 'Search',
    },

    featured: 'Featured Properties',
    recently: 'Recently Viewed',
    viewAll: 'View All',
    testimonials: 'What Our Clients Say',
    ctaValuation: 'Thinking of selling? Get a free valuation of your home.',
    ctaValuationBtn: 'Get a Free Valuation',
    mapTitle: 'Explore Properties on the Map',
    connectAgent: 'Connect with a local real estate agent today.',
    findAgentBtn: 'Find an Agent',
    discoverBtn: 'Discover Your New Home',

    footer: {
      company: 'Homely',
      tagline: 'Find your next perfect place to live.',
      quickLinks: 'Quick Links',
      aboutUs: 'About Us',
      followUs: 'Follow Us',
      copyright: '© 2024 Homely. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },

    bedsBathsSqft: (beds: string, baths: string, sqft: string) =>
      `${beds} beds, ${baths} baths, ${sqft} sqft`,
  },

  am: {
    nav: {
      buy: 'ግዢ',
      sell: 'ሽያጭ',
      rent: 'ኪራይ',
      agents: 'ወኪሎች',
      about: 'ስለ እኛ',
      login: 'ግባ / ተመዝገብ',
    },

    hero: {
      title: 'የሕልም ቤትዎን ያግኙ',
      subtitle: 'የሕልም ቤትዎን ለመፈለግ ምርጥ ቦታ።',
      searchPlaceholder: 'ከተማ፣ ሰፈር ወይም አድራሻ ያስገቡ',
      searchBtn: 'ፈልግ',
    },

    featured: 'ተለይተው የቀረቡ ቤቶች',
    recently: 'በቅርብ ጊዜ የታዩ',
    viewAll: 'ሁሉንም ይመልከቱ',
    testimonials: 'ደንበኞቻችን ምን ይላሉ',
    ctaValuation: 'መሸጥ እያሰቡ ነው? የቤትዎን ነፃ ግምት ያግኙ።',
    ctaValuationBtn: 'ነፃ ግምት ያግኙ',
    mapTitle: 'በካርታው ላይ ቤቶችን ያስሱ',
    connectAgent: 'ከአካባቢያዊ የሪል እስቴት ወኪል ጋር ዛሬ ይገናኙ።',
    findAgentBtn: 'ወኪል ይፈልጉ',
    discoverBtn: 'አዲሱን ቤትዎን ይፈልጉ',

    footer: {
      company: 'Homely',
      tagline: 'ቀጣይ ፍጹም የመኖሪያ ቦታዎን ያግኙ።',
      quickLinks: 'ፈጣን ማገናኛዎች',
      aboutUs: 'ስለ እኛ',
      followUs: 'እኛን ይከተሉ',
      copyright: '© 2024 Homely። ሁሉም መብቶች የተጠበቁ ናቸው።',
      privacy: 'የግላዊነት ፖሊሲ',
      terms: 'የአገልግሎት ውሎች',
    },

    bedsBathsSqft: (beds: string, baths: string, sqft: string) =>
      `${beds} መኝታ ቤቶች፣ ${baths} መታጠቢያ ቤቶች፣ ${sqft} ካሬ ጫማ`,
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Context                                    */
/* -------------------------------------------------------------------------- */
interface LanguageContextProps {
  /** Current language – same name you used in TopBar (`locale`) */
  lang: Lang;
  /** Setter – same name you used in TopBar (`setLocale`) */
  setLang: (lang: Lang) => void;
  /** Translation function */
  t: (key: string, ...args: string[]) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                                 Provider                                   */
/* -------------------------------------------------------------------------- */
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');

  /* Load from localStorage on first mount */
  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && (saved === 'en' || saved === 'am')) {
      setLang(saved);
    }
  }, []);

  /* Persist on every change */
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  /* Deep lookup – supports `nav.buy` style keys */
  const getNested = (obj: TranslationObject, path: string): TranslationValue | undefined => {
    return path.split('.').reduce<any>((acc, part) => acc?.[part], obj);
  };

  const t = (key: string, ...args: string[]): string => {
    const value = getNested(translations[lang], key);

    if (typeof value === 'function') {
      return (value as TranslationFunction)(...args);
    }
    if (typeof value === 'string') {
      return value;
    }
    return key; // fallback to the key itself
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   Hook                                     */
/* -------------------------------------------------------------------------- */
export const useLang = (): LanguageContextProps => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLang must be used within a LanguageProvider');
  }
  return ctx;
};