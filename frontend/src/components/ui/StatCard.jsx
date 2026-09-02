import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon,
  trend, // { value: '+12.5%', isPositive: true }
  variant = 'default',
  badge,
  className = '',
  onClick,
}) => {
  return (
    <Card
      variant={variant}
      hoverEffect={!!onClick}
      onClick={onClick}
      className={`p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
            {value}
          </div>
        </div>

        {icon && (
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 border border-brand-100 dark:border-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtext || trend || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          {trend ? (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{trend.value}</span>
              <span className="text-slate-400 font-normal ml-1">vs last month</span>
            </div>
          ) : subtext ? (
            <span className="text-slate-500 dark:text-slate-400">{subtext}</span>
          ) : null}

          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-medium text-[10px]">
              {badge}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
