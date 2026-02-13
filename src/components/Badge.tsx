import React from 'react';

export type BadgeProps = {
  label: string;
  variant?: 'success' | 'info' | 'warning' | 'error' | 'default';
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  icon,
  size = 'small',
  className = '',
}) => {
  const variantClasses = {
    success: 'text-[#479e4c]',
    info: 'text-blue-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
    default: 'text-gray-600',
  };
  
  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
  };
  
  return (
    <div className={`inline-flex items-center gap-1 rounded-lg font-bold ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export type VisitStatusProps = {
  status: 'Generated' | 'Uploading' | 'Processing' | 'Error' | 'In Queue';
  className?: string;
};

export const VisitStatus: React.FC<VisitStatusProps> = ({ status, className = '' }) => {
  const statusConfig = {
    Generated: { color: 'text-[#479e4c]', icon: '✓' },
    Uploading: { color: 'text-gray-600', icon: '↑' },
    Processing: { color: 'text-blue-600', icon: '⟳' },
    Error: { color: 'text-red-600', icon: '✕' },
    'In Queue': { color: 'text-orange-600', icon: '⋯' },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <span className={`text-xs ${config.color}`}>{config.icon}</span>
      <span className={`text-xs font-bold ${config.color}`}>{status}</span>
    </div>
  );
};
