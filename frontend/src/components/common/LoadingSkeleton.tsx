import React from 'react';

export interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 4, height, className = '' }) => {
  if (height) {
    return (
      <div
        className={`bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse ${className}`}
        style={{ height }}
      ></div>
    );
  }

  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full"></div>
      ))}
    </div>
  );
};
