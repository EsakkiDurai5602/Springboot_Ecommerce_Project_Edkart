import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'h-4 rounded-md w-3/4',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variants[variant] || ''} ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-28" />
      <Skeleton variant="circular" className="h-8 w-8" />
    </div>
    <Skeleton className="h-8 w-40" />
    <div className="flex gap-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
    ))}
  </div>
);
