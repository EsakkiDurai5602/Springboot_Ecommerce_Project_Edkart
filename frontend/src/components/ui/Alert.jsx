import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />,
  };

  const styles = {
    info: 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200',
    success: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200',
    warning: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200',
    error: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200',
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 p-4 rounded-xl border transition-all text-sm
        ${styles[variant] || styles.info}
        ${className}
      `}
    >
      <div className="mt-0.5">{icons[variant] || icons.info}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-md opacity-60 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
