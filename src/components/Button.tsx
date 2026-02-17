import React from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tertiary-neutral';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  showPrefix?: boolean;
  showSuffix?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  showPrefix = true,
  showSuffix = false,
  children,
  onClick,
  className = '',
}) => {
  const baseClasses = "content-stretch flex gap-[8px] items-center justify-center relative rounded-[6px] shrink-0 cursor-pointer transition-colors font-['Lato',sans-serif] font-bold leading-[1.2] not-italic";
  
  const sizeClasses = {
    small: 'px-[10px] py-[6px] h-[28px] text-[13px] tracking-[0.13px]',
    medium: 'px-[16px] py-[8px] h-[36px] text-[15px] tracking-[0.15px]',
    large: 'px-[20px] py-[12px] h-[48px] text-[17px] tracking-[0.34px]',
  };
  
  const variantClasses = {
    primary: 'bg-[var(--shape-primary,#1a1a1a)] text-[var(--text-oninverse,white)] hover:bg-[var(--neutral-800,#333)] active:bg-[var(--neutral-700,#4d4d4d)]',
    secondary: 'border border-[var(--neutral-1000,black)] border-solid bg-transparent text-[var(--text-default,black)] hover:bg-[var(--surface-1,#f7f7f7)] active:bg-[var(--surface-2,#f2f2f2)]',
    tertiary: 'bg-transparent text-[var(--text-brand,#1132ee)] hover:bg-[var(--surface-1,#f7f7f7)] active:bg-[var(--surface-2,#f2f2f2)]',
    'tertiary-neutral': 'bg-transparent text-[var(--text-subheading,#666)] hover:bg-[var(--surface-1,#f7f7f7)] active:bg-[var(--surface-2,#f2f2f2)]',
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ fontFeatureSettings: "'ss07'" }}
    >
      {icon && showPrefix && (
        <div className="flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      {children}
      {icon && showSuffix && (
        <div className="flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
    </button>
  );
};

export type IconButtonProps = {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'magic';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
};

export const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  variant = 'tertiary',
  size = 'medium', 
  onClick, 
  className = '',
  'aria-label': ariaLabel,
}) => {
  const sizeClasses = {
    small: 'size-[28px]',
    medium: 'size-[36px]',
    large: 'size-[48px]',
  };
  
  const variantClasses = {
    primary: 'bg-[var(--shape-primary,#1a1a1a)] text-[var(--text-oninverse,white)] hover:bg-[var(--neutral-800,#333)] active:bg-[var(--neutral-700,#4d4d4d)]',
    secondary: 'border border-[var(--neutral-1000,black)] border-solid bg-transparent hover:bg-[var(--surface-1,#f7f7f7)] active:bg-[var(--surface-2,#f2f2f2)]',
    tertiary: 'bg-transparent hover:bg-[var(--surface-1,#f7f7f7)] active:bg-[var(--surface-2,#f2f2f2)]',
    accent: 'bg-[var(--surface-brand,#1132ee)] text-white hover:bg-[#0d28cc] active:bg-[#0a1fa3]',
    magic: 'text-white hover:opacity-90 active:opacity-80',
  };
  
  const isMagic = variant === 'magic';
  
  return (
    <button
      onClick={onClick}
      className={`content-stretch flex items-center justify-center rounded-[6px] transition-all cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      style={isMagic ? { 
        backgroundImage: 'linear-gradient(-89.166deg, rgb(128, 68, 255) 2.281%, rgb(69, 84, 229) 50.375%, rgb(38, 112, 255) 98.469%)'
      } : undefined}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
    </button>
  );
};
