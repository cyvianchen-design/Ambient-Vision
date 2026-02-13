import React, { useState } from 'react';

export type ButtonGroupOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type ButtonGroupProps = {
  /** Array of options */
  options: ButtonGroupOption[];
  /** Currently selected option ID (for single-select) */
  value?: string;
  /** Change handler for single-select */
  onChange?: (value: string) => void;
  /** Selected option IDs (for multi-select) */
  selectedValues?: string[];
  /** Change handler for multi-select */
  onMultiChange?: (values: string[]) => void;
  /** Enable multi-select mode */
  multiSelect?: boolean;
  /** Size variant */
  size?: 'small' | 'medium';
  /** Orientation (for single-select) */
  orientation?: 'horizontal' | 'vertical';
  /** Custom className */
  className?: string;
};

/**
 * ButtonGroup component following the Figma design system.
 * 
 * **Single-select mode** (default):
 * - Gray background container with 2px padding
 * - Selected item has white background with shadow
 * - Unselected items are transparent
 * 
 * **Multi-select mode**:
 * - Individual bordered buttons
 * - 4px gap between buttons
 * - Selected buttons have darker background
 * 
 * @example
 * // Single-select button group
 * <ButtonGroup
 *   options={[
 *     { id: 'manual', label: 'Manual', icon: <Icon name="person" size={20} /> },
 *     { id: 'ai', label: 'AI-assisted', icon: <Icon name="hexagon" size={20} /> },
 *     { id: 'auto', label: 'AI-driven', icon: <Icon name="analytics" size={20} /> }
 *   ]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * 
 * // Multi-select button group
 * <ButtonGroup
 *   options={options}
 *   selectedValues={selected}
 *   onMultiChange={setSelected}
 *   multiSelect
 *   size="small"
 * />
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  selectedValues = [],
  onMultiChange,
  multiSelect = false,
  size = 'medium',
  orientation = 'horizontal',
  className = '',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const handleSingleSelect = (id: string) => {
    if (!multiSelect) {
      onChange?.(id);
    }
  };
  
  const handleMultiSelect = (id: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(id)
        ? selectedValues.filter(v => v !== id)
        : [...selectedValues, id];
      onMultiChange?.(newValues);
    }
  };
  
  const handleClick = (id: string) => {
    if (multiSelect) {
      handleMultiSelect(id);
    } else {
      handleSingleSelect(id);
    }
  };
  
  const isSelected = (id: string) => {
    return multiSelect ? selectedValues.includes(id) : value === id;
  };
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: multiSelect ? 'h-[28px]' : 'min-h-[28px]',
      iconSize: multiSelect ? 'size-[16px]' : 'size-[20px]',
      padding: multiSelect ? 'p-[8px]' : 'px-[12px] py-[6px]',
      gap: 'gap-[8px]',
    },
    medium: {
      height: multiSelect ? 'h-[36px]' : 'min-h-[28px]',
      iconSize: 'size-[20px]',
      padding: multiSelect ? 'p-[8px]' : 'px-[12px] py-[6px]',
      gap: 'gap-[8px]',
    },
  };
  
  const config = sizeConfig[size];
  
  // Multi-select mode: individual bordered buttons
  if (multiSelect) {
    return (
      <div className={`content-stretch flex gap-[4px] items-center ${className}`}>
        {options.map((option) => {
          const selected = isSelected(option.id);
          const hovered = hoveredId === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.id)}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`border border-solid content-stretch flex ${config.gap} ${config.height} items-center justify-center ${config.padding} relative rounded-[6px] shrink-0 transition-colors ${
                selected
                  ? 'border-[var(--shape-brand,#1132ee)] bg-[var(--nav-button,rgba(17,50,238,0.12))]'
                  : hovered
                    ? 'border-[var(--shape-outline,rgba(0,0,0,0.1))] bg-[var(--surface-secondary,#f5f5f5)]'
                    : 'border-[var(--shape-outline,rgba(0,0,0,0.1))] bg-transparent'
              }`}
            >
              {option.icon && (
                <div className={`relative shrink-0 ${config.iconSize}`}>
                  {option.icon}
                </div>
              )}
              <p
                className={`font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-left tracking-[0.13px] ${
                  selected ? 'text-[color:var(--text-brand,#1132ee)]' : 'text-[color:var(--text-subheading,#666)]'
                }`}
                style={{ fontFeatureSettings: "'ss07'" }}
              >
                {option.label}
              </p>
            </button>
          );
        })}
      </div>
    );
  }
  
  // Single-select mode: container with selected item highlighted
  return (
    <div
      className={`bg-[var(--surface-2,#f2f2f2)] content-stretch flex ${
        orientation === 'vertical' ? 'flex-col' : 'flex-row'
      } items-center overflow-clip p-[2px] relative rounded-[8px] ${className}`}
    >
      {options.map((option) => {
        const selected = isSelected(option.id);
        const hovered = hoveredId === option.id;
        
        return (
          <button
            key={option.id}
            onClick={() => handleClick(option.id)}
            onMouseEnter={() => setHoveredId(option.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`content-stretch flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} flex-[1_0_0] ${
              orientation === 'vertical' ? 'flex-col' : 'items-center'
            } justify-center ${config.height} min-w-px ${config.padding} relative rounded-[6px] transition-all ${
              selected
                ? 'bg-[var(--surface-base,white)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]'
                : hovered
                  ? 'bg-[var(--surface-1,#f7f7f7)]'
                  : 'bg-transparent'
            }`}
          >
            <div className={`content-stretch flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} ${config.gap} items-center justify-center relative shrink-0`}>
              {option.icon && (
                <div className={`overflow-clip relative shrink-0 ${config.iconSize}`}>
                  {option.icon}
                </div>
              )}
              <p
                className={`font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] tracking-[0.13px] ${
                  selected ? 'text-[color:var(--text-default,black)]' : 'text-[color:var(--text-placeholder,#808080)]'
                }`}
                style={{ fontFeatureSettings: "'ss07'" }}
              >
                {option.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
