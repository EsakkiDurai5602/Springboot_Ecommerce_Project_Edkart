import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'There are currently no items to display in this view.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center mb-4 shadow-inner">
        {icon || <FileQuestion className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
