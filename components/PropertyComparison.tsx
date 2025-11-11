// components/PropertyComparison.jsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebaseConfig';
import PropertyDetails from '@/components/propertyDetail';
import Head from 'next/head';

interface Property {
  id: string;
  title?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  photoURLs?: string[];
  type?: 'sale' | 'rent';
  yearBuilt?: string;
  amenities?: string;
  hoaFees?: string;
}

export default function PropertyComparison() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [aiReport, setAiReport] = useState('AI is analyzing your homes...');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedIds = useMemo(() => searchParams.get('ids')?.split(',').filter(Boolean) ?? [], [searchParams]);
  const detailId = useMemo(() => searchParams.get('id'), [searchParams]);

  // FETCH ALL HOMES
  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'properties'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setAllProperties(data);
      setLoading(false);
    };
    fetch();
  }, []);

  // UPDATE SELECTED + CALL AI
  useEffect(() => {
    const chosen = allProperties.filter(p => selectedIds.includes(p.id)).slice(0, 4);
    setSelected(chosen);
    if (chosen.length >= 2) generateAI(chosen);
  }, [allProperties, selectedIds]);

  // CALL GROQ AI WITH FULL DATA
  const generateAI = async (homes: Property[]) => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: homes }),
      });
      const { conclusion } = await res.json();
      setAiReport(conclusion || 'AI took a quick break. Refresh!');
    } catch (err) {
      setAiReport('Network error. Check your connection.');
    }
    setLoadingAI(false);
  };

  // PDF DOWNLOAD
  const downloadPDF = () => {
    const win = window.open('', '_blank');
    win?.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Property Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Work Sans', sans-serif; padding: 40px; background: white; color: #1f2937; line-height: 1.8; }
            .header { text-align: center; margin-bottom: 40px; }
            h1 { color: #4f46e5; font-size: 36px; }
            pre { background: #f0f4ff; padding: 30px; border-radius: 16px; font-size: 18px; white-space: pre-wrap; }
            .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI Property Comparison Report</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <pre>${aiReport}</pre>
          <div class="footer">Powered by Groq AI • Your Real Estate Advisor</div>
          <script>window.print(); setTimeout(() => window.close(), 1000);</script>
        </body>
      </html>
    `);
  };

  const toggle = (id: string) => setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const apply = () => {
    const final = [...new Set([...selectedIds, ...checkedIds])].slice(0, 4);
    router.push(`/compareProperties?ids=${final.join(',')}`);
    setModalOpen(false); setCheckedIds([]);
  };
  const remove = (id: string) => router.push(`/compareProperties?ids=${selectedIds.filter(x => x !== id).join(',')}`);
  const copy = () => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); };

  const handleViewDetails = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', id);
    router.push(`/compareProperties?${params.toString()}`);
  }, [router, searchParams]);

  const handleBackFromDetail = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    router.push(`/compareProperties?${params.toString()}`);
  }, [router, searchParams]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="animate-spin h-16 w-16 border-t-4 border-indigo-600 rounded-full"></div></div>;

  if (detailId) {
    return <PropertyDetails onBack={handleBackFromDetail} />;
  }

  return (
    <>
      <Head>
        <title>AI Property Comparison</title>
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </Head>

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        {/* Header */}
        <div className="flex items-center bg-indigo-600 text-white p-4 justify-between sticky top-0 z-10 print:hidden">
          <button onClick={() => router.push('/')} className="p-2 rounded-full hover:bg-indigo-500 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-center">Compare ({selected.length}/4)</h2>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="p-2 rounded-full hover:bg-indigo-500 transition-colors"><span className="material-symbols-outlined">share</span></button>
            <button onClick={downloadPDF} className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm sm:text-base">
              <span className="material-symbols-outlined">download</span>
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-gray-50 print:hidden">
          {selected.map(p => (
            <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-cover" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), transparent), url(${p.photoURLs?.[0]})` }}>
              <button onClick={() => remove(p.id)} className="absolute top-1.5 right-1.5 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
              <div className="absolute bottom-2 left-2 text-white font-bold text-sm sm:text-lg drop-shadow-lg">
                ${p.price?.toLocaleString()}
              </div>
            </div>
          ))}
          {Array.from({ length: 4 - selected.length }).map((_, i) => (
            <button key={i} onClick={() => setModalOpen(true)} className="border-4 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 transition">
              <span className="text-6xl text-indigo-400">Add</span>
              <p className="font-bold text-indigo-600">Add Home</p>
            </button>
          ))}
        </div>

        {/* Share */}
        <div className="p-4 print:hidden">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Share This Comparison</h3>
            <div className="flex gap-4 mb-4">
              <button className="text-gray-600"><EmailIcon /></button>
              <button className="text-gray-600"><TwitterIcon /></button>
              <button className="text-gray-600"><FacebookIcon /></button>
            </div>
            <div className="relative">
              <input readOnly value={typeof window !== 'undefined' ? window.location.href : ''} className="w-full bg-gray-100 rounded-lg py-3 pl-4 pr-12 text-sm" />
              <button onClick={copy} className="absolute right-3 top-3 text-gray-500">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="hidden print:block p-10 text-center border-b-4 border-indigo-600">
              <h1 className="text-4xl font-bold text-indigo-600">Property Comparison Report</h1>
              <p className="text-xl mt-2">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-8 justify-center">
              {selected.map(p => <PropertyCard key={p.id} property={p} onViewDetails={() => handleViewDetails(p.id)} />)}
            </div>
          </div>
        </div>

        {/* AI REPORT */}
        <div className="px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-200">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white">
                <h2 className="text-5xl font-bold flex items-center gap-4">
                  AI Expert Verdict
                </h2>
                <p className="text-xl opacity-90 mt-3">Your personal real estate advisor</p>
              </div>
              <div className="p-10 bg-gray-50">
                {loadingAI ? (
                  <p className="text-center text-2xl text-indigo-600 animate-pulse">AI is analyzing your homes...</p>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed bg-white p-8 rounded-2xl shadow-inner border">
                    {aiReport}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating */}
        <button className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full h-16 w-16 shadow-2xl text-4xl z-50 print:hidden hover:scale-110 transition">
          Mail
        </button>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 print:hidden" onClick={() => setModalOpen(false)} >
            <div className="bg-white rounded-3xl shadow-3xl max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b-2 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">Select up to 4 Homes</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {allProperties.map(p => {
                  const isChecked = checkedIds.includes(p.id) || selectedIds.includes(p.id);
                  const disabled = !isChecked && selected.length >= 4;
                  return (
                    <label key={p.id} className={`relative block border-4 rounded-2xl overflow-hidden cursor-pointer transition-all ${isChecked ? 'border-indigo-600 shadow-xl ring-4 ring-indigo-100' : 'border-gray-200'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="checkbox" checked={isChecked} disabled={disabled} onChange={() => toggle(p.id)} className="sr-only" />
                      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${p.photoURLs?.[0]})` }} />
                      <div className="p-5 bg-white">
                        <p className="font-bold text-indigo-600 text-lg sm:text-xl">${p.price?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 truncate">{p.title || p.location}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="p-4 sm:p-6 bg-gray-50 border-t-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-auto">
                <button onClick={() => setModalOpen(false)} className="px-6 py-3 border-2 border-gray-300 rounded-xl font-bold">Cancel</button>
                <button onClick={apply} disabled={!checkedIds.length} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 shadow-lg flex items-center gap-2">
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Clean Card
const PropertyCard = ({ property, onViewDetails }: { property: Property; onViewDetails: () => void }) => {
  const info = [
    { label: 'Price', value: `$${property.price?.toLocaleString() || 'N/A'}` },
    { label: 'Address', value: property.location || '—' },
    { label: 'Type', value: property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : '—' },
    { label: 'Beds', value: property.bedrooms || '—' },
    { label: 'Baths', value: property.bathrooms || '—' },
    { label: 'Sqft', value: property.squareFeet?.toLocaleString() || '—' },
    { label: 'Year', value: property.yearBuilt || '—' },
    { label: 'Amenities', value: property.amenities || '—' },
    { label: 'HOA', value: property.hoaFees || 'None' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 min-w-72 border-2 border-gray-100 print:w-full print:shadow-none">
      {info.map((item, i) => (
        <div key={i} className={`py-4 ${i > 0 ? 'border-t border-gray-200' : ''}`}>
          <p className="text-sm font-semibold text-gray-500">{item.label}</p>
          <p className={`mt-1 ${i === 0 ? 'text-3xl font-bold text-indigo-600' : 'text-xl'}`}>
            {item.value}
          </p>
        </div>
      ))}
      <button onClick={onViewDetails} className="w-full mt-6 py-4 bg-indigo-100 text-indigo-700 rounded-2xl font-bold hover:bg-indigo-200 transition print:hidden">
        View Details
      </button>
    </div>
  );
};

// Icons
const EmailIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>;
const TwitterIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.49-1.74.85-2.7 1.03C18.42 4.42 17.25 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.83-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.7-.02-1.37-.21-1.95-.54v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.56 1.93 7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.22z"/></svg>;
const FacebookIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm4.23 6.33h-1.89c-.58 0-.7.28-.7.69v.93h2.56l-.33 2.58h-2.23v6.59h-2.66v-6.59H8.77v-2.58h1.89v-.79c0-1.87 1.14-2.89 2.81-2.89h2.23v2.53z"/></svg>;