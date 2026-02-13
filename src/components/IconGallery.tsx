import React from 'react';
import { Icon, standardIconNames, customIconNames, IconName, StandardIconName, CustomIconName } from './Icon';

/**
 * IconGallery component displays all available icons from the design system.
 * Shows standard icons (filled and outlined variants) and custom icons.
 * Useful for documentation and testing purposes.
 * 
 * @example
 * <IconGallery />
 */
export const IconGallery: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = React.useState<'filled' | 'outlined'>('filled');
  
  return (
    <div className="p-8 bg-[var(--surface-secondary,#f5f5f5)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 font-['Lato',sans-serif]">Icon Library</h1>
          <p className="text-[var(--text-subheading,#666)]">
            {standardIconNames.length} standard icons + {customIconNames.length} custom icons
          </p>
        </div>
        
        <div className="flex gap-2 bg-white rounded-lg p-1">
          <button
            onClick={() => setSelectedVariant('filled')}
            className={`px-4 py-2 rounded-md font-['Lato',sans-serif] font-bold text-sm transition-colors ${
              selectedVariant === 'filled'
                ? 'bg-[var(--shape-primary,#1a1a1a)] text-white'
                : 'bg-transparent text-[var(--text-default,black)] hover:bg-[var(--surface-secondary,#f5f5f5)]'
            }`}
          >
            Filled
          </button>
          <button
            onClick={() => setSelectedVariant('outlined')}
            className={`px-4 py-2 rounded-md font-['Lato',sans-serif] font-bold text-sm transition-colors ${
              selectedVariant === 'outlined'
                ? 'bg-[var(--shape-primary,#1a1a1a)] text-white'
                : 'bg-transparent text-[var(--text-default,black)] hover:bg-[var(--surface-secondary,#f5f5f5)]'
            }`}
          >
            Outlined
          </button>
        </div>
      </div>
      
      {/* Standard Icons Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 font-['Lato',sans-serif]">Standard Icons</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
          {standardIconNames.map((name) => (
            <div 
              key={name}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              title={name}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[var(--surface-default,white)] rounded-md group-hover:bg-[var(--surface-secondary,#f5f5f5)] transition-colors">
                <Icon 
                  name={name as StandardIconName}
                  variant={selectedVariant}
                  size={24}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-xs text-center text-[var(--text-subheading,#666)] font-['Lato',sans-serif] leading-tight max-w-full overflow-hidden text-ellipsis">
                {name.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Icons Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 font-['Lato',sans-serif]">Custom Icons</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
          {customIconNames.map((name) => (
            <div 
              key={name}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              title={name}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[var(--surface-default,white)] rounded-md group-hover:bg-[var(--surface-secondary,#f5f5f5)] transition-colors">
                <Icon 
                  name={name as CustomIconName}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-xs text-center text-[var(--text-subheading,#666)] font-['Lato',sans-serif] leading-tight max-w-full overflow-hidden text-ellipsis">
                {name.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4 font-['Lato',sans-serif]">Usage Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">Basic Usage</h3>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono">
              &lt;Icon name="search" size=&#123;24&#125; /&gt;
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">With Variant (Filled vs Outlined)</h3>
            <div className="flex items-center gap-4 p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded">
              <Icon name="mic" variant="filled" size={24} />
              <Icon name="mic" variant="outlined" size={24} />
              <Icon name="search" variant="filled" size={24} />
              <Icon name="search" variant="outlined" size={24} />
            </div>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono mt-2">
              &lt;Icon name="mic" variant="filled" size=&#123;24&#125; /&gt;<br/>
              &lt;Icon name="mic" variant="outlined" size=&#123;24&#125; /&gt;
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">With Custom Size</h3>
            <div className="flex items-center gap-4 p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded">
              <Icon name="mic" size={16} />
              <Icon name="mic" size={24} />
              <Icon name="mic" size={32} />
              <Icon name="mic" size={48} />
            </div>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono mt-2">
              &lt;Icon name="mic" size=&#123;16&#125; /&gt;<br/>
              &lt;Icon name="mic" size=&#123;24&#125; /&gt;<br/>
              &lt;Icon name="mic" size=&#123;32&#125; /&gt;<br/>
              &lt;Icon name="mic" size=&#123;48&#125; /&gt;
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">With Custom Styling</h3>
            <div className="flex items-center gap-4 p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded">
              <Icon name="check" size={24} className="text-green-600" />
              <Icon name="close_small" size={24} className="text-red-600" />
              <Icon name="settings" size={24} className="text-blue-600" />
            </div>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono mt-2">
              &lt;Icon name="check" size=&#123;24&#125; className="text-green-600" /&gt;
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">With Click Handler</h3>
            <div className="flex items-center gap-4 p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded">
              <Icon 
                name="send" 
                size={24} 
                onClick={() => alert('Icon clicked!')}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              />
            </div>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono mt-2">
              &lt;Icon name="send" size=&#123;24&#125; onClick=&#123;() =&gt; handleClick()&#125; /&gt;
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">Custom Icons</h3>
            <div className="flex items-center gap-4 p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded">
              <Icon name="magic_edit" />
              <Icon name="menu" />
              <Icon name="learn" />
              <Icon name="prepend" />
            </div>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono mt-2">
              &lt;Icon name="magic_edit" /&gt; // Auto-sized to 20px<br/>
              &lt;Icon name="learn" /&gt; // Auto-sized to 24px
            </code>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2 text-[var(--text-subheading,#666)]">Using Convenience Components</h3>
            <code className="block p-3 bg-[var(--surface-secondary,#f5f5f5)] rounded text-sm font-mono">
              &lt;SearchIcon size=&#123;24&#125; /&gt;<br/>
              &lt;MicIcon size=&#123;24&#125; /&gt;<br/>
              &lt;SendIcon size=&#123;24&#125; /&gt;<br/>
              &lt;AddIcon variant="outlined" size=&#123;24&#125; /&gt;<br/>
              &lt;MagicEditIcon /&gt; // Custom icon<br/>
              &lt;LearnIcon /&gt; // Custom icon
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
