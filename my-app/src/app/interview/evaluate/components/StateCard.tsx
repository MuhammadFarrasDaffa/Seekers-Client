"use client";

interface StateCardProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  primary?: boolean;
}

export function StateCard({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  primary,
}: StateCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <div className="text-6xl mb-6">{icon}</div>
      <h2
        className={`text-2xl font-bold mb-4 ${primary ? "text-gray-800" : "text-red-600"}`}
      >
        {title}
      </h2>
      <p className="text-gray-600 mb-8">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
