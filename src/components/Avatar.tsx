import React from 'react';

export type AvatarProps = {
  initial: string;
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'pink';
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
  initial,
  color = 'orange',
  size = 'medium',
  className = '',
}) => {
  const colorClasses = {
    orange: 'bg-orange-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    purple: 'bg-purple-500 text-white',
    pink: 'bg-pink-500 text-white',
  };
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
  };
  
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    >
      {initial.toUpperCase()}
    </div>
  );
};
