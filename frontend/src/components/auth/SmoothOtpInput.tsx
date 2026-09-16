import React, { useRef, useEffect } from 'react';

interface SmoothOtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
  idPrefix?: string;
  className?: string;
}

export const SmoothOtpInput: React.FC<SmoothOtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
  onComplete,
  idPrefix = 'otp-input',
  className = '',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount or step change
  useEffect(() => {
    if (autoFocus && !disabled) {
      const timer = setTimeout(() => {
        // Find first empty input or the first one
        const firstEmptyIndex = value.findIndex((v) => !v);
        const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
        inputRefs.current[targetIndex]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, disabled]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...value];

      if (value[index]) {
        // Current box has a value: clear it immediately
        next[index] = '';
        onChange(next);
      } else if (index > 0) {
        // Current box is empty: clear previous box and focus it
        next[index - 1] = '';
        onChange(next);
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
      return;
    }

    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
      return;
    }

    if (e.key === 'Delete') {
      e.preventDefault();
      const next = [...value];
      next[index] = '';
      onChange(next);
      return;
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '');

    if (!digitsOnly) {
      const next = [...value];
      next[index] = '';
      onChange(next);
      return;
    }

    // Handle multiple digits entered (e.g. autofill or quick paste)
    if (digitsOnly.length > 1) {
      const next = [...value];
      const chars = digitsOnly.slice(0, 6).split('');
      chars.forEach((char, i) => {
        if (index + i < 6) {
          next[index + i] = char;
        }
      });
      onChange(next);

      const targetIndex = Math.min(index + chars.length, 5);
      inputRefs.current[targetIndex]?.focus();

      if (next.every((d) => d.length === 1) && onComplete) {
        onComplete(next.join(''));
      }
      return;
    }

    // Single digit typed:
    // Even if the input already held a character, use the newly typed digit
    const newDigit = digitsOnly.slice(-1);
    const next = [...value];
    next[index] = newDigit;
    onChange(next);

    // Smoothly auto-advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }

    if (next.every((d) => d.length === 1) && onComplete) {
      onComplete(next.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    const pastedText = e.clipboardData.getData('text/plain');
    const cleanDigits = pastedText.replace(/\D/g, '').slice(0, 6);

    if (!cleanDigits) return;

    const next = ['', '', '', '', '', ''];
    cleanDigits.split('').forEach((char, i) => {
      if (i < 6) next[i] = char;
    });
    onChange(next);

    const focusTarget = Math.min(cleanDigits.length, 5);
    inputRefs.current[focusTarget]?.focus();

    if (cleanDigits.length === 6 && onComplete) {
      onComplete(cleanDigits);
    }
  };

  const renderDigitBox = (index: number) => {
    const isFilled = Boolean(value[index]);

    return (
      <input
        key={index}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        id={`${idPrefix}-${index}`}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        value={value[index] || ''}
        disabled={disabled}
        onChange={(e) => handleChange(index, e)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={handlePaste}
        onFocus={(e) => e.target.select()}
        className={`
          w-11 h-14 sm:w-13 sm:h-16
          text-center text-2xl sm:text-3xl font-bold font-mono
          rounded-2xl outline-none transition-all duration-200 select-none
          shadow-inner
          ${
            isFilled
              ? 'bg-rose-500/[0.08] border border-rose-400/50 text-white shadow-[0_0_15px_rgba(244,63,94,0.18)]'
              : 'bg-black/60 border border-white/15 text-white/30 hover:border-white/30'
          }
          focus:border-rose-500 focus:bg-rose-950/25 focus:ring-2 focus:ring-rose-500/30 focus:text-white
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
      />
    );
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* First 3 Digits */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {renderDigitBox(0)}
          {renderDigitBox(1)}
          {renderDigitBox(2)}
        </div>

        {/* Visual Middle Divider Dot/Hyphen */}
        <div className="flex items-center px-0.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-500/40" />
        </div>

        {/* Last 3 Digits */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {renderDigitBox(3)}
          {renderDigitBox(4)}
          {renderDigitBox(5)}
        </div>
      </div>

      {/* Helper info / Quick Clear */}
      <div className="flex items-center justify-between w-full px-1 text-[11px] font-body text-white/40">
        <span>Automatic backspace & auto-advance</span>
        {value.some(Boolean) && !disabled && (
          <button
            type="button"
            onClick={() => {
              onChange(['', '', '', '', '', '']);
              inputRefs.current[0]?.focus();
            }}
            className="text-rose-400/80 hover:text-rose-300 transition-colors cursor-pointer"
          >
            Clear Code
          </button>
        )}
      </div>
    </div>
  );
};
