'use client';

import { useViewportScale } from '@/hooks/useViewportScale';
import { useEffect } from 'react';

interface ViewportScalerProps {
  children: React.ReactNode;
}

export default function ViewportScaler({ children }: ViewportScalerProps) {
  const { scale, isScaled } = useViewportScale({
    breakpoint: 1000,
    mobileScale: 0.83
  });

  useEffect(() => {
    // Update CSS custom property for scaling
    // Don't apply to body to preserve centering
  }, [isScaled]);

  return (
    <div className={`viewport-container ${isScaled ? 'viewport-scaled' : ''}`}>
      {children}
    </div>
  );
}
