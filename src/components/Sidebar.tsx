import React from 'react';

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  notification?: number;
};

export type SidebarProps = {
  items: NavItem[];
  userInitial?: string;
  onItemClick?: (id: string) => void;
  className?: string;
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  userInitial = 'A',
  onItemClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="w-8 h-8 bg-purple-600 rounded-md"></div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={`w-full flex flex-col items-center gap-1 py-3 px-2 transition-colors relative ${
              item.isActive
                ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="w-6 h-6 relative">
              {item.icon}
              {item.notification && item.notification > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.notification}
                </span>
              )}
            </div>
            <span className="text-xs font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* User Avatar */}
      <div className="flex items-center justify-center h-16 border-t border-gray-200">
        <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
          {userInitial}
        </div>
      </div>
    </div>
  );
};
