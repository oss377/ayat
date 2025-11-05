import clsx from 'clsx';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
};

export default function StatsCard({ title, value, change, positive = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col gap-2 rounded-xl p-6 bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark"
    >
      <p className="text-text-light dark:text-text-dark/80 text-base font-medium">{title}</p>
      <p className="text-text-light dark:text-text-dark text-3xl font-bold">{value}</p>
      <p className={clsx('text-base font-medium', positive ? 'text-secondary' : 'text-danger')}>
        {change}
      </p>
    </motion.div>
  );
}