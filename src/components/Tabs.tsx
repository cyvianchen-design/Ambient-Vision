import React, { useState } from 'react';

export type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  notification?: number;
};

export type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  hideBorder?: boolean;
};

/**
 * Tabs component following the Figma design system.
 * 
 * Primary variant: Underlined tabs with bottom border
 * Secondary variant: Rounded pill-style tabs with background
 * 
 * @example
 * // Primary tabs (default)
 * <Tabs tabs={[{id: '1', label: 'Actions'}, {id: '2', label: 'Chat'}]} />
 * 
 * // Secondary tabs
 * <Tabs tabs={tabs} variant="secondary" />
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className = '',
  variant = 'primary',
  hideBorder = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };
  
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  
  return (
    <div 
      className={`content-stretch flex gap-[8px] items-center relative ${
        isPrimary && !hideBorder ? 'border-[var(--shape-outline,rgba(0,0,0,0.1))] border-b border-solid' : ''
      } ${isSecondary ? 'py-[4px]' : ''} ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`content-stretch flex relative shrink-0 transition-colors ${
              isPrimary
                ? isActive
                  ? 'border-[var(--text-brand,#1132ee)] border-b-2 border-solid items-start px-[4px] py-[6px]'
                  : 'items-start px-[4px] py-[6px] hover:bg-[var(--surface-secondary,#f5f5f5)]'
                : isActive
                  ? 'bg-[var(--surface-semantic-info,#f1f3fe)] gap-[6px] h-[28px] items-center justify-center px-[8px] rounded-[8px]'
                  : 'gap-[6px] h-[28px] items-center justify-center px-[8px] rounded-[8px] hover:bg-[var(--surface-secondary,#f5f5f5)]'
            }`}
          >
            <div className={`content-stretch flex gap-[4px] items-center relative shrink-0`}>
              {tab.icon && <span>{tab.icon}</span>}
              <p 
                className={`font-['Lato',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[13px] tracking-[0.13px] ${
                  isPrimary
                    ? isActive
                      ? 'font-bold text-[color:var(--text-brand,#1132ee)]'
                      : 'font-bold text-[color:var(--text-placeholder,#808080)]'
                    : isActive
                      ? 'font-bold text-[color:var(--text-brand,#1132ee)]'
                      : 'font-normal text-[color:var(--text-subheading,#666)]'
                }`}
                style={{ fontFeatureSettings: "'ss07'" }}
              >
                {tab.label}
              </p>
              {tab.notification && tab.notification > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.notification}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export type VerticalTabsProps = {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
};

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };
  
  return (
    <div className={`flex flex-col ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`flex items-center gap-3 px-4 py-3 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
