import React from 'react';
import { Card } from '../ui/Card';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <Card
      className={className}
      header={
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>}
        </div>
      }
      action={action}
    >
      <div className="w-full pt-2">{children}</div>
    </Card>
  );
};
