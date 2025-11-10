'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import { useLang } from '@/contexts/LanguageContext';
import { ArrowLeft, Search, Bed, Bath, Home, MapPin, Filter, X, Sun, Moon } from 'lucide-react';
import PropertyDetails from '@/components/propertyDetail';

interface Property {
  id: string;
  title?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  photoURLs?: string[];
  floor?: number;
  propertyType?: string;
  type?: 'sale' | 'rent';
}

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
    </div>
  );
}

function PropertiesClientPage() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('id');

  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sale' | 'rent'>('all');

  // Filters
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [floorFilter, setFloorFilter] = useState<string>('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [bedFilter, setBedFilter] = useState<string>('all');

  // Theme (optional auto-detect)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const floorOptions = useMemo(() => Array.from({ length: 31 }, (_, i) => `G+${i + 1}`), []);
  const bedOptions = ['1', '2', '3', '4'];
  const sizeOptions = useMemo(() => {
    const start = propertyTypeFilter === 'shop' ? 25 : 45;
    return Array.from({ length: 160 - start + 1 }, (_, i) => start + i);
  }, [propertyTypeFilter]);

  // Reset size on type change
  useEffect(() => {
    if (sizeFilter !== 'all' && parseInt(sizeFilter) < (propertyTypeFilter === 'shop' ? 25 : 45)) {
      setSizeFilter('all');
    }
  }, [propertyTypeFilter, sizeFilter]);

  // Fetch
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'properties'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
        setProperties(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const locations = useMemo(() => [...new Set(properties.map(p => p.location).filter(Boolean))].sort(), [properties]);
  const propertyTypes = useMemo(() => {
    const db = properties.map(p => p.propertyType).filter(Boolean);
    return [...new Set([...db, 'shop', 'apartam'])].sort();
  }, [properties]);

  // Filtering
  useEffect(() => {
    let results = properties;

    if (search) {
      results = results.filter(p =>
        (p.title?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (p.location?.toLowerCase() || '').includes(search.toLowerCase())
      );
    }
    if (filter !== 'all') results = results.filter(p => p.type === filter);
    if (locationFilter !== 'all') results = results.filter(p => p.location === locationFilter);
    if (propertyTypeFilter !== 'all') results = results.filter(p => p.propertyType === propertyTypeFilter);
    if (sizeFilter !== 'all') results = results.filter(p => (p.squareFeet || 0) >= parseInt(sizeFilter));
    if (floorFilter) results = results.filter(p => `G+${p.floor}` === floorFilter);
    if (bedFilter !== 'all') results = results.filter(p => p.bedrooms === parseInt(bedFilter));

    setFiltered(results);
  }, [search, filter, properties, locationFilter, sizeFilter, floorFilter, propertyTypeFilter, bedFilter]);

  const handlePropertyClick = (id: string) => {
    const compare = searchParams.get('compare') === 'true';
    if (compare) {
      const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
      if (ids.length < 4 && !ids.includes(id)) {
        router.push(`/compareProperties?ids=${[...ids, id].join(',')}`);
      }
    } else {
      router.push(`/properties?id=${id}`);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilter('all');
    setLocationFilter('all');
    setPropertyTypeFilter('all');
    setSizeFilter('all');
    setFloorFilter('');
    setBedFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {propertyId ? (
        <PropertyDetails onBack={() => router.push('/properties')} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Header */} 
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 md:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <ArrowLeft className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t('properties') || 'Properties'}
                </h1>
              </div>
            </div>

            {/* Filters Panel */}
            <div>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-4 sm:p-6 mb-8 md:mb-10 border border-white/30 dark:border-gray-700">

                {/* Search Bar - ENHANCED */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 
                    text-gray-500 dark:text-gray-400 
                    transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder') || 'Search by title, location...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-10 py-4 sm:py-5 
                      text-base sm:text-lg font-medium
                      text-gray-900 dark:text-gray-100
                      placeholder:text-gray-500 dark:placeholder:text-gray-400
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      rounded-2xl
                      focus:outline-none focus:ring-4 
                      focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      focus:border-indigo-500 dark:focus:border-indigo-400
                      transition-all duration-300
                      shadow-inner"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 
                        p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 
                        transition-all"
                    >
                      <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

                  {/* Location */}
                  <select
                    value={locationFilter}
                    onChange={e => setLocationFilter(e.target.value)}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      focus:border-indigo-500 dark:focus:border-indigo-400
                      transition-all"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

                  {/* Property Type */}
                  <select
                    value={propertyTypeFilter}
                    onChange={e => setPropertyTypeFilter(e.target.value)}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      transition-all"
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  {/* Beds */}
                  <select
                    value={bedFilter}
                    onChange={e => setBedFilter(e.target.value)}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      transition-all"
                  >
                    <option value="all">Any Beds</option>
                    {bedOptions.map(b => (
                      <option key={b} value={b}>{b} Bed{b !== '1' && 's'}</option>
                    ))}
                  </select>

                  {/* Size */}
                  <select
                    value={sizeFilter}
                    onChange={e => setSizeFilter(e.target.value)}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      transition-all"
                  >
                    <option value="all">Any Size</option>
                    {sizeOptions.map(size => (
                      <option key={size} value={size}>≥ {size} sqft</option>
                    ))}
                  </select>

                  {/* Floor */}
                  <select
                    value={floorFilter}
                    onChange={e => setFloorFilter(e.target.value)}
                    className="p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                      bg-gray-50/70 dark:bg-gray-700/70
                      border border-gray-300 dark:border-gray-600
                      text-gray-900 dark:text-gray-100
                      focus:ring-4 focus:ring-indigo-400/50 dark:focus:ring-indigo-500/50
                      transition-all"
                  >
                    <option value="">Any Floor</option>
                    {floorOptions.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex justify-center lg:col-span-full">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-5 py-3 sm:px-6 
                      bg-gradient-to-r from-red-500 to-pink-500 
                      hover:from-red-600 hover:to-pink-600
                      text-white font-bold rounded-full 
                      shadow-xl hover:shadow-2xl 
                      transform hover:scale-105 transition-all duration-300"
                  >
                    <X className="h-5 w-5" />
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Sale/Rent Tabs */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8 md:mb-10 flex-wrap">
              {(['all', 'sale', 'rent'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg 
                    transition-all transform hover:scale-105 shadow-xl
                    ${filter === f
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 backdrop-blur-xl'
                    }`}
                >
                  {t(f === 'all' ? 'all' : f === 'sale' ? 'forSale' : 'forRent')}
                </button>
              ))}
            </div>

            {/* Results */}
            <p className="text-center text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-8 md:mb-10">
              {filtered.length} {t('propertiesFound') || 'properties found'}
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-32">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-16 shadow-2xl inline-block">
                  <Home className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                  <p className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300">
                    No properties found
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-3">Try different filters</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filtered.map((property, index) => (
                  <div
                    key={property.id}
                    onClick={() => handlePropertyClick(property.id)}
                    className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer border border-white/30 dark:border-gray-700"
                  >
                    <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl">
                      {property.photoURLs?.[0] ? (
                        <img
                          src={property.photoURLs[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <Home className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-4 py-1.5 rounded-full text-white font-bold text-xs shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                        {property.type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                        {property.title || 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium">{property.location || 'Unknown'}</span>
                      </div>

                      <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                        ${property.price?.toLocaleString() || 'N/A'}
                        {property.type === 'rent' && <span className="text-lg">/mo</span>}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div className="flex flex-col items-center">
                          <Bed className="h-6 w-6 text-indigo-600 mb-1" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{property.bedrooms || 0}</span>
                          <span className="text-xs text-gray-500">Beds</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Bath className="h-6 w-6 text-indigo-600 mb-1" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{property.bathrooms || 0}</span>
                          <span className="text-xs text-gray-500">Baths</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Home className="h-6 w-6 text-indigo-600 mb-1" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{property.squareFeet || 0}</span>
                          <span className="text-xs text-gray-500">sqft</span>
                        </div>
                      </div>

                      <button className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function PropertiesPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesClientPage />
    </Suspense>
  );
}