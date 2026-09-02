import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  variant = 'default',
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm',
    elevated: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-fintech',
    glass: 'glass-panel text-slate-900 dark:text-white',
    navy: 'bg-fintech-navy text-white border border-slate-800 shadow-xl',
    gradient: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-700/50 shadow-xl',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl transition-all duration-200 overflow-hidden
        ${variants[variant] || variants.default}
        ${hoverEffect ? 'hover:shadow-card-hover hover:border-brand-500/40 cursor-pointer hover:-translate-y-0.5' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', action, title, subtitle }) => {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between ${className}`}>
      {title || subtitle ? (
        <div>
          {title && <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      ) : (
        children
      )}
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between ${className}`}>{children}</div>;
};
