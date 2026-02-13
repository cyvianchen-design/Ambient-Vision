import React from 'react';

export type CardProps = {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  children,
  actions,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-gray-900">{title}</h3>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {!isCollapsed && (
        <div className="p-5">{children}</div>
      )}
    </div>
  );
};

export type InfoCardProps = {
  label: string;
  content: string[] | React.ReactNode;
  className?: string;
};

export const InfoCard: React.FC<InfoCardProps> = ({
  label,
  content,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      <h4 className="font-bold text-sm text-gray-900 mb-2">{label}</h4>
      {Array.isArray(content) ? (
        <ul className="space-y-1">
          {content.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-700">{content}</div>
      )}
    </div>
  );
};
