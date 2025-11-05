// app/user/components/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function MetricCard({ title, value, icon, color }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-neutral-light dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-text-color dark:text-white">{value}</p>
        </div>
        <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
      </div>
    </div>
  );
}