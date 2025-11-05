// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import AboutUs from './aboutUs';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const { t, lang } = useLang();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { key: 'buy', href: `/${lang}/buy` },
    { key: 'sell', href: `/${lang}/sell` },
    { key: 'rent', href: `/${lang}/rent` },
    { key: 'agents', href: `/${lang}/agents` },
    { key: 'aboutUs', href: '#', action: () => setShowAboutUs(true) },
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
      setMobileOpen(false);
    }
  };

  const closeAboutUs = () => {
    setShowAboutUs(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-background-dark shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                real_estate_agent
              </span>
              <span className="text-2xl font-bold text-text-light dark:text-text-dark">
                Homely
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                item.href ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ) : (
                  <button
                    key={item.key}
                    onClick={item.action}
                    className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
                  >
                    {t(`nav.${item.key}`)}
                  </button>
                )
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/auth`}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 hidden sm:block"
              >
                Login/Sign Up
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                <span className="material-symbols-outlined">
                  {theme === 'light' ? 'dark_mode' : 'light_mode'}
                </span>
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2"
              >
                <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                  {mobileOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
              {navItems.map((item) => (
                item.href ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block py-2 text-text-light dark:text-text-dark hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ) : (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item)}
                    className="block w-full text-left py-2 text-text-light dark:text-text-dark hover:text-primary"
                  >
                    {t(`nav.${item.key}`)}
                  </button>
                )
              ))}
              <Link
                href={`/${lang}/auth`}
                className="block w-full bg-primary text-white py-2 rounded-lg text-center"
                onClick={() => setMobileOpen(false)}
              >
                Login/Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* About Us Modal/Overlay */}
      {showAboutUs && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeAboutUs}
          />
          
          {/* Modal Content */}
          <div className="relative min-h-screen">
            {/* Close Button */}
            <button
              onClick={closeAboutUs}
              className="fixed top-4 right-4 z-60 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined text-text-light dark:text-text-dark">
                close
              </span>
            </button>
            
            {/* About Us Component */}
            <div className="relative z-50">
              <AboutUs />
            </div>
          </div>
        </div>
      )}
    </>
  );
}