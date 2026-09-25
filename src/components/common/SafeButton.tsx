'use client';

import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface SafeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  cooldownMs?: number;
  loadingText?: string;
  showSpinner?: boolean;
  isLoading?: boolean;
}

export default function SafeButton({
  children,
  onClick,
  disabled,
  cooldownMs = 1200,
  loadingText,
  showSpinner = true,
  isLoading = false,
  className = '',
  type = 'button',
  ...props
}: SafeButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const lastClickedTimeRef = useRef<number>(0);

  const handleSafeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();

    // Prevent spam if processing or clicked too rapidly within cooldown
    if (isProcessing || isLoading || disabled || now - lastClickedTimeRef.current < cooldownMs) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    lastClickedTimeRef.current = now;
    setIsProcessing(true);

    try {
      if (onClick) {
        const result = (onClick as (event: React.MouseEvent<HTMLButtonElement>) => unknown)(e);
        if (result && typeof result === 'object' && 'then' in result && typeof result.then === 'function') {
          await result;
        }
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, cooldownMs);
    }
  };

  const isDisabled = disabled || isProcessing || isLoading;
  const shouldShowSpinner = isProcessing || isLoading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      onClick={handleSafeClick}
      className={`${className} ${
        isDisabled ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''
      } transition-all`}
    >
      {shouldShowSpinner && showSpinner ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
