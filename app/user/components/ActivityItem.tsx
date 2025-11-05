// app/user/components/ActivityItem.tsx
interface ActivityItemProps {
  action: string;
  time: string;
  icon: string;
}

export default function ActivityItem({ action, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-light dark:bg-gray-700 rounded-lg">
      <span className="material-symbols-outlined text-secondary text-sm">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-color dark:text-white">{action}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
  );
}