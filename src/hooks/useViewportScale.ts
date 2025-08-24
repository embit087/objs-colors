'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

interface ViewportScaleOptions {
  breakpoint?: number;
  mobileScale?: number;
}

export function useViewportScale(options: ViewportScaleOptions = {}) {
  const {
    breakpoint = 1000,
    mobileScale = 0.83
  } = options;

  const [scale, setScale] = useState(1);
  const [isScaled, setIsScaled] = useState(false);

  const calculateScale = () => {
    if (typeof window === 'undefined') return;

    const viewportWidth = window.innerWidth;
    
    // Apply fixed scale below the breakpoint
    if (viewportWidth >= breakpoint) {
      setScale(1);
      setIsScaled(false);
      document.documentElement.style.setProperty('--viewport-scale', '1');
    } else {
      setScale(mobileScale);
      setIsScaled(true);
      document.documentElement.style.setProperty('--viewport-scale', mobileScale.toString());
    }
  };

  useLayoutEffect(() => {
    calculateScale();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      // Debounce resize events for better performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateScale, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', calculateScale);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', calculateScale);
      clearTimeout(timeoutId);
    };
  }, [breakpoint, mobileScale]);

  return {
    scale,
    isScaled
  };
}
