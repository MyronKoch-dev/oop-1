interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function ChatHeader({
  title = "Chat",
  subtitle,
  className = "",
}: ChatHeaderProps) {


  return (
    <div
      className={`p-4 bg-transparent text-white ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col items-center space-y-1.5">
          <h2 className="text-lg font-semibold text-white text-center">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-300 dark:text-gray-300 text-center">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex ml-4 space-x-2">
          {/* Back button moved to TopProgressPanel */}
        </div>
      </div>

    </div>
  );
}
