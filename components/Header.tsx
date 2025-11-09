'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLang } from '@/contexts/LanguageContext';
import { Bars3Icon as Menu, XMarkIcon as X, SunIcon as Sun, MoonIcon as Moon } from '@heroicons/react/24/outline';
import AboutUs from './aboutUs';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const router = useRouter();

  const navItems = [
    { key: 'compareProperties', href: '/compareProperties' },
    { key: 'agentProfile', href: '/agentProfile' },
    { key: 'properties', href: '/properties' },
    { key: 'contactUs', href: '/contactUs' },
    { key: 'about', action: () => setShowAboutUs(true) }, // Modal action
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
      setMobileOpen(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/loginAndRegistration');
  };

  const closeAboutUs = () => setShowAboutUs(false);

  return (
    <>
      <motion.header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/Wlogo.png"
                alt="AYAT SHOP Logo"
                width={84}
                height={28}
                className="object-contain rounded-full"
              />
              <span className="text-2xl font-bold text-text-light dark:text-white">AYAT SHOP</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                item.href ? (
                  <Link key={item.key} href={item.href} className="text-text-light dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                    {t(item.key)}
                  </Link>
                ) : (
                  <button key={item.key} onClick={item.action} className="text-text-light dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
                    {t(item.key)}
                  </button>
                )
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'en' | 'am')}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">EN</option>
                <option value="am">AM</option>
              </select>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Login */}
              <button
                onClick={handleLoginClick}
                className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all hidden md:block"
              >
                {t('login')}
              </button>

              {/* Mobile menu toggle */}
              <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  item.href ? (
                    <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)} className="block w-full text-left py-2 text-text-light dark:text-gray-200 hover:text-primary">
                      {t(item.key)}
                    </Link>
                  ) : (
                    <button key={item.key} onClick={() => handleNavClick(item)} className="block w-full text-left py-2 text-text-light dark:text-gray-200 hover:text-primary">
                      {t(item.key)}
                    </button>
                  )
                ))}
              </div>
              <button
                onClick={handleLoginClick}
                className="w-full mt-4 bg-primary text-white py-2.5 rounded-lg font-semibold"
              >
                {t('login')}
              </button>
            </div>
          )}
        </div>
      </motion.header>

      {/* About Us Modal */}
      {showAboutUs && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeAboutUs} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <button
              onClick={closeAboutUs}
              className="fixed top-4 right-4 z-60 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6">
              <AboutUs />
            </div>
          </div>
        </div>
      )}
    </>
  );
}