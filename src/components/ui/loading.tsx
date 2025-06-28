interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Loading({ className = '', size = 'md' }: LoadingProps) {
  const getDotSize = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      case 'xl':
        return 'w-5 h-5';
      default:
        return 'w-3 h-3';
    }
  };

  const getGapSize = () => {
    switch (size) {
      case 'sm':
        return 'gap-2';
      case 'md':
        return 'gap-3';
      case 'lg':
        return 'gap-4';
      case 'xl':
        return 'gap-5';
      default:
        return 'gap-3';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`flex ${getGapSize()}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`${getDotSize()} rounded-full`}
            style={{
              backgroundColor: '#E5E7EB',
              animation: `dotHighlight 2.5s cubic-bezier(0.4, 0, 0.6, 1) ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes dotHighlight {
          0%, 15%, 100% { 
            background-color: #E5E7EB;
            transform: scale(1);
          }
          45%, 55% { 
            background-color: rgba(27, 20, 93, 1);
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
