/// components/PropertyDetails.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { motion } from 'framer-motion';

interface PropertyDetailsProps {
  onBack?: () => void;
}

export default function PropertyDetails({ onBack }: PropertyDetailsProps) {
  const [saved, setSaved] = useState(true);
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  // Form state
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('9:00 AM');
  const [tourName, setTourName] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const load = async () => {
      if (!propertyId) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'properties', propertyId));
        if (snap.exists()) setData(snap.data());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [propertyId]);

  const handleScheduleTour = async () => {
    setFormMessage({ type: '', text: '' });
    if (!tourDate || !tourTime || !tourName || !tourEmail) {
      setFormMessage({ type: 'error', text: 'Please fill out all fields.' });
      return;
    }

    setIsScheduling(true);
    try {
      await addDoc(collection(db, 'customerSchedule'), {
        propertyId,
        propertyName: data?.location || 'N/A',
        date: tourDate,
        time: tourTime,
        name: tourName,
        email: tourEmail,
        scheduledAt: new Date(),
      });
      setFormMessage({ type: 'success', text: 'Schedule uploaded successfully!' });
      // Clear form
      setTourDate('');
      setTourTime('9:00 AM');
      setTourName('');
      setTourEmail('');
    } catch (error) {
      console.error("Error scheduling tour: ", error);
      setFormMessage({ type: 'error', text: 'Failed to schedule tour. Please try again.' });
    } finally {
      setIsScheduling(false);
      setTimeout(() => setFormMessage({ type: '', text: '' }), 5000);
    }
  };

  const heroImage = useMemo(() => {
    return (data?.photoURLs && data.photoURLs[0]) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo2Hzxe2T-X_m7FxYyeEqASY13i1goaD9xzzTAVzHx54bHBhdfbJCCJnhxZt5Yp8BdDwOjOgfxVk9t4CCq5xKlwIa2c4MxK6e5kFZFL0FCw1rHI7ZslNyksKyZQPpn9c7PcofrrdgW9P9KVD3H1Gt6hUMUtVJUz3ce-gfpEUvpiAhiZPWMiVXwNZ5tMicUl8bGeoOG5hpMMvErjfh1OAdKYasDGCJvLKryAath3ucShX3VXXqzPtKNwrWjkP7Xo_UfNhE0Ba-21nrI';
  }, [data]);

  const priceText = useMemo(() => {
    const priceNum = typeof data?.price === 'number' ? data.price : parseFloat(String(data?.price ?? ''));
    return isNaN(priceNum) ? '$—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceNum);
  }, [data]);

  const addressText = data?.location || '—';

  type MediaItem = { type: 'image' | 'video'; src: string };
  const mapQuery = `${addressText}, Ethiopia`;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const mediaItems: MediaItem[] = useMemo(() => {
    const images: string[] = Array.isArray(data?.photoURLs) ? data!.photoURLs : [];
    const videos: string[] = Array.isArray(data?.videoURLs) ? data!.videoURLs : [];
    return [
      ...images.filter(Boolean).map((u) => ({ type: 'image' as const, src: u })),
      ...videos.filter(Boolean).map((u) => ({ type: 'video' as const, src: u })),
    ];
  }, [data]);
  const imageUrls: string[] = useMemo(() => (Array.isArray(data?.photoURLs) ? data!.photoURLs.filter(Boolean) : []), [data]);
  const videoUrls: string[] = useMemo(() => (Array.isArray(data?.videoURLs) ? data!.videoURLs.filter(Boolean) : []), [data]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentMedia: MediaItem | null = mediaItems.length > 0 ? mediaItems[Math.min(currentIndex, mediaItems.length - 1)] : null;
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDurations, setVideoDurations] = useState<Record<number, string>>({});

  const formatDuration = (seconds: number) => {
    if (!isFinite(seconds) || seconds <= 0) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <motion.div 
      className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-gray-50 dark:bg-gray-900" 
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
    >

      <motion.div 
        className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center p-4 justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {onBack && (
              <motion.button 
                onClick={onBack} // Updated
                className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </motion.button>
            )}
            <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
              {addressText}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">share</span>
            </motion.button>
            <motion.button 
              className={`p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-300 ${saved ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setSaved(!saved)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                animate={{ scale: saved ? 1.1 : 1 }}
                transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 10 }}
              >
                favorite
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <main className="max-w-7xl mx-auto">
        <motion.div variants={containerVariants}>
          <motion.div className="@container pt-4" variants={itemVariants}>
            <div className="@[480px]:px-4">
              <div className="@[480px]:px-0 @[480px]:py-0">
                <div className="relative min-h-[500px] rounded-2xl overflow-hidden bg-gray-800 shadow-lg">
                  {currentMedia ? (
                    currentMedia.type === 'image' ? (
                      <motion.img 
                        key={currentMedia.src}
                        src={currentMedia.src}
                        alt="Property media" 
                        className="w-full h-[500px] object-cover" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="relative">
                        <video
                          key={currentVideoIndex}
                          ref={mainVideoRef}
                          src={currentMedia.src}
                          controls
                          preload="metadata"
                          playsInline
                          className="w-full h-[500px] object-contain bg-black"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <motion.button
                            onClick={() => {
                              const el = mainVideoRef.current;
                              if (!el) return;
                              if (document.fullscreenElement) {
                                document.exitFullscreen?.();
                              } else {
                                el.requestFullscreen?.();
                              }
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors duration-300"
                            title="Toggle fullscreen"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="material-symbols-outlined">fullscreen</span>
                          </motion.button>
                        </div>
                      </div>
                    )
                  ) : (
                    <img src={heroImage} alt="Property" className="w-full h-[500px] object-cover" />
                  )}

                  {imageUrls.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md">
                      <div className="relative">
                        <div id="image-strip" className="flex gap-2 overflow-x-auto no-scrollbar p-2 bg-black/30 backdrop-blur-sm rounded-xl scroll-smooth snap-x snap-mandatory">
                          {imageUrls.map((src, i) => ( // Updated
                            <motion.button
                              key={`img-${i}`}
                              onClick={() => setCurrentIndex(i)}
                              className={`flex-shrink-0 rounded-md overflow-hidden border ${i === currentIndex ? 'border-white' : 'border-white/40'} hover:opacity-90 transition-opacity duration-300 snap-start`}
                              title={`Image ${i + 1}`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img src={src} alt="thumb" className="h-14 w-20 object-cover" />
                            </motion.button>
                          ))}
                        </div>
                        {/* <motion.button
                          onClick={() => setCurrentIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length)}
                          className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors duration-300"
                          title="Previous image"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="material-symbols-outlined">chevron_left</span>
                        </motion.button> */}
                        {/* <motion.button
                          onClick={() => setCurrentIndex((i) => (i + 1) % imageUrls.length)}
                          className="absolute -right-10 top-1/2 -translate-y-1/2 flex items-center justify-end p-2 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 transition-colors duration-300"
                          title="Next image"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <span className="material-symbols-outlined">chevron_right</span>
                        </motion.button> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-6"
            variants={containerVariants}
          >
            <motion.div className="md:col-span-2 space-y-8" variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold text-text-light dark:text-white">
                      {priceText}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {addressText}
                    </p>
                  </div>
                  <motion.button 
                    className={`flex items-center gap-2 py-2 px-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300 ${saved ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                    onClick={() => setSaved(!saved)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="material-symbols-outlined text-red-500" 
                      style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                      animate={{ scale: saved ? 1.1 : 1 }}
                      transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 10 }}
                    >
                      {saved ? 'favorite' : 'favorite_border'}
                    </motion.span>
                    <span className="font-medium text-sm font-display">
                      {saved ? 'Saved' : 'Save'}
                    </span>
                  </motion.button>
                </div>

                <div className="pt-6">
                  <div className="flex border-b border-gray-200 dark:border-gray-700 gap-8">
                    <a className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2 transition-colors duration-300" href="#">
                      <p className="text-sm font-bold">Overview</p>
                    </a>
                    <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-gray-500 dark:text-gray-400 pb-3 pt-2 hover:text-primary hover:border-primary/50 transition-colors duration-300" href="#">
                      <p className="text-sm font-bold">Features</p>
                    </a>
                    <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-gray-500 dark:text-gray-400 pb-3 pt-2 hover:text-primary hover:border-primary/50 transition-colors duration-300" href="#">
                      <p className="text-sm font-bold">Map</p>
                    </a>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">
                    Property Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {data?.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-text-light dark:text-white mb-4">
                  Virtual Tour
                </h3>
                {videoUrls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <video key={currentVideoIndex} src={videoUrls[currentVideoIndex]} controls className="aspect-video w-full rounded-lg object-contain bg-black" />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      {videoUrls.map((v, i) => (
                        <motion.button
                          key={`vid-${i}`}
                          onClick={() => setCurrentVideoIndex(i)}
                          className={`w-full flex items-center gap-3 p-2 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${i === currentVideoIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                          title={`Video ${i + 1}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative h-12 w-16 bg-black rounded overflow-hidden">
                            <video
                              src={v}
                              className="h-full w-full object-cover opacity-80"
                              muted
                              preload="metadata"
                              onLoadedMetadata={(e) => {
                                const dur = (e.currentTarget as HTMLVideoElement).duration;
                                setVideoDurations((prev) => ({ ...prev, [i]: formatDuration(dur) }));
                              }}
                            />
                            <span className="material-symbols-outlined text-white text-sm absolute inset-0 m-auto h-5 w-5">play_arrow</span>
                            {videoDurations[i] && (
                              <span className="absolute bottom-1 right-1 text-[10px] px-1 rounded bg-black/70 text-white">{videoDurations[i]}</span>
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Video {i + 1}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg overflow-hidden relative group bg-gray-200 dark:bg-gray-700">
                    <img 
                      alt="No video preview available" 
                      className="w-full h-full object-cover opacity-50" 
                      src={heroImage}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-lg">No videos provided</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-text-light dark:text-white mb-4">
                  Mortgage Calculator
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="property-price">
                        Property Price
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input 
                          className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-white p-3 pl-7 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                          id="property-price" 
                          name="property-price" 
                          type="text" 
                          value="12,500,000" 
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="down-payment">
                        Down Payment
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input 
                          className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 pl-7 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                          id="down-payment" 
                          name="down-payment" 
                          placeholder="2,500,000" 
                          type="text" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="interest-rate">
                        Interest Rate
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input 
                          className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 pr-8 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                          id="interest-rate" 
                          name="interest-rate" 
                          placeholder="6.5" 
                          type="text" 
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="loan-term">
                        Loan Term (Years)
                      </label>
                      <select 
                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                        id="loan-term" 
                        name="loan-term"
                      >
                        <option>30</option>
                        <option>20</option>
                        <option>15</option>
                        <option>10</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">Estimated Monthly Payment</p>
                    <p className="text-4xl font-bold text-primary mt-2">$63,207</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Principal &amp; Interest only. Does not include taxes, insurance, or HOA fees.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-text-light dark:text-white mb-4">
                  Key Features
                </h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4">
                  {[
                    { icon: 'bed', label: 'Bedrooms', value: '5' },
                    { icon: 'bathtub', label: 'Bathrooms', value: '6' },
                    { icon: 'square_foot', label: 'Sq. Ft.', value: '5,200' },
                    { icon: 'garage', label: 'Garage', value: '2' },
                  ].map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="flex flex-1 gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700/50 p-4 flex-col transition-colors duration-300 hover:border-primary dark:hover:border-primary"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-base font-bold text-text-light dark:text-white">{feature.value}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{feature.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-text-light dark:text-white mb-4">
                  Location
                </h3>
                <div className="w-full h-80 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={mapUrl}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title={`Map of ${addressText}`}
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </motion.div>

            <motion.div className="md:col-span-1" variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md sticky top-24">
                <h3 className="text-xl font-bold text-primary mb-4 text-center">
                  Interested? Schedule a Tour
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
                  Select a date and time that works for you.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="tour-date">
                      Date
                    </label>
                    <input 
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                      id="tour-date" 
                      type="date" 
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="tour-time">
                      Time
                    </label>
                    <select 
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                      id="tour-time"
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                    >
                      <option>9:00 AM</option>
                      <option>11:00 AM</option>
                      <option>1:00 PM</option>
                      <option>3:00 PM</option>
                      <option>5:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="name-tour">Name</label>
                    <input 
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                      id="name-tour" 
                      placeholder="Your Name" 
                      type="text" 
                      value={tourName}
                      onChange={(e) => setTourName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="email-tour">Email</label>
                    <input 
                      className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 text-sm focus:ring-primary focus:border-primary transition-colors duration-300" 
                      id="email-tour" 
                      placeholder="Your Email" 
                      type="email" 
                      value={tourEmail}
                      onChange={(e) => setTourEmail(e.target.value)}
                    />
                  </div>
                  <motion.button 
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    type="button" 
                    onClick={handleScheduleTour}
                    disabled={isScheduling}
                    whileHover={{ scale: isScheduling ? 1 : 1.05 }}
                    whileTap={{ scale: isScheduling ? 1 : 0.95 }}
                  >
                    {isScheduling ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span>Schedule Tour</span>
                      </>
                    )}
                  </motion.button>
                  {formMessage.text && (
                    <div className={`text-center text-sm ${formMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {formMessage.text}
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-white mb-4 text-center">
                    Or Contact Agent
                  </h3>
                  <div className="flex flex-col items-center">
                    <motion.img 
                      className="size-24 rounded-full mb-4 shadow-lg" 
                      alt="Photo of Jane Doe, the listing agent." 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ9nKidru-7S7mUHowvYI543dQXEe3TFmdcnSMqG4J19qGJK_pxffiLc5z9-aYc8vldcN0vj4oMxLhBWYJR--H6m8EqQmRtSu0s-2SIdesNQmN_7FaBj5Esx1Nvpwo4VEaHVtJ59B73RGX-XGQAOt1ih77MaSm4klqjpU1wbpVFlMDtQjUqushnyLpBHubOqERVVrspvdJ64iNuXNX8ZPb8lDW61pEN5ZIo84BsthAvb1DouUNCywhJss_h-Ksplg08lpti-77Y0V5" 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <p className="font-bold text-lg text-[#111618] dark:text-white font-display">Jane Doe</p>
                    <p className="text-gray-500 dark:text-gray-400 font-body">Luxury Real Estate Group</p>
                  </div>
                  <form className="mt-6 space-y-4">
                    <div>
                      <label className="sr-only" htmlFor="name">Name</label>
                      <input 
                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 dark:text-white p-3 text-sm font-body focus:ring-primary focus:border-primary transition-colors duration-300" 
                        id="name" 
                        placeholder="Name" 
                        type="text" 
                      />
                    </div>
                    <div>
                      <label className="sr-only" htmlFor="email">Email</label>
                      <input 
                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-700 dark:text-white p-3 text-sm font-body focus:ring-primary focus:border-primary transition-colors duration-300" 
                        id="email" 
                        placeholder="Email" 
                        type="email" 
                      />
                    </div>
                    <motion.button 
                      className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors duration-300 font-display" 
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-200 dark:border-gray-700 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">{priceText}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{addressText}</span>
          </div>
          <motion.button 
            className="flex-shrink-0 py-3 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScheduleTour}
            disabled={isScheduling}
          >
             {isScheduling ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">calendar_month</span>
                <span>Schedule Tour</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
