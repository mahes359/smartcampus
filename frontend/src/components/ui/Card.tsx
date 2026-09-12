import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-shadow ${className}`}
      {...props}
    >
      {(header || action) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="font-bold text-slate-900 text-sm">{header}</div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5 bg-white">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
