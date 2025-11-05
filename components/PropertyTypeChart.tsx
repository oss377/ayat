import { motion } from 'framer-motion';

export default function PropertyTypeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 rounded-xl border border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark p-6"
    >
      <p className="text-text-light dark:text-text-dark text-lg font-medium">Property by Type</p>

      <div className="flex items-center justify-center flex-1">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-primary/20 dark:text-primary/40"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.8"
            />
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="60, 100"
              strokeLinecap="round"
              strokeWidth="3.8"
            />
            <path
              className="text-secondary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="25, 100"
              strokeDashoffset="-60"
              strokeLinecap="round"
              strokeWidth="3.8"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-primary"></span>
          <span>Apartment (60%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-secondary"></span>
          <span>House (25%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-primary/20 dark:bg-primary/40"></span>
          <span>Other (15%)</span>
        </div>
      </div>
    </motion.div>
  );
}