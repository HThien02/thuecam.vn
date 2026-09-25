'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * Hook to throttle click events and prevent multiple rapid triggers.
 * Automatically handles async promises by keeping button in loading/locked state until complete.
 */
export function usePreventDoubleClick(
  callback?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>,
  throttleMs = 1200
) {
  const [isLocked, setIsLocked] = useState(false);
  const lastClickRef = useRef<number>(0);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      const now = Date.now();
      if (isLocked || now - lastClickRef.current < throttleMs) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      lastClickRef.current = now;
      setIsLocked(true);

      try {
        if (callback) await callback(e);
      } finally {
        setTimeout(() => {
          setIsLocked(false);
        }, throttleMs);
      }
    },
    [callback, isLocked, throttleMs]
  );

  return {
    handleClick,
    isLocked,
  };
}
