// components/AboutUs.tsx
'use client';

import Head from 'next/head';
import { ReactNode } from 'react';

// Type definitions
interface MissionVisionCardProps {
  icon: string;
  title: string;
  description: string;
}

interface TimelineEventProps {
  event: {
    icon: string;
    year: string;
    description: string;
    isLast?: boolean;
  };
  isLast: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

const AboutUs = () => {
  const handleViewListings = () => {
    // Navigate to listings page
    console.log('View listings clicked');
  };

  const handleContactUs = () => {
    // Navigate to contact page
    console.log('Contact us clicked');
  };

  return (
    <>
      <Head>
        <title>About Us - Real Estate</title>
        <meta name="description" content="Learn about our mission, vision, and team at our real estate agency" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </Head>

      <div className="relative flex h-auto w-full flex-col group/design-root overflow-x-hidden">
        {/* Hero Section */}
        <div className="@container">
          <div className="@[480px]:p-4">
            <div 
              className="flex min-h-[60vh] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDKUFvcS-QOwJA5wyMI0y6SjhGsVVUBu72i0eU_OxJbVr6P9RZ60ds9nv65QkUH71cKPbklC_zfQZNNCH1p9_yPRmMfwL4JAOe-tkQ63uB7bu9kFVfBk-NmZ4kT0WHJCwYD98x8byHSLA7K1BW8GBd9JJ2R-lp20AfIry72tbOsdR4EgkMtv-iChMBHTvlG6Nuu0fXHOVQzoprlbDBVToQEzkfouecnKan0bWfaFqTAlWsT7FMGFww5gMcIhDMF6ziOXFBQjLXtCDgq")`,
                backgroundAttachment: 'fixed'
              }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] font-display">
                  Building Dreams, One Home at a Time
                </h1>
                <h2 className="text-white text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal font-display">
                  Your trusted partner in finding the perfect property.
                </h2>
              </div>
              <button 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-secondary text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors font-display"
                onClick={handleViewListings}
              >
                <span className="truncate">View Our Listings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-10 @container">
              <div className="flex flex-col gap-4 text-center">
                <h2 className="text-primary dark:text-secondary text-[32px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-3xl mx-auto font-display">
                  Our Mission & Vision
                </h2>
                <p className="text-neutral-text dark:text-neutral-dark-text text-base font-normal leading-normal max-w-3xl mx-auto font-display">
                  We are committed to providing exceptional service and building lasting relationships with our clients. Our vision is to be the leading real estate agency in the region, known for our integrity and expertise.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-0">
                <MissionVisionCard
                  icon="rocket_launch"
                  title="Our Mission"
                  description="To provide our clients with the highest level of service, professionalism, and integrity, making their real estate journey seamless and rewarding."
                />
                <MissionVisionCard
                  icon="visibility"
                  title="Our Vision"
                  description="To be the most trusted and respected real estate company in our community, redefining the standards of excellence in the industry."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-primary dark:text-secondary text-[32px] font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-center font-display">
              Our Journey
            </h2>
            <Timeline />
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-primary dark:text-secondary text-[32px] font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-center font-display">
              Meet Our Team
            </h2>
            <TeamMembers />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-primary dark:text-secondary text-[32px] font-bold leading-tight tracking-[-0.015em] pb-8 font-display">
              What Our Clients Say
            </h2>
            <Testimonial />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary dark:bg-primary py-12 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-white text-3xl font-bold font-display">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 mt-2 mb-6 font-display">
              Contact us today to speak with one of our experts.
            </p>
            <button 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-secondary text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-secondary/90 transition-colors mx-auto font-display"
              onClick={handleContactUs}
            >
              <span className="truncate">Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Sub-components
const MissionVisionCard: React.FC<MissionVisionCardProps> = ({ icon, title, description }) => (
  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark p-6 flex-col items-center text-center">
    <span 
      className="material-symbols-outlined text-secondary"
      style={{ fontSize: '40px' }}
    >
      {icon}
    </span>
    <div className="flex flex-col gap-2">
      <h3 className="text-primary dark:text-white text-xl font-bold leading-tight font-display">
        {title}
      </h3>
      <p className="text-neutral-text dark:text-neutral-dark-text text-base font-normal leading-normal font-display">
        {description}
      </p>
    </div>
  </div>
);

const Timeline: React.FC = () => {
  const timelineEvents = [
    {
      icon: 'storefront',
      year: 'Founded in 2010',
      description: 'Our humble beginnings started with a small team and a big dream to revolutionize the real estate experience.'
    },
    {
      icon: 'domain',
      year: 'First Major Development in 2014',
      description: 'A landmark project that shaped our future and established our reputation for quality and innovation.'
    },
    {
      icon: 'public',
      year: 'Expansion to New Markets in 2018',
      description: 'Serving a wider community by bringing our trusted services to new neighborhoods and cities.'
    },
    {
      icon: 'trophy',
      year: 'Awarded #1 Agency in 2022',
      description: 'Recognized for our commitment to excellence and outstanding client satisfaction.',
      isLast: true
    }
  ];

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 px-4 max-w-3xl mx-auto">
      {timelineEvents.map((event, index) => (
        <TimelineEvent 
          key={index} 
          event={event} 
          isLast={event.isLast || false} 
        />
      ))}
    </div>
  );
};

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, isLast }) => (
  <>
    <div className="flex flex-col items-center gap-1 pt-3">
      <div className={`${event.icon === 'trophy' ? 'bg-secondary text-primary' : 'bg-primary text-white'} p-2 rounded-full`}>
        <span className="material-symbols-outlined">{event.icon}</span>
      </div>
      {!isLast && <div className="w-[2px] bg-gray-300 dark:bg-gray-600 h-full grow"></div>}
    </div>
    <div className={`flex flex-1 flex-col ${isLast ? 'pt-3' : 'pb-12 pt-3'}`}>
      <p className="text-neutral-text dark:text-neutral-dark-text text-lg font-medium leading-normal font-display">
        {event.year}
      </p>
      <p className="text-neutral-text/80 dark:text-neutral-dark-text/80 text-base font-normal leading-normal font-display">
        {event.description}
      </p>
    </div>
  </>
);

const TeamMembers: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: 'John Doe',
      role: 'Lead Agent',
      description: 'John has over 15 years of experience in the real estate market, specializing in luxury properties.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5jaELz932BUeDWaytBOnHOlJRENEG9jk9P33mrJ3DjUXzUKfL23XQRsoynJxACw1RYLGD-Te1GJWa8t0lTKN9Cx6sykOYFYW1-xm6lqD7c_KJXYbvho2Cmp7bzVTTdgQW4BlebLYG4erG6XTMK_dcJ02_ZlpW1lCS2CS938cqBehn73NQzfJd4eMPrLGQbXFp-yLpMusNUGUjcCCKaLnh5c0u5wxtplOthDb07t4cX3FWLpJ_WKSR55NEHhJkANgXq2VpWSBngr-4'
    },
    {
      name: 'Jane Smith',
      role: 'Marketing Director',
      description: 'Jane\'s creative strategies ensure our properties get the attention they deserve.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa2eLiYeeQZ_DJBPiFZIPNBq6SF3FwCkqNbWRF8YytEVvwtASjJ2seRotXT6Lb38h4mZ_X3tLkvHEOzfuq3i1Kef6mJm1MvLmnQ-QRltZcZOK7cWsA-iyGKBgDsCDr2_l9g3vIMbSfuypdm6cV61ltFj7AjTJZYveTG0Vx2Q5f1jioni6PFsOcy1en7w35iUfQOT8heqIcKCufFnKPScma3Zlizxi93RutA90DwN8ErF_QvEEDfxYPNCaMIFq8wLVFwHdsVmKWNkQ8'
    },
    {
      name: 'Mike Johnson',
      role: 'Client Relations',
      description: 'Mike is dedicated to providing a smooth and positive experience for all our clients.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbqpwtaYkEmdYlhPXAhhvDd4189rrpdTkftnuQBzfvNNFzPVPSc4HbGpRt-mPOIx5GPFMXOHPGoh4lkpATUEQFkZg04rCCkV6XwEUXk6cOkFwAazCzn1MNtABX4tWs093zwWzStXv1Dw7QxsEpXESP2nCEtDXBlxP0UJe_V26IxA6vhOHLtqw4A7br2yiLNSst8aAsjUTXxz9zvoFaP4zNYuxpM69zwOsHqLFZJBpJoVVBQT2MYkXnMc9a7wvk2k83zh88eqb5fc7y'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {team.map((member, index) => (
        <div key={index} className="text-center bg-background-light dark:bg-neutral-800 p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
          <img 
            className="w-32 h-32 rounded-full mx-auto mb-4"
            src={member.image}
            alt={`Professional headshot of ${member.name}`}
          />
          <h3 className="text-xl font-bold text-primary dark:text-white font-display">
            {member.name}
          </h3>
          <p className="text-secondary font-medium font-display">
            {member.role}
          </p>
          <p className="mt-2 text-neutral-text dark:text-neutral-dark-text text-sm font-display">
            {member.description}
          </p>
        </div>
      ))}
    </div>
  );
};

const Testimonial: React.FC = () => (
  <div className="relative">
    <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg">
      <span className="material-symbols-outlined text-secondary text-5xl absolute -top-4 -left-4">
        format_quote
      </span>
      <p className="text-neutral-text dark:text-neutral-dark-text italic text-lg mb-4 font-display">
        "The team went above and beyond to find our dream home. Their professionalism and dedication were outstanding. We couldn't be happier!"
      </p>
      <div className="flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-secondary">
            star
          </span>
        ))}
      </div>
      <p className="text-neutral-text dark:text-white font-bold mt-4 font-display">
        - The Williams Family
      </p>
      <span className="material-symbols-outlined text-secondary text-5xl absolute -bottom-4 -right-4 transform rotate-180">
        format_quote
      </span>
    </div>
  </div>
);

export default AboutUs;