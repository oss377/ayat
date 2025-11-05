import { motion } from 'framer-motion';

export default function SalesTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark p-6"
    >
      <p className="text-text-light dark:text-text-dark text-lg font-medium">Sales Trend (Last 30 Days)</p>
      <div className="flex items-baseline gap-2">
        <p className="text-text-light dark:text-text-dark text-4xl font-bold">$2.5M</p>
        <p className="text-secondary text-base font-medium">+8%</p>
      </div>

      <div className="mt-4">
        <svg
          viewBox="-3 0 478 150"
          preserveAspectRatio="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chartGradient" x1="236" x2="236" y1="1" y2="149">
              <stop offset="0" stopColor="#2C5282" stopOpacity="0.2" />
              <stop offset="1" stopColor="#2C5282" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
            fill="url(#chartGradient)"
          />
          <path
            d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
            stroke="#2C5282"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex justify-around mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </motion.div>
  );
}