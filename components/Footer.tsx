'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { t } = useLang();
  const { theme } = useTheme();

  const quickLinks = ['buy', 'sell', 'rent'].map((k) => ({
    label: t(`nav.${k}`),
    href: '#',
  }));
  const aboutLinks = ['Our Company', 'Agents', 'Contact'].map((txt) => ({
    label: txt,
    href: '#',
  }));

  return (
    <motion.footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/Wlogo.png"
                alt="AYAT SHOP Logo"
                width={56}
                height={19}
                className="object-contain rounded-full"
              />
              <span className="text-xl font-bold text-text-light dark:text-white">AYAT SHOP</span>
            </div>
            <p className="text-sm">{t('footer.tagline')}</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-text-light dark:text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-primary dark:hover:text-secondary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-text-light dark:text-white">{t('footer.aboutUs')}</h4>
            <ul className="space-y-2 text-sm">
              {aboutLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-primary dark:hover:text-secondary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-text-light dark:text-white">{t('footer.followUs')}</h4>
            <div className="flex space-x-4">
              {/* Twitter */}
              <a href="#" className="hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.8.35-1.65.58-2.5.67.9-.54 1.6-1.4 1.9-2.4-.85.5-1.8.86-2.8 1.08C18.26 4.3 17.1 4 16 4c-2.4 0-4.35 1.95-4.35 4.35 0 .34.04.67.1.98C8.2 9.08 4.6 7.1 2.3 4.2c-.38.65-.6 1.4-.6 2.2 0 1.5.78 2.8 1.95 3.6-.7-.02-1.37-.2-1.95-.5v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.75.15-1.15.15-.28 0-.55-.03-.8-.08.55 1.7 2.15 3 4.05 3.05-1.5.95-3.4 1.5-5.45 1.5-.35 0-.7-.02-1.05-.05C2.5 19.3 4.7 20 7.1 20c7.3 0 11.3-6.05 11.3-11.3l-.03-.5c.8-.57 1.48-1.3 2.02-2.1z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8.5 18H6V9.5h2.5V18zM7.25 8.25c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 18h-2.5v-4.5c0-.9-.02-2.05-1.25-2.05s-1.45.98-1.45 2v4.55H10V9.5h2.4v1.1h.03c.34-.65 1.18-1.35 2.37-1.35 2.54 0 3 1.67 3 3.85V18z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="#" className="hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 8h-2.25V7.5c0-.62-.5-1.12-1.12-1.12h-1.25c-.62 0-1.12.5-1.12 1.12V10H9c-.55 0-1 .45-1 1v1.5c0 .55.45 1 1 1h1.38v4.25c0 .41.34.75.75.75h1.75c.41 0 .75-.34.75-.75V13.5H15.5c.55 0 1-.45 1-1V11c0-.55-.45-1-1-1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-sm">
          <p className="text-gray-500">{t('footer.copyright')}</p>
          <p className="mt-1">
            <a href="#" className="hover:text-primary dark:hover:text-secondary">
              {t('footer.privacy')}
            </a>{' '}
            |{' '}
            <a href="#" className="hover:text-primary dark:hover:text-secondary">
              {t('footer.terms')}
            </a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
}