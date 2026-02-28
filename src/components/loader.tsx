import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';

interface LoaderProps {
  onLoadComplete?: () => void;
  minimumTime?: number;
}

export function Loader({ onLoadComplete, minimumTime = 2000 }: LoaderProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + Math.random() * 15;
      });
    }, 150);
    const timeout = setTimeout(() => onLoadComplete?.(), minimumTime);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [minimumTime, onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="relative flex flex-col items-center gap-10">
        {/* Animated Logo - Personaje Haitiano CSS */}
        <div className="relative w-32 h-32">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }} />
          {/* Inner pulsing circle */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse flex items-center justify-center">
            {/* Flag colors - Haiti */}
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-600" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-red-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">HT</span>
              </div>
            </div>
          </div>
          {/* Walking animation indicator */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t('app.name')}</h2>
          <p className="text-blue-300 text-lg">{t('app.loading')}</p>
        </div>

        {/* Progress bar */}
        <div className="w-72 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 transition-all duration-300 ease-out rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
