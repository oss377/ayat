'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';

export default function AgentCTA() {
  const { t } = useLang();

  return (
    <motion.section className="bg-gray-50 dark:bg-gray-900/50 py-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-text-light dark:text-white mb-4">
          {t('cta.agent')}
        </h3>
        <motion.button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {t('cta.agentBtn')}
        </motion.button>
      </div>
    </motion.section>
  );
}