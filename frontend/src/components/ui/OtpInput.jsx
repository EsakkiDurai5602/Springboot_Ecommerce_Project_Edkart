import React, { useRef, useState, useEffect } from 'react';

export const OtpInput = ({ length = 6, value = '', onChange, onComplete, disabled = false, error = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const arr = value.split('').slice(0, length);
      while (arr.length < length) arr.push('');
      setOtp(arr);
    }
  }, [value, length]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = [...otp];
    // take the last entered char
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const combined = newOtp.join('');
    if (onChange) onChange(combined);

    // Auto-advance
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !newOtp.includes('') && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, length).split('');
    const newOtp = [...otp];
    digits.forEach((d, idx) => {
      newOtp[idx] = d;
    });
    setOtp(newOtp);

    const combined = newOtp.join('');
    if (onChange) onChange(combined);

    const focusIdx = Math.min(digits.length, length - 1);
    inputRefs.current[focusIdx]?.focus();

    if (combined.length === length && !newOtp.includes('') && onComplete) {
      onComplete(combined);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`
            w-11 h-13 sm:w-13 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-xl border
            bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
            transition-all duration-200 focus:outline-none focus:ring-4
            disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed
            ${error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 dark:focus:border-cyan-500 focus:ring-brand-500/20 dark:focus:ring-cyan-500/20 shadow-sm'
            }
          `}
          aria-label={`Digit ${index + 1} of verification code`}
        />
      ))}
    </div>
  );
};
