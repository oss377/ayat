'use client';

import { useLang } from '@/contexts/LanguageContext';
import Image from 'next/image';

const mapImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBUgD9trUlhTQUXjSRD2BovOsQLX7IJOetDWh0TfTmE2hmgpdBEv0iUIy8S_lCDLKI5wZ65BL9nbj4K1uaHSkj1rvY48aK1bFHjV14JNZI3Y9dqF7Wx4cJ6xeNKfF2ReWE3phPYuNzGGakMoGYrW0uo8aw-KnjpKc-dxZHKC1EfVadT99CAI2XZ0_TGjQSnCOrYJMtEwJu4yslfxV3jzf4xTDAdLiUDP8IR86WBPHjCaOm2LU-MeAEWSHalOYPgz9fhyHjgoag-TaTP';

export default function MapSection() {
  const { t } = useLang();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark pb-8">
          {t('mapTitle')}
        </h2>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
          <Image src={mapImg} alt="Map" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}