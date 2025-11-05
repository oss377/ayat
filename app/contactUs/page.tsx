"use client";

import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FaPaperPlane, FaExclamationCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaLinkedin, FaTelegramPlane, FaArrowLeft } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<{ status: 'idle' | 'success' | 'error', message?: string }>({ status: 'idle' });
  const [showBackArrow, setShowBackArrow] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const messageMaxLength = 500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'message') setMessageLength(value.length);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error(<div className="flex items-center gap-2"><FaExclamationCircle className="text-red-600" />Please enter your name</div>);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error(<div className="flex items-center gap-2"><FaExclamationCircle className="text-red-600" />Please enter a valid email address</div>);
      return false;
    }
    if (!formData.message.trim()) {
      toast.error(<div className="flex items-center gap-2"><FaExclamationCircle className="text-red-600" />Please enter your message</div>);
      return false;
    }
    if (formData.message.length > messageMaxLength) {
      toast.error(<div className="flex items-center gap-2"><FaExclamationCircle className="text-red-600" />Message exceeds {messageMaxLength} characters</div>);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitStatus({ status: 'idle' });

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_6zc7h4c',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_xlm8hpt',
        form.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'aYJfTd5zdKZbso_E4'
      );
      
      setSubmitStatus({ 
        status: 'success', 
        message: "Message sent successfully! I'll get back to you soon." 
      });
      toast.success(<div className="flex items-center gap-2"><FaPaperPlane className="text-green-600" />Message sent successfully!</div>);
      
      setFormData({ name: '', email: '', company: '', message: '' });
      setMessageLength(0);
      form.current?.reset();
    } catch (err) {
      setSubmitStatus({ 
        status: 'error', 
        message: 'Failed to send message. Please try again or email me directly at awekeadisie@gmail.com.' 
      });
      toast.error(<div className="flex items-center gap-2"><FaExclamationCircle className="text-red-600" />Failed to send message. Please try again.</div>);
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show back arrow when scrolled down a bit
  useEffect(() => {
    const handleScroll = () => {
      setShowBackArrow(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/'; // fallback
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      id="contact"
      className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-gray-900 via-indigo-900/50 to-blue-900/50 relative overflow-hidden"
    >
      <Toaster />

      {/* Back Arrow - Top Left */}
      <AnimatePresence>
        {showBackArrow && (
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Background Glows */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-md text-white"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl max-w-3xl mx-auto leading-relaxed drop-shadow-md text-gray-100"
          >
            Have a project in mind? Let's discuss how we can work together.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-gray-800/70 border border-gray-600/50"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 rounded-lg bg-indigo-600/20">
                    <FaEnvelope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-300">
                      Email
                    </h4>
                    <a
                      href="mailto:awekeadisie@gmail.com"
                      className="hover:underline text-lg text-indigo-400"
                    >
                      awekeadisie@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 rounded-lg bg-indigo-600/20">
                    <FaPhoneAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-300">
                      Phone
                    </h4>
                    <a
                      href="tel:+251983424369"
                      className="hover:underline text-lg text-indigo-400"
                    >
                      +251 983 424 369
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 rounded-lg bg-indigo-600/20">
                    <FaMapMarkerAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-300">
                      Location
                    </h4>
                    <p className="text-lg text-gray-400">
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 rounded-lg bg-gray-700/50"
              >
                <p className="text-base leading-relaxed text-gray-300">
                  I'm excited to discuss new opportunities, creative projects, or potential collaborations. Reach out today!
                </p>
              </motion.div>

              {/* Social Media Links */}
              <div className="mt-6 space-y-3">
                <p className="text-lg font-semibold text-teal-400">Connect with me:</p>
                <a
                  href="https://www.linkedin.com/in/aweke-adisie-248a26373/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-teal-600 hover:bg-teal-700 transition rounded-lg px-4 py-3"
                >
                  <FaLinkedin /> LinkedIn
                </a>
                <a
                  href="https://t.me/Comawecom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 transition rounded-lg px-4 py-3"
                >
                  <FaTelegramPlane /> Telegram
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl shadow-lg backdrop-blur-lg bg-gray-800/70 border border-gray-600/50"
            >
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: 'Your Name', type: 'text', name: 'name' },
                  { label: 'Your Email', type: 'email', name: 'email' },
                  { label: 'Organization Name', type: 'text', name: 'company' }
                ].map((field) => (
                  <div key={field.name} className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/10 border border-gray-600 text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition placeholder-transparent"
                      placeholder=" "
                      required={field.name !== 'company'}
                    />
                    <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-teal-400 peer-focus:text-sm">
                      {field.label} {field.name !== 'company' && '*'}
                    </label>
                  </div>
                ))}

                <div className="relative">
                  <motion.textarea
                    whileFocus={{ scale: 1.02, transition: { duration: 0.3 } }}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    maxLength={messageMaxLength}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-lg bg-white/10 border border-gray-600 text-white focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none resize-y transition placeholder-transparent"
                    required
                  />
                  <label className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-teal-400 peer-focus:text-sm">
                    Your Message *
                  </label>
                  <p className={`text-sm mt-1 ${messageLength > messageMaxLength * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                    {messageLength}/{messageMaxLength}
                  </p>
                </div>

                <AnimatePresence>
                  {submitStatus.status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 rounded-lg bg-green-600/20 text-green-400"
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                  {submitStatus.status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 rounded-lg bg-red-600/20 text-red-400"
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                    loading
                      ? 'bg-gray-500 cursor-not-allowed animate-pulse'
                      : 'bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactForm;