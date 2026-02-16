import React, { useState } from 'react';
import { InlineIcon } from './InlineIcon';

export type LinkProps = {
  href?: string;
  label?: string;
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  intent?: 'default' | 'neutral';
  showPrefix?: boolean;
  showSuffix?: boolean;
  onClick?: () => void;
  className?: string;
};

export const Link: React.FC<LinkProps> = ({
  href = '#',
  label = 'Link',
  size = 'medium',
  intent = 'default',
  showPrefix = true,
  showSuffix = true,
  onClick,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeConfig = {
    large: {
      fontSize: 'text-[17px]',
      tracking: 'tracking-[0.17px]',
      iconSize: 20,
      gap: 'gap-[4px]',
    },
    medium: {
      fontSize: 'text-[15px]',
      tracking: 'tracking-[0.15px]',
      iconSize: 18,
      gap: 'gap-[4px]',
    },
    small: {
      fontSize: 'text-[13px]',
      tracking: 'tracking-[0.065px]',
      iconSize: 16,
      gap: 'gap-[4px]',
    },
    xsmall: {
      fontSize: 'text-[12px]',
      tracking: 'tracking-[0px]',
      iconSize: 14,
      gap: 'gap-[2px]',
    },
  };

  const config = sizeConfig[size];
  
  // Color logic based on intent and hover state
  const getTextColor = () => {
    if (intent === 'default') {
      return 'text-[color:var(--text-brand,#1132ee)]';
    } else {
      // Neutral intent: gray when enabled, black when hovered
      return isHovered 
        ? 'text-[color:var(--text-default,black)]' 
        : 'text-[color:var(--text-subheading,#666)]';
    }
  };
  
  const textColor = getTextColor();
  const fontWeight = intent === 'default' ? 'font-bold' : 'font-normal';
  const lineHeight = intent === 'default' ? 'leading-[1.2]' : 'leading-[1.4]';
  
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`content-stretch flex flex-wrap ${config.gap} items-center relative cursor-pointer transition-colors ${className}`}
    >
      {showPrefix && (
        <div className={`${textColor} shrink-0`}>
          <InlineIcon name="hexagon" size={config.iconSize} />
        </div>
      )}
      
      <p className={`font-['Lato',sans-serif] ${fontWeight} ${lineHeight} not-italic relative ${config.fontSize} ${textColor} ${config.tracking}`} style={{ fontFeatureSettings: "'ss07'", wordBreak: 'break-word' }}>
        {label}
      </p>
      
      {showSuffix && (
        <div className={textColor}>
          <InlineIcon name="open_in_new" size={config.iconSize} />
        </div>
      )}
      
      {/* Focus outline */}
      {isFocused && (
        <div className="absolute border-[3px] border-[var(--litmus-100,#cfd6fc)] border-solid inset-[-2px] rounded-[8px] pointer-events-none" />
      )}
    </a>
  );
};
