'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AgentProfilePage() {
  const [activeTab, setActiveTab] = useState('All');
  const router = useRouter();

  const listings = [
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLnSGGE7Bky2-WeyhoOeMGIypY27-CvYQaa6Hd8Bm-XCHkf1d3ILGNOAldCjpgIa5tyinZtcLsp94XEJPv-9w8yBFvOQe9hNsTw8Mxb2J86JR1MyZ_JgO0DQkTwPgKlfP0FZF8bXThzZ2ErgohJnNEg7WV-HN-FR_o8KZuvbtm7kacff1rFLx3zdBP08witHr6r6jDty9SvZ3ENp7bj8DBQvzV2gnvrXLDrPmI-RUlvrBP0aMZRzmHDfq9PyjaAm_k-qrY-rTST1K',
      price: '$1,250,000',
      address: '123 Maple Street, Anytown, USA',
      beds: 4,
      baths: 3,
      sqft: '2,500',
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArIkD0nXFkjshSdhQ2-TlB-Paw2FIyMoNS9Gwl_FjKA-eWXBFnO-Z7TLPOkboRo2OcqX7am2NW5cOzH65A6oGvk7YVPVl7W79yYs1wapQIa1fmpU7_MSoj1u468IVXegiaWDRpafzP9R0_N7V6j_sqHlPpxaIrJifMiZmpoyGePu38Dm04-wdP2WGuUowphzgJ6Q5tAYXDsPhI5xFwFW-UbGOeeQjI_sGQqlu1sINzwkpR2BgyxxVk5zx3FixYmcPL1jPF2hHrQ2vU',
      price: '$875,000',
      address: '456 Oak Avenue, Anytown, USA',
      beds: 3,
      baths: 2,
      sqft: '1,800',
    },
    {
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0yi1MK--YkOQuL8qKKa8hedvMk3ILEz4WJtv-kR3rCo9_auh6V4osiY5AhBifcEK0qaoDpq_hFZ-3rU1kNsQGzWDZHtvP7GFBOlD5b3tDGVtFM8C5hfoeMVsOUZd98msgcPgK3K3QskWkaJ7WCm28_v7jg2P4ZMDmkxsFtfmA91kVGsfZcio2s7Wexw2-pG4L2fXX0o2uv0MeSvxDVL16J-HsKiP36JjV60ejIt3HP5c_K26WxHZczE5CXMipwkVPMf92KD8Fo5nr',
      price: '$2,100,000',
      address: '789 Pine Lane, Anytown, USA',
      beds: 5,
      baths: 4.5,
      sqft: '4,200',
    },
  ];

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-color dark:text-gray-200 font-display">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4 pb-2">
          <div className="flex size-12 shrink-0 items-center text-[#111618] dark:text-white">
            <button 
              onClick={handleBackClick}
              className="material-symbols-outlined text-3xl hover:text-primary transition-colors"
            >
              arrow_back
            </button>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-color dark:text-white">
            Real Estate
          </h2>
          <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-transparent text-[#111618] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
        </header>

        {/* Agent Info */}
        <section className="flex flex-col gap-4 p-4 bg-white dark:bg-background-dark @[520px]:flex-row @[520px]:items-center @[520px]:justify-between">
          <div className="flex gap-4 items-center">
            <div
              className="aspect-square w-32 min-h-32 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZyWpdAMvAx4ihAbRLO0GgLg6-W1dkcz_nfSCKTf_mJqe7rsyXRw3J3_4kaKMpEcjVNrIfKfutiltnoPzGQTSU6sVLPdYWBeY_t4cytvGxI-x8jITzFYjdUBAYEdXG_lfa4RxUMHYC9FLmEqApbd9i6DKGiBojIDr1xVTGnBXVWUb-vPKijdWz0aZke2KNSw8HAAzwZX8gRuzB5liAkPHxolyQJaxj9yihkbmDP7A_vBr_2T-NGzKuEDW4-POzcElukZkiwZctxpu4")`,
              }}
            />
            <div>
              <p className="text-[22px] font-bold leading-tight tracking-[-0.015em]">Jane Doe</p>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">Senior Real Estate Agent</p>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">jane.doe@email.com</p>
            </div>
          </div>
          <div className="flex w-full max-w-[480px] gap-3 @[480px]:w-auto">
            <button className="flex h-10 flex-1 items-center justify-center rounded-lg bg-secondary dark:bg-gray-700 px-4 text-sm font-bold text-text-color dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors @[480px]:flex-auto">
              Call
            </button>
            <button className="flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors @[480px]:flex-auto">
              Message
            </button>
          </div>
        </section>

        {/* Bio */}
        <section className="bg-white dark:bg-background-dark px-4 pb-4">
          <p className="text-base font-normal leading-normal text-text-color dark:text-gray-300">
            With over 15 years of experience in the competitive real estate market, Jane Doe has a proven track record of success. Specializing in luxury residential properties, Jane combines deep market knowledge with a client-first approach, ensuring a seamless and successful transaction for every client she represents. Her dedication to excellence has earned her a reputation as one of the top agents in the region.
          </p>
        </section>

        {/* Reviews */}
        <section className="border-t border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-color dark:text-white">
              Reviews
            </h2>
            <button className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90 transition-colors">
              Leave a Review
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <p className="text-2xl font-bold text-text-color dark:text-white">4.8</p>
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="material-symbols-outlined filled text-accent text-xl">star</span>
              ))}
              <span className="material-symbols-outlined filled text-accent text-xl">star_half</span>
            </div>
            <p className="ml-2 text-gray-500 dark:text-gray-400">(Based on 125 reviews)</p>
          </div>

          <div className="mb-4 flex gap-2">
            <button className="flex h-8 items-center justify-center gap-2 rounded-lg bg-primary pl-3 pr-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
              Sort By: Most Recent
            </button>
            <button className="flex h-8 items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-700 pl-3 pr-3 text-sm font-medium text-text-color dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="material-symbols-outlined text-base">filter_list</span> Filter
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Alex Johnson', rating: 5, date: '2 days ago', text: 'Jane was incredibly helpful and professional throughout the entire process. She made buying our first home a breeze!' },
              { name: 'Samantha Blue', rating: 4, date: '1 week ago', text: 'Great experience working with Jane. Very knowledgeable about the market and always responsive.' },
            ].map((review, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <div className="mb-1 flex items-center">
                  <p className="font-bold text-text-color dark:text-white">{review.name}</p>
                  <div className="ml-auto flex items-center">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className={`material-symbols-outlined filled text-base ${
                          j < review.rating ? 'text-accent' : 'text-gray-400'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                <p className="text-text-color dark:text-gray-300">{review.text}</p>
              </div>
            ))}
            <div className="pt-4 text-center">
              <button className="flex w-full items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined mr-2">flag</span>
                Report Agent
              </button>
            </div>
          </div>
        </section>

        {/* Listings Tabs */}
        <section className="bg-background-light dark:bg-background-dark pt-5">
          <h2 className="px-4 pb-3 text-[22px] font-bold leading-tight tracking-[-0.015em] text-text-color dark:text-white">
            My Listings
          </h2>
          <div className="flex gap-3 overflow-x-auto p-3">
            {['All', 'For Sale', 'For Rent', 'Sold'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-700 text-text-color dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Property Cards */}
        <section className="grid grid-cols-1 gap-6 p-4 bg-background-light dark:bg-background-dark md:grid-cols-2 lg:grid-cols-3">
          {listings.map((property, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={property.img}
                alt={`Property at ${property.address}`}
                width={600}
                height={300}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-lg font-bold text-text-color dark:text-white">{property.price}</p>
                <p className="text-gray-600 dark:text-gray-400">{property.address}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined mr-1 text-base">bed</span> {property.beds} Beds
                  <span className="material-symbols-outlined ml-4 mr-1 text-base">bathtub</span> {property.baths} Baths
                  <span className="material-symbols-outlined ml-4 mr-1 text-base">square_foot</span> {property.sqft} sqft
                </div>
                <button className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-bold text-text-color hover:bg-accent/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-4">
          <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Real Estate Inc. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Tailwind CDN + Config */}
      <script
        src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
        suppressHydrationWarning
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    primary: "#005A9C",
                    secondary: "#F5F5F5",
                    accent: "#FFC107",
                    "background-light": "#f6f7f8",
                    "background-dark": "#101c22",
                    "text-color": "#333333",
                  },
                  fontFamily: {
                    display: ["Work Sans", "Noto Sans", "sans-serif"],
                  },
                  borderRadius: {
                    DEFAULT: "0.25rem",
                    lg: "0.5rem",
                    xl: "0.75rem",
                    full: "9999px",
                  },
                },
              },
            };
          `,
        }}
      />
      <style jsx>{`
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        .material-symbols-outlined.filled {
          font-variation-settings: "FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        body {
          min-height: max(884px, 100dvh);
        }
      `}</style>
    </>
  );
}