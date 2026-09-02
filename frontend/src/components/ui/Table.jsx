import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto w-full rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col" className="px-5 py-3.5 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-150 ${onClick ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-5 py-4 whitespace-nowrap text-slate-700 dark:text-slate-200 ${className}`}>{children}</td>;
};
