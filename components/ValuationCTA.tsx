'use client';

import { useLang } from '@/contexts/LanguageContext';

export default function ValuationCTA() {
  const { t } = useLang();

  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-text-light dark:text-white mb-4">
          {t('ctaValuation')}
        </h3>
        <button className="bg-secondary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-secondary/90 transition-colors shadow-md">
          {t('ctaValuationBtn')}
        </button>
      </div>
    </section>
  );
}