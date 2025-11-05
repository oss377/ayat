'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    nameEn: 'Jane Doe',
    nameAm: 'ጄን ዶ',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAId-oFVkhg5Vxapbja6NWRtxVVJL_KOu7PGBhfr-r7P5z24ruuRFPcwadRX_T6PMM9r2zW4gULQzj6112sog_roasBh_Hb0cqw9_zWuj3DTa-yXSZ2CCueSWWtFHTHCoTRE5jvLrUytwunzTr6xHbSkhKCKrBAoK1ywkje7vezyQCh-rUSlJyqVzYWurJ3XThsUpESaKinZFni_7CNJm9sJK4qHp2tt26R92uElzEG3sH5B-t_Fp-Whbw2cCZuZMRnm0i4YEyuR52k',
    rating: 5,
    textEn:
      'Homely made finding our dream home a breeze! The agents were incredibly helpful and professional.',
    textAm:
      'Homely የሕልም ቤታችንን በቀላሉ እንድናገኝ አድርጎልናል! ወኪሎቹ በጣም ይረዳሉና ባለሙያ ናቸው።',
  },
  {
    nameEn: 'John Smith',
    nameAm: 'ጆን ስሚዝ',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-tAKSveWkJUs8u_POBVjBV90P-Ql1ktTURDkDJMgvJijYHLdPczszUwfw7FWodkS4b4rVpfdQgVaTeZRvJ7ZSvP5hXY-dMzY3TqRMY8i3ISPPgwZfohtI2YLXQ9kKTcc8Y1nkgnv3tbGl9cZB_c4lNHWbAgI-43Ckrw9PAssYJWJ07pjoOpXZqeMlnJr3XuNiFybiM6tOMqmr2zkCl-Mq7SZCLiaXVLX6pydlpu1QzGzlIDJmVlqCPaBlYe47-k6OTR6xxPHXdjij',
    rating: 4.5,
    textEn:
      'The entire process was smooth and transparent. The team at Homely is knowledgeable and genuinely cares about their clients.',
    textAm:
      'ጠቅላላው ሂደት ለስላሳና ግልጽ ነበር። በHomely ያሉ ቡድኖች በዕውቀት የተሞሉና ለደንበኞቻቸው በትክክል ይጨነቃሉ።',
  },
  {
    nameEn: 'Emily Johnson',
    nameAm: 'ኢሚሊ ጆንሰን',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlMRf_beDnMNNgGW9xbSVcAVT1bbRpyUMoYElX78wseqkrnSEqxR3tIbLoI6-zQrKtDz0zeHpfTnbqvQMJNK6B4m8HVD7Wdnz-nbgFozf8_rO7csB0jCpry9OU5WExbitXi7Z8bT4N_YvlZt3LeK4u9xfJrPE-camkEePyCzB7aHUi9NgzWBTsyBWA7fhL7j0dkZPXLpBkLG8Y4jMCVB5IM5xDVBXI0Vf6raMzK5gPMCrvDHRo3_kiuwL7Y_pXQnzPfNXn0_X6ZTLW',
    rating: 5,
    textEn:
      'I sold my house faster than I ever thought possible, and for a great price! Highly recommend Homely\'s services.',
    textAm:
      'ቤትዎን በፍጥነት ከማሰብ በላይ ሸጥኩኝ፣ እና በጥሩ ዋጋ! የHomely አገልግሎቶችን በጣም እመክራለሁ።',
  },
];

export default function Testimonials() {
  const { t, lang } = useLang();
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  // Auto-slide
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, []);

  const cur = testimonials[idx];

  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-light dark:text-text-dark pb-12">
          {t('testimonials')}
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${idx * 100}%)` }}
            >
              {testimonials.map((c, i) => (
                <div key={i} className="w-full flex-shrink-0 flex justify-center px-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-2xl w-full">
                    <Image
                      src={c.photo}
                      alt={lang === 'en' ? c.nameEn : c.nameAm}
                      width={96}
                      height={96}
                      className="rounded-full mx-auto mb-6 border-4 border-primary/50"
                    />
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                      {lang === 'en' ? c.nameEn : c.nameAm}
                    </p>
                    <div className="flex justify-center my-4">
                      {Array.from({ length: 5 }, (_, s) => (
                        <span
                          key={s}
                          className={`material-symbols-outlined text-2xl ${
                            s < Math.floor(c.rating)
                              ? 'text-accent'
                              : s < c.rating
                              ? 'text-accent'
                              : 'text-gray-400'
                          }`}
                        >
                          {s < c.rating && s + 0.5 > c.rating ? 'star_half' : 'star'}
                        </span>
                      ))}
                    </div>
                    <p className="text-lg italic text-subtle-light dark:text-subtle-dark leading-relaxed">
                      {lang === 'en' ? c.textEn : c.textAm}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 rounded-full p-2 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 rounded-full p-2 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-12 text-center">
          <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all shadow-lg">
            {t('discoverBtn')}
          </button>
        </div>
      </div>
    </section>
  );
}