'use client';

import { motion } from 'framer-motion';

const MapSection = () => {
  // Google Maps embed URL for searching "Ayat Real Estate in Addis Ababa"
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d63048.66400193542!2d38.79374159911635!3d9.01651600045933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sAyat%20Real%20Estate%20in%20Addis%20Ababa!5e0!3m2!1sen!2sus!4v1678886400001";

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">Our Location</h2>
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
          <iframe
            src={mapSrc}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ayat Real Estate Locations in Addis Ababa"
          ></iframe>
        </div>
      </div>
    </motion.section>
  );
};

export default MapSection;