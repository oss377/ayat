// components/Hero.tsx
'use client';

import { useLang } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA9eEvokUXv6wh1OtRyJ0NriARBWhktUNpxrESkiNZFl3g6EgiASE0DTiRe5lZzrL5OuVDgusGGy5zCXirnSRZXd8IrsgMtGI28Nxc1pWfmXEU1Yszc8dJg0bbTxqlZSlOQGadLx5QjRT8sYrQLJXfazYdsEtLP0TdYLBccr--KpRzcokEkZjkZRFMJpuO4CbkJGokzMOFKofTCwb9mjQmSAbrvMKQag9_s3EwUNm2s9muLFdN6lJTZjzrY22hcmdtftY10VA9ubzq')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="text-white/90 text-base md:text-lg mt-4 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex rounded-full overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-1.5">
            <div className="flex items-center pl-4 text-subtle-light dark:text-subtle-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              placeholder={t('hero.searchPlaceholder')}
              className="flex-1 px-4 py-3 bg-transparent outline-none text-text-light dark:text-text-dark placeholder-gray-500"
            />
            <button className="bg-primary text-white px-6 md:px-8 font-bold rounded-full hover:bg-primary/90 transition-colors">
              {t('hero.searchBtn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}