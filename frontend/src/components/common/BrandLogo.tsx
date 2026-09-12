import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const emblemSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Circular Emblem with Royal Blue & Gold Institutional University Crest */}
      <div
        className={`${emblemSizes[size]} rounded-full bg-linear-to-br from-blue-600 via-indigo-700 to-slate-900 p-0.5 shadow-xs flex items-center justify-center shrink-0 border border-blue-400/40`}
      >
        <div className="w-full h-full rounded-full border border-amber-300/60 flex items-center justify-center bg-linear-to-b from-blue-700 to-slate-950 text-amber-300">
          <svg viewBox="0 0 24 24" fill="none" className="w-3/4 h-3/4 stroke-current stroke-1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <circle cx="12" cy="19.5" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      <div className="leading-tight">
        <div className={`font-black tracking-tight text-blue-900 dark:text-blue-200 uppercase flex items-center gap-1 ${titleSizes[size]}`}>
          <span>SMARTCAMPUS</span>
        </div>
        <div className="text-[9px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          UNIVERSITY
        </div>
      </div>
    </div>
  );
};
