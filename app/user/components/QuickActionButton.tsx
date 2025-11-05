// app/user/components/QuickActionButton.tsx
interface QuickActionButtonProps {
  label: string;
  icon: string;
  bgColor: string;
  onClick?: () => void;
}

export default function QuickActionButton({ label, icon, bgColor, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} text-white rounded-lg p-4 font-bold flex items-center justify-center gap-2 w-full transition-all hover:scale-105`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </button>
  );
}