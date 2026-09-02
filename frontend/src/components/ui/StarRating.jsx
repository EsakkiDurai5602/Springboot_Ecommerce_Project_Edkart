import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const StarRating = ({ rating = 0, maxStars = 5, size = 'md', interactive = false, onRatingChange }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const isFull = rating >= i;
    const isHalf = rating >= i - 0.5 && rating < i;

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange && onRatingChange(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
      >
        {isFull ? (
          <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
        ) : isHalf ? (
          <StarHalf className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
        ) : (
          <Star className={`${sizeClasses[size]} text-slate-300 dark:text-slate-700`} />
        )}
      </button>
    );
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};
