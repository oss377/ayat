'use client';

import { useLang } from '@/contexts/LanguageContext';

export default function AgentCTA() {
  const { t } = useLang();

  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-text-light dark:text-white mb-4">
          {t('connectAgent')}
        </h3>
        <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-md">
          {t('findAgentBtn')}
        </button>
      </div>
    </section>
  );
}