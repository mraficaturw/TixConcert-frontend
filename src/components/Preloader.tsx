import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';

interface PreloaderProps {
  onLoadComplete?: () => void;
}

export default function Preloader({ onLoadComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Fade out after reaching 100%
          setTimeout(() => {
            setIsVisible(false);
            onLoadComplete?.();
          }, 500);
          return 100;
        }
        // Increase progress with varying speed
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-30" />
      
      {/* Pulsing circles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-ping"
            style={{
              width: `${(i + 1) * 150}px`,
              height: `${(i + 1) * 150}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Animated logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow">
            <div className="w-24 h-24 rounded-full bg-concert-gradient blur-xl opacity-60" />
          </div>
          <div className="relative w-24 h-24 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center animate-bounce-slow">
            <Music className="w-12 h-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-concert-gradient bg-clip-text text-transparent">
              Tix
            </span>
            <span className="text-foreground">Concert</span>
          </h1>
          <p className="text-muted-foreground mt-2 animate-pulse">
            Experience the Music
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 space-y-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-concert-gradient rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Loading... {Math.min(Math.round(progress), 100)}%
          </p>
        </div>

        {/* Animated equalizer bars */}
        <div className="flex items-end gap-1 h-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-primary rounded-full animate-equalizer"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
