// app/auth/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const googleIcon =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpHjzxfKcCQMVmSzGu4AgwnNjmfIu025aNlMKOGvkq2vYtmZgArjmMrfCuqgcsG_zpJyeQqXCqI13oxZ7q0WzVWnLsJ9sUVDmHYbR3nHMYiwxhPVT9IKLmwMJvdMKWXmolK1SPOKA0-v2YUyUtJ8ro1AR0VJfRKetGjLn3vNzkGzSxNcYV-kZEVTaJrJDrR-Q-XG5oEGfGbb-vFVsd2CDHNXzQBGHoLqa_sfRDwTq2xV9j-qVvGHI89UMWPKJrCvE8eeIOcQHkRdJI';

// Move component definitions to the top
const InputField = ({ label, placeholder, type, name, value, onChange, showPassword, togglePassword }: any) => {
  return (
    <label className="flex flex-col">
      <p className="text-gray-700 dark:text-gray-300 text-base font-medium pb-2">{label}</p>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-14 px-4 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#101c22] text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
        />
        {(type === 'password' || type === 'text') && togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </label>
  );
};

const LoginForm = ({ formData, showPassword, loading, onInputChange, onTogglePassword, onSubmit, t }: any) => {
  return (
    <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
        {t('welcomeBack')}
      </h1>

      <InputField 
        label={t('emailUsername')} 
        placeholder={t('placeholderEmailUser')} 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={onInputChange} 
      />
      <InputField
        label={t('password')}
        placeholder={t('placeholderPassword')}
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={onInputChange}
        showPassword={showPassword}
        togglePassword={onTogglePassword}
      />

      <p className="text-right text-sm text-teal-600 dark:text-teal-400 underline cursor-pointer hover:opacity-80">
        {t('forgotPassword')}
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700'
        }`}
      >
        {loading ? 'Signing in...' : t('loginBtn')}
      </motion.button>
    </motion.div>
  );
};

const RegisterForm = ({ formData, showPassword, loading, onInputChange, onTogglePassword, onSubmit, t }: any) => {
  return (
    <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
        {t('createAccount')}
      </h1>

      <InputField
        label={t('fullName') || 'Full Name'}
        placeholder={t('placeholderFullName') || 'Enter your full name'}
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={onInputChange}
      />

      <InputField
        label={t('phone') || 'Phone Number'}
        placeholder={t('placeholderPhone') || 'Enter your phone number'}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onInputChange}
      />

      <InputField 
        label={t('email')} 
        placeholder={t('placeholderEmail')} 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={onInputChange} 
      />
      <InputField
        label={t('password')}
        placeholder={t('placeholderCreatePassword')}
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={onInputChange}
        showPassword={showPassword}
        togglePassword={onTogglePassword}
      />
      <InputField
        label={t('confirmPassword')}
        placeholder={t('placeholderConfirmPassword')}
        type={showPassword ? 'text' : 'password'}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onInputChange}
        showPassword={showPassword}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700'
        }`}
      >
        {loading ? 'Creating account...' : t('registerBtn')}
      </motion.button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
        {t('termsPrefix')}{' '}
        <a href="#" className="text-teal-600 dark:text-teal-400 underline">
          {t('terms')}
        </a>{' '}
        {t('and')}{' '}
        <a href="#" className="text-teal-600 dark:text-teal-400 underline">
          {t('privacy')}
        </a>
        .
      </p>
    </motion.div>
  );
};

export default function AuthPage() {
  const { t } = useLang();
  const { user, refreshUserData } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '', // Added fullName
    phone: '',     // Added phone
  });

  // ────── AUTH LISTENER ──────
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'user') {
        router.replace('/user');
      }
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    // More strict email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const validateRegister = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName || !formData.phone) {
      toast.error('Please fill in all fields');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const createCustomer = async (uid: string, email: string, fullName: string, phone: string, displayName?: string) => {
    try {
      // For testing: You can manually set a user as admin by checking their email
      const isAdmin = email === 'admin@example.com'; // Change this to your admin email
      const role = isAdmin ? 'admin' : 'user';
      
      console.log(`Creating customer with role: ${role} for email: ${email}`);
      
      await setDoc(doc(db, 'customers', uid), {
        uid,
        email,
        name: fullName,
        phone: phone,
        displayName: displayName || fullName || email.split('@')[0],
        role: role,
        createdAt: new Date().toISOString(),
      });
      console.log('Customer document created for:', email, 'with role:', role);
    } catch (error) {
      console.error('Error creating customer document:', error);
      throw error;
    }
  };

  const handleEmailAuth = async (type: 'login' | 'register') => {
    console.log('Starting email auth for:', type, formData.email);
    
    if (type === 'login' && !validateLogin()) return;
    if (type === 'register' && !validateRegister()) return;

    setLoading(true);

    try {
      let userCredential;
      
      if (type === 'login') {
        console.log('Attempting login...');
        userCredential = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      } else {
        console.log('Attempting registration...');
        userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
        console.log('User created, creating customer document with full name and phone...');
        await createCustomer(userCredential.user.uid, formData.email.trim(), formData.fullName, formData.phone);
      }

      console.log('Auth successful, user:', userCredential.user.email);
      toast.success(`Welcome ${userCredential.user.displayName || userCredential.user.email}`);
      
      // Refresh user data in context
      if (refreshUserData) { // This will trigger the useEffect above to redirect
        await refreshUserData();
      }
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
      });

    } catch (error: any) {
      console.error('Auth error details:', error);
      
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please log in instead.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Authentication failed: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      console.log('Starting Google sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google auth successful, user:', user.email);

      const custSnap = await getDoc(doc(db, 'customers', user.uid));
      if (!custSnap.exists()) {
        console.log('Creating customer document for Google user...');
        await createCustomer(user.uid, user.email!, user.displayName || '', user.phoneNumber || '');
      }

      // Refresh user data in context
      if (refreshUserData) { // This will trigger the useEffect above to redirect
        await refreshUserData();
      }

      toast.success(`Welcome ${user.displayName || user.email}`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
      });

    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="relative flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-[#0f1a22] dark:to-[#1a2a33] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-20 w-72 h-72 bg-gradient-to-r from-teal-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -right-20 w-72 h-72 bg-gradient-to-r from-pink-400/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl bg-white/80 dark:bg-[#1a2a33]/90 backdrop-blur-xl shadow-2xl p-8 border border-white/20 dark:border-gray-700">
            {/* Tabs */}
            <div className="flex h-12 mb-8 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              {(['login', 'register'] as const).map((tab) => (
                <label
                  key={tab}
                  className="relative flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 transition-all duration-300"
                >
                  <span
                    className={`truncate text-sm font-semibold z-10 transition-all ${
                      activeTab === tab ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {t(`auth.${tab}Tab`)}
                  </span>
                  <input
                    type="radio"
                    name="auth-toggle"
                    value={tab}
                    checked={activeTab === tab}
                    onChange={() => setActiveTab(tab)}
                    className="sr-only"
                  />
                  {activeTab === tab && (
                    <motion.div
                      layoutId="auth-tab"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 shadow-md"
                    />
                  )}
                </label>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <LoginForm
                  formData={formData}
                  showPassword={showPassword}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onSubmit={() => handleEmailAuth('login')}
                  t={t}
                />
              ) : (
                <RegisterForm
                  formData={formData}
                  showPassword={showPassword}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onSubmit={() => handleEmailAuth('register')}
                  t={t}
                />
              )}
            </AnimatePresence>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
              <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">
                {t('orContinue')}
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md"
            >
              <Image src={googleIcon} alt="Google" width={24} height={24} className="mr-3" />
              <span className="font-medium text-gray-700 dark:text-white">
                {t('google')}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}