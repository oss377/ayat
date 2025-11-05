'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { useLang } from '@/contexts/LanguageContext';
import { ArrowLeft, Bed, Bath, Home, MapPin, Share2, Heart, Calendar, Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Property {
  id: string;
  title?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  photoURLs?: string[];
  videoURLs?: string[];
  description?: string;
  type?: 'sale' | 'rent';
  status?: string;
  agent?: {
    name?: string;
    email?: string;
    phone?: string;
    photo?: string;
  };
  propertyType?: string;
  floor?: string;
  amenities?: string[];
}

export default function PropertyDetailPage() {
  const { t } = useLang();
  const router = useRouter();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || Array.isArray(id)) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProperty({
            id: docSnap.id,
            ...data,
          } as Property);
        } else {
          console.warn('No property found with ID:', id);
        }
      } catch (err) {
        console.error('Firebase Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Not Found
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mt-4">
            {t('notFound') || 'Property Not Found'}
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg flex items-center gap-3"
        >
          <ArrowLeft /> {t('backHome') || 'Back to Home'}
        </button>
      </div>
    );
  }

  const price = property.price ? `$${property.price.toLocaleString()}` : 'Contact for Price';
  const heroImg = property.photoURLs?.[currentPhotoIndex] || '/placeholder-home.jpg';
  const agent = property.agent || { name: 'Jane Doe', email: 'agent@homely.com', phone: '+1 555-0123', photo: '/agent-placeholder.jpg' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('back') || 'Back'}
          </button>

          <div className="flex gap-3">
            <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Heart className={`h-5 w-5 transition-all ${saved ? 'fill-red-500 text-red-500 scale-125' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-10"
        >
          <Image
            src={heroImg}
            alt={property.title || 'Property'}
            width={1200}
            height={600}
            className="w-full h-96 md:h-[500px] object-cover"
            priority
          />

          {/* Photo Counter */}
          {property.photoURLs && property.photoURLs.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentPhotoIndex + 1} / {property.photoURLs.length}
            </div>
          )}

          {/* Thumbnails */}
          {property.photoURLs && property.photoURLs.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full">
              {property.photoURLs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhotoIndex(i)}
                  className={`w-2 h-2 rounded-full transition ${i === currentPhotoIndex ? 'bg-white w-8' : 'bg-gray-400'}`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-6 left-6 flex gap-3">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-xl">
              {property.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
            {property.status && (
              <span className={`px-5 py-3 rounded-full font-bold text-white shadow-lg ${
                property.status === 'Available' ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {property.status}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Price */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                {price}
                {property.type === 'rent' && <span className="text-3xl font-normal text-gray-600 dark:text-gray-400"> /month</span>}
              </h1>
              <div className="flex items-center gap-3 text-xl text-gray-600 dark:text-gray-400">
                <MapPin className="h-7 w-7 text-indigo-600" />
                <span className="font-medium">{property.location || 'Location not specified'}</span>
              </div>
              {property.title && (
                <p className="text-2xl font-light text-gray-700 dark:text-gray-300 mt-3">{property.title}</p>
              )}
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl"
            >
              <div className="text-center">
                <Bed className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{property.bedrooms || '-'}</p>
                <p className="text-sm text-gray-500">Bedrooms</p>
              </div>
              <div className="text-center">
                <Bath className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{property.bathrooms || '-'}</p>
                <p className="text-sm text-gray-500">Bathrooms</p>
              </div>
              <div className="text-center">
                <Home className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{property.squareFeet?.toLocaleString() || '-'}</p>
                <p className="text-sm text-gray-500">Sq Ft</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About This Property</h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {property.description || 'This stunning property offers modern living with premium finishes and breathtaking views. Contact us to learn more!'}
              </p>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar: Agent & Schedule */}
          <div className="space-y-8">
            {/* Schedule Tour */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl sticky top-28"
            >
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Schedule a Private Tour
              </h3>
              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 outline-none transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 outline-none transition"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 outline-none transition"
                />
                <input
                  type="date"
                  className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 outline-none transition"
                  required
                />
                <select className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 outline-none transition">
                  <option>Any Time</option>
                  <option>9:00 AM</option>
                  <option>11:00 AM</option>
                  <option>2:00 PM</option>
                  <option>5:00 PM</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition flex items-center justify-center gap-3"
                >
                  <Calendar className="h-6 w-6" />
                  Request Tour
                </button>
              </form>
            </motion.div>

            {/* Agent Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Your Agent
              </h3>
              <div className="text-center">
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <Image
                    src={agent.photo || '/agent-placeholder.jpg'}
                    alt={agent.name || 'Agent'}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{agent.name || 'Jane Doe'}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Luxury Real Estate Specialist</p>
                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={`mailto:${agent.email}`}
                    className="p-4 bg-white dark:bg-gray-700 rounded-full hover:scale-110 transition shadow-lg"
                  >
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="p-4 bg-white dark:bg-gray-700 rounded-full hover:scale-110 transition shadow-lg"
                  >
                    <Phone className="h-6 w-6 text-indigo-600" />
                  </a>
                </div>
                <button className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
                  Message Agent
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}