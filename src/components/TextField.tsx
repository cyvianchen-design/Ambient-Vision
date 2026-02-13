import React from 'react';

export type TextFieldProps = {
  value?: string;
  placeholder?: string;
  size?: 'default' | 'compact';
  suffix?: React.ReactNode;
  onChange?: (value: string) => void;
  onClick?: () => void;
  readOnly?: boolean;
  className?: string;
};

export const TextField: React.FC<TextFieldProps> = ({
  value = '',
  placeholder = 'Placeholder',
  size = 'default',
  suffix,
  onChange,
  onClick,
  readOnly = false,
  className = '',
}) => {
  const sizeClasses = {
    default: 'h-[48px] px-[12px] gap-[8px]',
    compact: 'min-h-[28px] px-[8px] py-[3.5px] gap-[4px]',
  };

  const textSizeClasses = {
    default: 'text-[15px] tracking-[0.15px]',
    compact: 'text-[12px] tracking-[0.12px]',
  };

  return (
    <div 
      className={`border border-[var(--neutral-200,#ccc)] content-stretch flex items-center relative rounded-[6px] shrink-0 w-full ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      <div className="content-stretch flex flex-[1_0_0] gap-[6px] items-center min-h-px min-w-px relative">
        <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
          <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative">
            {readOnly ? (
              <div className={`flex flex-[1_0_0] flex-col font-['Lato',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative ${value ? 'text-[color:var(--text-default,black)]' : 'text-[color:var(--text-placeholder,#808080)]'} ${textSizeClasses[size]}`}>
                <p className="leading-[1.4] whitespace-pre-wrap">{value || placeholder}</p>
              </div>
            ) : (
              <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange?.(e.target.value)}
                className={`flex-[1_0_0] font-['Lato',sans-serif] leading-[1.4] not-italic bg-transparent border-none outline-none text-[color:var(--text-default,black)] placeholder:text-[color:var(--text-placeholder,#808080)] ${textSizeClasses[size]}`}
              />
            )}
          </div>
        </div>
      </div>
      {suffix && (
        <div className="flex items-center justify-center shrink-0">
          {suffix}
        </div>
      )}
    </div>
  );
};
