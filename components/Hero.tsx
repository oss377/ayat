// components/Hero.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLang();
  const router = useRouter();

  const handleFindHomeClick = () => {
    router.push('/properties');
  };

  return (
    <section
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAA9eEvokUXv6wh1OtRyJ0NriARBWhktUNpxrESkiNZFl3g6EgiASE0DTiRe5lZzrL5OuVDgusGGy5zCXirnSRZXd8IrsgMtGI28Nxc1pWfmXEU1Yszc8dJg0bbTxqlZSlOQGadLx5QjRT8sYrQLJXfazYdsEtLP0TdYLBccr--KpRzcokEkZjkZRFMJpuO4CbkJGokzMOFKofTCwb9mjQmSAbrvMKQag9_s3EwUNm2s9muLFdN6lJTZjzrY22hcmdtftY10VA9ubzq')`
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 text-center">
        <motion.h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          {t('find Dream Home') || 'Find Your Dream Home'}
        </motion.h1>
        <motion.p className="text-white/90 text-base md:text-lg mt-4 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>{t('bestPlace') || 'The best place to find your dream home.'}</motion.p>
        <motion.div className="mt-8 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <motion.button onClick={handleFindHomeClick} className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('find Your Home') || 'Find Your Home'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}