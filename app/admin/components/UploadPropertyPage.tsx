'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload, X, Camera, AlertCircle, CheckCircle, Loader2, Home, Bed, Bath, Square, Building2, DollarSign, MapPin } from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// ── CLOUDINARY CONFIG ─────────────────────
const CLOUDINARY_PHOTO_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'photoupload';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dnqsoezfo';
const CLOUDINARY_PHOTO_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || 'photoss';
const CLOUDINARY_VIDEO_PRESET = 'goldgold';
const CLOUDINARY_VIDEO_FOLDER = 'videos';

// ── FORM DATA ─────────────────────────────
interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  status: string;
  location: string;
  propertyType: string;
  type: 'sale' | 'rent';
  floor: string;
  bedrooms: string;
  bathrooms: string;
  areaSqft: string;
  garageSpaces: string;
  amenities: string[];
  agent: string;
}

interface UploadPropertyPageProps {
  editingProperty?: any;
  onPropertySaved?: () => void;
  onCancel?: () => void;
}

export default function UploadPropertyPage({ editingProperty, onPropertySaved, onCancel }: UploadPropertyPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get('id');
  const isEditMode = Boolean(editingProperty) || Boolean(propertyId);
  const actualPropertyId = editingProperty?.id || propertyId;

  // Media states
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; fileName: string }[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<{ url: string; fileName: string }[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'uploading' | 'success' | 'error';
    message: string;
    progress?: number;
    fileName?: string;
  } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [videoFiles, setVideoFiles] = useState<FileList | null>(null);
  const [existingPhotoURLs, setExistingPhotoURLs] = useState<string[] | null>(null);
  const [existingVideoURLs, setExistingVideoURLs] = useState<string[] | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      status: 'Available',
      location: '',
      propertyType: 'apartam',
      type: 'sale',
      floor: '',
      bedrooms: '',
      bathrooms: '',
      areaSqft: '',
      garageSpaces: '',
      amenities: [],
      agent: '',
    },
  });

  const propertyType = watch('propertyType');

  // Dynamic floor & size options
  const floorOptions = Array.from({ length: 30 }, (_, i) => `G+${i + 1}`);
  const sizeOptions = propertyType === 'shop' 
    ? Array.from({ length: 176 }, (_, i) => 25 + i)
    : Array.from({ length: 156 }, (_, i) => 45 + i);

  // Prefill on edit
  useEffect(() => {
    if (editingProperty) {
      const p = editingProperty;
      reset({
        title: p.title || '',
        description: p.description || '',
        price: p.price != null ? String(p.price) : '',
        status: p.status || 'Available',
        location: p.location || '',
        propertyType: p.propertyType || 'apartam',
        type: p.type || 'sale',
        floor: p.floor ? `G+${p.floor}` : '',
        bedrooms: p.bedrooms != null ? String(p.bedrooms) : '',
        bathrooms: p.bathrooms != null ? String(p.bathrooms) : '',
        areaSqft: p.areaSqft != null ? String(p.areaSqft) : '',
        garageSpaces: p.garageSpaces != null ? String(p.garageSpaces) : '',
        amenities: Array.isArray(p.amenities) ? p.amenities : [],
        agent: p.agent || '',
      });

      if (Array.isArray(p.photoURLs)) {
        setExistingPhotoURLs(p.photoURLs);
        setPhotoPreviews(p.photoURLs);
      }
      if (Array.isArray(p.videoURLs)) {
        setExistingVideoURLs(p.videoURLs);
      }
    }
  }, [editingProperty, reset]);

  // Photo handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const valid = Array.from(files).filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (valid.length === 0) return;

    const dt = new DataTransfer();
    valid.forEach(f => dt.items.add(f));
    setPhotoFiles(dt.files);

    const previews = valid.map(f => URL.createObjectURL(f));
    setPhotoPreviews(prev => [...prev, ...previews]);
  };

  // Video handler
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const valid = Array.from(files).filter(f => 
      ['video/mp4', 'video/mov', 'video/webm'].includes(f.type) && f.size <= 1000 * 1024 * 1024
    );
    if (valid.length === 0) return;

    const dt = new DataTransfer();
    valid.forEach(f => dt.items.add(f));
    setVideoFiles(dt.files);

    const previews = valid.map(f => URL.createObjectURL(f));
    setVideoPreviews(previews);
  };

  // Camera capture
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const dt = new DataTransfer();
      dt.items.add(file);
      photoInputRef.current!.files = dt.files;
      setPhotoFiles(dt.files);
      setPhotoPreviews(prev => [...prev, URL.createObjectURL(file)]);
      setShowCamera(false);
      toast.success('Photo captured!');
    }, 'image/jpeg', 0.95);
  };

  useEffect(() => {
    if (showCamera) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          toast.error('Camera access denied');
          setShowCamera(false);
        });
    }
  }, [showCamera]);

  // Cloudinary upload
  const uploadToCloudinary = async (files: File[], type: 'image' | 'video') => {
    const uploaded: { url: string; fileName: string }[] = [];
    const preset = type === 'image' ? CLOUDINARY_PHOTO_PRESET : CLOUDINARY_VIDEO_PRESET;
    const folder = type === 'image' ? CLOUDINARY_PHOTO_FOLDER : CLOUDINARY_VIDEO_FOLDER;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatus({
        type: 'uploading',
        message: `Uploading ${file.name}...`,
        progress: ((i + 1) / files.length) * 100,
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);
      formData.append('folder', folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`,
        { method: 'POST', body: formData }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);

      uploaded.push({ url: json.secure_url, fileName: file.name });
    }
    return uploaded;
  };

  // Submit
  const onSubmit = async (data: PropertyFormData) => {
    const photos = photoFiles ? Array.from(photoFiles) : [];
    const videos = videoFiles ? Array.from(videoFiles) : [];

    if (!isEditMode && photos.length === 0) {
      toast.error('Add at least one photo');
      return;
    }

    try {
      const photoURLs = photos.length ? await uploadToCloudinary(photos, 'image') : [];
      const videoURLs = videos.length ? await uploadToCloudinary(videos, 'video') : [];

      const payload: any = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        status: data.status,
        location: data.location,
        propertyType: data.propertyType,
        type: data.type,
        floor: data.floor ? parseInt(data.floor.replace('G+', '')) : undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : undefined,
        areaSqft: data.areaSqft ? parseInt(data.areaSqft) : undefined,
        garageSpaces: data.garageSpaces ? parseInt(data.garageSpaces) : undefined,
        amenities: data.amenities,
        agent: data.agent,
        photoURLs: photoURLs.length ? photoURLs.map(p => p.url) : existingPhotoURLs,
        videoURLs: videoURLs.length ? videoURLs.map(v => v.url) : existingVideoURLs,
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && actualPropertyId) {
        await updateDoc(doc(db, 'properties', actualPropertyId), payload);
        toast.success('Property updated!');
      } else {
        await addDoc(collection(db, 'properties'), {
          ...payload,
          uploadedAt: new Date().toISOString(),
        });
        toast.success('Property added!');
      }

      onPropertySaved?.();
      if (!onPropertySaved) {
        reset();
        setPhotoPreviews([]);
        setVideoPreviews([]);
        router.push('/admin?section=manage');
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
  };

  const removePhotoPreview = (i: number) => {
    setPhotoPreviews(p => p.filter((_, idx) => idx !== i));
    if (photoFiles && i >= (existingPhotoURLs?.length || 0)) {
      const dt = new DataTransfer();
      Array.from(photoFiles)
        .filter((_, idx) => idx !== i - (existingPhotoURLs?.length || 0))
        .forEach(f => dt.items.add(f));
      setPhotoFiles(dt.files);
    } else {
      setExistingPhotoURLs(prev => prev?.filter((_, idx) => idx !== i) || null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Home className="h-8 w-8 text-indigo-600" />
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h2>
        {isEditMode && <span className="text-sm text-gray-500">ID: {actualPropertyId}</span>}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Title & Property Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4" /> Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g., Luxury Beach Villa"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Building2 className="h-4 w-4" /> Property Type
            </label>
            <select
              {...register('propertyType')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30"
            >
              <option value="apartam">Apartment</option>
              <option value="shop">Shop</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
            </select>
          </div>
        </div>

        {/* Listing Type & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="h-4 w-4" /> Listing Type
            </label>
            <div className="flex gap-6 mt-3">
              {(['sale', 'rent'] as const).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('type')} value={t} className="text-indigo-600" />
                  <span className="font-medium capitalize">{t === 'sale' ? 'For Sale' : 'For Rent'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('price', { required: 'Price required' })}
              type="number"
              placeholder="450000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Location & Floor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              {...register('location', { required: 'Location required' })}
              placeholder="Dubai Marina, UAE"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Floor
            </label>
            <select
              {...register('floor')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30"
            >
              <option value="">Any Floor</option>
              {floorOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Beds, Baths, Size */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Bed className="h-4 w-4" /> Bedrooms
            </label>
            <select
              {...register('bedrooms')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <option value="">Any</option>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Bath className="h-4 w-4" /> Bathrooms
            </label>
            <input
              {...register('bathrooms')}
              type="number"
              step="0.5"
              placeholder="2"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Square className="h-4 w-4" /> Size (sqft)
            </label>
            <select
              {...register('areaSqft')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            >
              <option value="">Any</option>
              {sizeOptions.map(s => <option key={s} value={s}>≥ {s}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description', { required: 'Required' })}
            rows={5}
            placeholder="Stunning views, modern kitchen..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-4 focus:ring-indigo-500/30 resize-none"
          />
        </div>

        {/* Key Facts */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Additional Details</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <input {...register('garageSpaces')} type="number" placeholder="Garage Spaces" className="px-4 py-3 rounded-xl border" />
            <select {...register('status')} className="px-4 py-3 rounded-xl border">
              <option>Available</option>
              <option>Pending</option>
              <option>Sold</option>
            </select>
            <select {...register('agent')} className="px-4 py-3 rounded-xl border">
              <option>John Doe</option>
              <option>Jane Smith</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Swimming Pool', 'Garage', 'Garden', 'Balcony', 'Gym', 'Security', 'Parking', 'WiFi'].map((a) => (
              <label key={a} className="flex items-center gap-2">
                <input {...register('amenities')} type="checkbox" value={a} className="rounded text-indigo-600" />
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Photos {existingPhotoURLs && `(${existingPhotoURLs.length} existing)`}
          </label>
          <div className="flex gap-3 mb-4">
            <input ref={photoInputRef} type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <button type="button" onClick={() => photoInputRef.current?.click()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2">
              <Upload /> Upload
            </button>
            <button type="button" onClick={() => setShowCamera(!showCamera)} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2">
              <Camera /> {showCamera ? 'Close' : 'Camera'}
            </button>
          </div>

          {showCamera && (
            <div className="bg-black rounded-xl overflow-hidden max-w-md mb-4">
              <video ref={videoRef} autoPlay className="w-full" />
              <button onClick={capturePhoto} className="w-full py-3 bg-green-600 text-white hover:bg-green-700">
                Capture Photo
              </button>
            </div>
          )}

          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {photoPreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <Image src={src} alt="" width={200} height={150} className="rounded-lg object-cover h-32" />
                  <button onClick={() => removePhotoPreview(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Videos</label>
          <input type="file" multiple accept="video/*" onChange={handleVideoChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-50 file:text-indigo-700" />
          {videoPreviews.length > 0 && (
            <div className="mt-4 space-y-3">
              {videoPreviews.map((src, i) => (
                <div key={i} className="flex items-center gap-3">
                  <video src={src} controls className="w-64 h-40 rounded-lg" />
                  <button onClick={() => {
                    setVideoPreviews(p => p.filter((_, idx) => idx !== i));
                    const dt = new DataTransfer();
                    videoFiles && Array.from(videoFiles).filter((_, idx) => idx !== i).forEach(f => dt.items.add(f));
                    setVideoFiles(dt.files);
                  }} className="text-red-500">
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        {uploadStatus && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : uploadStatus.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {uploadStatus.type === 'uploading' && <Loader2 className="animate-spin" />}
            {uploadStatus.type === 'success' && <CheckCircle />}
            {uploadStatus.type === 'error' && <AlertCircle />}
            <span>{uploadStatus.message}</span>
            {uploadStatus.progress !== undefined && (
              <div className="ml-auto w-32 bg-gray-300 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${uploadStatus.progress}%` }} />
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button type="button" onClick={onCancel || (() => router.push('/admin?section=manage'))} className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl flex items-center gap-3 disabled:opacity-70">
            {isSubmitting ? <>Uploading <Loader2 className="animate-spin" /></> : <>{isEditMode ? 'Update' : 'Save'} Property</>}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" theme="colored" />
    </motion.div>
  );
}