import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn';
  className?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollAnimationWrapper({
  children,
  animation = 'fadeIn',
  className,
  delay = 0,
  threshold = 0.1,
}: ScrollAnimationWrapperProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  // Map animation types to tailwind classes
  const animationClasses = {
    fadeIn: isVisible ? 'animate-scroll-fade-in' : 'opacity-0 translate-y-10',
    slideUp: isVisible ? 'animate-scroll-fade-in' : 'opacity-0 translate-y-10',
    slideLeft: isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-12',
    slideRight: isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-12',
    zoomIn: isVisible ? 'animate-zoom-in' : 'opacity-0 scale-90',
  };

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        className
      )}
      style={{ 
        animationDelay: isVisible ? `${delay}ms` : undefined,
        animationFillMode: 'forwards',
      }}
    >
      {children}
    </div>
  );
}
