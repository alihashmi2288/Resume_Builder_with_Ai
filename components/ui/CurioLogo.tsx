import * as React from 'react';

interface CurioMarkProps {
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  xs: { box: 'size-7 rounded-lg', svg: 'size-4' },
  sm: { box: 'size-8 rounded-xl', svg: 'size-[18px]' },
  md: { box: 'size-9 rounded-xl', svg: 'size-5' },
} as const;

/**
 * Curio's standalone stylized "C" symbol — a continuous open-page curve
 * symbolizing raw experience unfolding into clear professional expression.
 */
export const CurioMark: React.FC<CurioMarkProps> = ({ size = 'md', className = '' }) => {
  const dims = SIZE_MAP[size];

  return (
    <div
      className={`flex items-center justify-center bg-[#ffd02f] shadow-sm shrink-0 ${dims.box} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={dims.svg}
        aria-hidden="true"
      >
        {/* Continuous open-curve C */}
        <path
          d="M17.4 8.2C16.2 6.3 14.2 5.2 11.9 5.2C8.1 5.2 5.2 8.2 5.2 12C5.2 15.8 8.1 18.8 11.9 18.8C14.3 18.8 16.4 17.6 17.5 15.6"
          stroke="#1c1c1e"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Inner expression accent — open-page fold line + clarity node */}
        <path
          d="M12.2 9.4C10.8 9.4 9.7 10.6 9.7 12C9.7 13.4 10.8 14.6 12.2 14.6"
          stroke="#1c1c1e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        <circle cx="17.8" cy="12" r="1.65" fill="#1c1c1e" />
      </svg>
    </div>
  );
};

interface CurioLogoProps {
  size?: 'sm' | 'md';
  tone?: 'auto' | 'dark';
  className?: string;
}

/**
 * Curio primary brand lockup: stylized C badge + minimal wordmark.
 */
export const CurioLogo: React.FC<CurioLogoProps> = ({
  size = 'md',
  tone = 'auto',
  className = '',
}) => {
  const textColor =
    tone === 'dark' ? 'text-white' : 'text-[#1c1c1e] dark:text-white';
  const wordmarkSize = size === 'sm' ? 'text-[20px]' : 'text-[22px]';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <CurioMark size={size} />
      <span
        className={`font-semibold tracking-[-0.04em] leading-none lg:whitespace-nowrap ${wordmarkSize} ${textColor}`}
      >
        Curio
      </span>
    </span>
  );
};
