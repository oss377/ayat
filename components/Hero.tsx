// components/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/contexts/LanguageContext';

const animatedTexts = [
  {
    title: 'Find Your Dream Home',
    description: 'The best place to find your dream home.',
  },
  {
    title: 'Stocks',
    description: 'Trade and invest in top-performing company stocks.',
  },
  {
    title: 'Auctions',
    description: 'Participate in high-value asset auctions.',
  },
  {
    title: 'Shops',
    description: 'Discover and acquire premium commercial shop spaces.',
  },
  {
    title: 'Invest With Us',
    description: 'Grow your wealth with our expert investment opportunities.',
  },
];

export default function Hero() {
  const { t } = useLang();
  const router = useRouter();

  const handleFindHomeClick = () => {
    router.push('/properties');
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
    }, 4000); // Change text every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('5771564421325982705_120.jpg')`,
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative container mx-auto px-4 text-center h-48 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              {animatedTexts[index].title}
            </h1>
            <p className="text-white/90 text-base md:text-lg mt-4 max-w-2xl mx-auto">
              {animatedTexts[index].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <motion.div className="mt-8 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <motion.button onClick={handleFindHomeClick} className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('find Your Home') || 'Find Your Home'}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}