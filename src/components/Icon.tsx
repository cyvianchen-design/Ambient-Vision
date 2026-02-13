import React from 'react';

// Icon SVG URLs from Figma - Filled variants
const filledIconPaths = {
  mic: "http://localhost:3845/assets/0d142e49b62c836c8416133ce8827d053a8c6ee8.svg",
  send: "http://localhost:3845/assets/7e24b0e661dfd65a69c143b4237a36aed4ba63df.svg",
  search: "http://localhost:3845/assets/b29d0699ab6d58775e476a4aca086be94f659d44.svg",
  filter_list: "http://localhost:3845/assets/dcfbf32972a9cc004afe4cf59747b9d7c900f565.svg",
  stethoscope: "http://localhost:3845/assets/56336831cb11177fa7fab3874306fb143f4e1316.svg",
  settings: "http://localhost:3845/assets/04376bfbd00990cbdd3686370e4f60edb004aa9a.svg",
  analytics: "http://localhost:3845/assets/08d5a799dff125f32264660549101bfd5a20da45.svg",
  person: "http://localhost:3845/assets/03664da1c84eae3e5c58d443362647fedbcc43b8.svg",
  contact_support: "http://localhost:3845/assets/a86e4bd666680102a548002d03cfd56499099681.svg",
  check: "http://localhost:3845/assets/1a6fd87cc98c564515b6b3dc0500afe6339b8537.svg",
  close_small: "http://localhost:3845/assets/95def6239c26d7d64335d159884ea98976fb427c.svg",
  hexagon: "http://localhost:3845/assets/bb7438cef6e2b7b322b771186e4a2a4df3cd7c92.svg",
  keyboard_arrow_left: "http://localhost:3845/assets/f356e28232a805bf8e65407fa935bea8f49defaa.svg",
  keyboard_arrow_right: "http://localhost:3845/assets/a7d09978a569566313862b89cccb2b9cb9b54133.svg",
  keyboard_arrow_up: "http://localhost:3845/assets/efb11a01123d15a364f53043d8783757fd234c1b.svg",
  calendar_today: "http://localhost:3845/assets/2ea9e06bc0ab56dec75369cc598fa5667170549b.svg",
  arrow_drop_down: "http://localhost:3845/assets/437ca51179154137c783563e2ecd079654f1963a.svg",
  open_in_new: "http://localhost:3845/assets/fbcd07b490cdf7d3a44d1e3807b7e64aa44d5d3f.svg",
  magic_button: "http://localhost:3845/assets/b0482af21a4f5badab8cbc3edfd01ef8541b416c.svg",
  add: "http://localhost:3845/assets/1f025e044802f0691cd4ddbd2459905ee0963f47.svg",
  description: "http://localhost:3845/assets/c8637df37162a6039803f0f0d23a3ae33d393c16.svg",
  palette: "http://localhost:3845/assets/35e6e932372b8dfcd0af1f5476810489d4bcc104.svg",
  admin_panel_settings: "http://localhost:3845/assets/75d80f7371ff33fb9349b48192a5f53e5015ac62.svg",
  help: "http://localhost:3845/assets/af58a87549419b0abe5369a52978b011afe4d948.svg",
} as const;

// Icon SVG URLs from Figma - Outlined variants
const outlinedIconPaths = {
  mic: "http://localhost:3845/assets/3ad5f0a36ff5e4125403e571af589f0403d08d64.svg",
  send: "http://localhost:3845/assets/c0082362053574f95763d262b28db9f5786e18db.svg",
  search: "http://localhost:3845/assets/b8f51fd88406067b579afb8bf3ef330f24e286b6.svg",
  filter_list: "http://localhost:3845/assets/4f428d1f20be1e3ff6cbc18e30a653bf448176c8.svg",
  stethoscope: "http://localhost:3845/assets/3df482b9e06fed12c1707b105c6ef5e56442f20b.svg",
  settings: "http://localhost:3845/assets/20842bd0bc5312cd04d9a4619c1cc493ed708e22.svg",
  analytics: "http://localhost:3845/assets/17bb7cec1747107396053445c1e81dd58d52341b.svg",
  person: "http://localhost:3845/assets/d748eb6e3b1355d12934818e8e2bda15481b00a4.svg",
  contact_support: "http://localhost:3845/assets/a0b905f0df738bbdfc8e5f479bb4a5e0cf23a680.svg",
  check: "http://localhost:3845/assets/fffa40c9a01412996685ee49a9dff42d73b4132d.svg",
  close_small: "http://localhost:3845/assets/91f591f602c397e9f8cd4bd00923119d0fb5a678.svg",
  hexagon: "http://localhost:3845/assets/b57934cdbadbf73565dcd6565276cb9c1203821e.svg",
  keyboard_arrow_left: "http://localhost:3845/assets/1094bae622351e9b1dade4a5de397a170d00fa76.svg",
  keyboard_arrow_right: "http://localhost:3845/assets/83f3908e388884c38ba3e84c1a89c40dfc0db1ca.svg",
  keyboard_arrow_up: "http://localhost:3845/assets/332862598a586813058354338b1805966a40fec3.svg",
  calendar_today: "http://localhost:3845/assets/3e789e8c2ea0b8a16d0896447819fc8b562a55b6.svg",
  arrow_drop_down: "http://localhost:3845/assets/e7f93e643be149094fa40794416db2d381a9eca0.svg",
  open_in_new: "http://localhost:3845/assets/390910836fcc2d1a8fc69ead860ab443b3d7c3d1.svg",
  magic_button: "http://localhost:3845/assets/b0482af21a4f5badab8cbc3edfd01ef8541b416c.svg",
  add: "http://localhost:3845/assets/1f025e044802f0691cd4ddbd2459905ee0963f47.svg",
  description: "http://localhost:3845/assets/c8637df37162a6039803f0f0d23a3ae33d393c16.svg",
  palette: "http://localhost:3845/assets/35e6e932372b8dfcd0af1f5476810489d4bcc104.svg",
  admin_panel_settings: "http://localhost:3845/assets/75d80f7371ff33fb9349b48192a5f53e5015ac62.svg",
  help: "http://localhost:3845/assets/af58a87549419b0abe5369a52978b011afe4d948.svg",
} as const;

// Custom icon SVG URLs from Figma
const customIconPaths = {
  magic_edit: "http://localhost:3845/assets/358f77b39d1c2efb837f881e7493eb1e14bc96e9.svg",
  magic_document: "http://localhost:3845/assets/37f845d3ebe25ff9e3b67e6f93e8cd5a72cb3453.svg",
  menu: "http://localhost:3845/assets/691a1155e5bcace66302f4602912f56d60c8691f.svg",
  learn: "http://localhost:3845/assets/ee2c75bae436f6027d5f08cd338007a8a448ecba.svg",
  prepend: "http://localhost:3845/assets/0661df55d96c3f7a7e8041f72d6e0bf72b689c23.svg",
  clone: "http://localhost:3845/assets/ace2e80b4399a3a153f763a5c9a71a2252e9e9df.svg",
  append: "http://localhost:3845/assets/991797c59dc3f20089f68e393450eaab6ad3e9b6.svg",
  blend: "http://localhost:3845/assets/4c50ce9d8b40792fcda3bcb73485eb666257f0f8.svg",
  loading: "http://localhost:3845/assets/27aab787149365958dd6f1c01678df549251be62.svg",
} as const;

// Icon positioning metadata based on Figma design
const filledIconLayouts = {
  mic: "inset-[8.33%_21.11%_12.5%_21.11%]",
  send: "inset-[18.72%_14.9%_18.72%_12.5%]",
  search: "inset-[12.5%_14.27%_14.27%_12.5%]",
  filter_list: "bottom-1/4 left-[12.5%] right-[12.5%] top-1/4",
  stethoscope: "inset-[8.33%]",
  settings: "inset-[8.33%_10.33%]",
  analytics: "inset-[12.5%]",
  person: "inset-[16.67%]",
  contact_support: "inset-[8.33%_16.67%_10.98%_12.5%]",
  check: "inset-[26.56%_17.81%_26.67%_17.76%]",
  close_small: "inset-[30.94%_30.83%_30.73%_30.83%]",
  hexagon: "inset-[12.5%_7.92%]",
  keyboard_arrow_left: "inset-[26.77%_37.6%_26.77%_35.1%]",
  keyboard_arrow_right: "inset-[26.77%_37.6%_26.77%_35.1%]",
  keyboard_arrow_up: "inset-[35%_26.77%_37.6%_26.77%]",
  calendar_today: "inset-[8.33%_12.5%]",
  arrow_drop_down: "inset-[41.67%_32.08%_38.75%_32.08%]",
  open_in_new: "inset-[12.5%]",
  magic_button: "inset-[12.5%_8.33%]",
  add: "inset-[20.83%]",
  description: "inset-[8.33%_16.67%]",
  palette: "inset-[8.33%]",
  admin_panel_settings: "inset-[8.96%_8.33%_8.33%_16.67%]",
  help: "inset-[8.33%]",
} as const;

const outlinedIconLayouts = {
  mic: "inset-[8.33%_21.11%_12.5%_21.11%]",
  send: "inset-[18.72%_14.9%_18.72%_12.5%]",
  search: "inset-[12.5%_14.27%_14.27%_12.5%]",
  filter_list: "bottom-1/4 left-[12.5%] right-[12.5%] top-1/4",
  stethoscope: "inset-[8.33%]",
  settings: "inset-[8.33%_10.33%]",
  analytics: "inset-[12.5%]",
  person: "inset-[16.67%]",
  contact_support: "inset-[8.33%_16.67%_10.98%_12.5%]",
  check: "inset-[26.56%_17.81%_26.67%_17.76%]",
  close_small: "inset-[31.04%_30.94%_30.83%_30.94%]",
  hexagon: "inset-[12.5%_7.92%]",
  keyboard_arrow_left: "inset-[26.77%_37.6%_26.77%_35.1%]",
  keyboard_arrow_right: "inset-[26.77%_37.6%_26.77%_35.1%]",
  keyboard_arrow_up: "inset-[35%_26.77%_37.6%_26.77%]",
  calendar_today: "inset-[8.33%_12.5%]",
  arrow_drop_down: "inset-[41.67%_32.08%_38.75%_32.08%]",
  open_in_new: "inset-[12.5%]",
  magic_button: "inset-[12.5%_8.33%]",
  add: "inset-[20.83%]",
  description: "inset-[8.33%_16.67%]",
  palette: "inset-[8.33%]",
  admin_panel_settings: "inset-[8.96%_8.33%_8.33%_16.67%]",
  help: "inset-[8.33%]",
} as const;

// Custom icon layouts (20px icons have different base size)
const customIconLayouts = {
  magic_edit: "inset-[13%_11.79%_7.68%_11.09%]",
  magic_document: "inset-[10%_11.79%_7.68%_15%]",
  menu: "inset-[22.5%_15%]",
  learn: "inset-[4.17%_12.5%_8.33%_12.5%]",
  prepend: "bottom-[20.83%] left-[16.67%] right-[16.67%] top-1/4",
  clone: "bottom-[20.83%] left-[16.67%] right-[16.67%] top-1/4",
  append: "bottom-[20.83%] left-[16.67%] right-[16.67%] top-1/4",
  blend: "bottom-[20.83%] left-[16.67%] right-[16.67%] top-1/4",
  loading: "inset-[12.5%]",
} as const;

export type StandardIconName = keyof typeof filledIconPaths;
export type CustomIconName = keyof typeof customIconPaths;
export type IconName = StandardIconName | CustomIconName;
export type IconVariant = 'filled' | 'outlined' | 'custom';

export interface IconProps {
  /**
   * The name of the icon from the design system
   */
  name: IconName;
  
  /**
   * Icon variant - filled, outlined, or custom
   * For standard icons: 'filled' or 'outlined' (default: 'filled')
   * For custom icons: automatically uses 'custom' variant
   * @default 'filled'
   */
  variant?: IconVariant;
  
  /**
   * Size of the icon container
   * @default 24 for standard icons, 20 for custom icons (except 'learn' which is 24)
   */
  size?: number | string;
  
  /**
   * Custom className for the icon container
   */
  className?: string;
  
  /**
   * Aria label for accessibility
   */
  'aria-label'?: string;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
  
  /**
   * Optional data attributes
   */
  [key: `data-${string}`]: any;
}

/**
 * Icon component that displays icons from the design system.
 * Supports filled, outlined, and custom icon variants.
 * 
 * @example
 * // Standard icons with variants
 * <Icon name="search" size={24} />
 * <Icon name="search" variant="outlined" size={24} />
 * 
 * // Custom icons
 * <Icon name="magic_edit" size={20} />
 * <Icon name="learn" size={24} />
 * 
 * // With custom styling and handlers
 * <Icon name="mic" size={20} className="text-blue-500" />
 * <Icon name="send" size="32px" onClick={() => handleSend()} />
 */
export const Icon: React.FC<IconProps> = ({ 
  name, 
  variant, 
  size, 
  className = '', 
  'aria-label': ariaLabel,
  onClick,
  ...dataAttrs
}) => {
  // Determine if this is a custom icon
  const isCustomIcon = name in customIconPaths;
  
  // Auto-detect variant and size based on icon type
  const actualVariant = variant || (isCustomIcon ? 'custom' : 'filled');
  const defaultSize = isCustomIcon ? (name === 'learn' ? 24 : 20) : 24;
  const actualSize = size !== undefined ? size : defaultSize;
  const sizeValue = typeof actualSize === 'number' ? `${actualSize}px` : actualSize;
  
  // Get the appropriate icon URL and layout
  let iconUrl: string;
  let layout: string;
  
  if (isCustomIcon) {
    iconUrl = customIconPaths[name as CustomIconName];
    layout = customIconLayouts[name as CustomIconName];
  } else {
    iconUrl = actualVariant === 'filled' 
      ? filledIconPaths[name as StandardIconName] 
      : outlinedIconPaths[name as StandardIconName];
    layout = actualVariant === 'filled' 
      ? filledIconLayouts[name as StandardIconName] 
      : outlinedIconLayouts[name as StandardIconName];
  }
  
  return (
    <div 
      className={`relative shrink-0 ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
      aria-label={ariaLabel || name.replace(/_/g, ' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      {...dataAttrs}
    >
      <div className={`absolute ${layout}`}>
        <img alt="" className="block max-w-none size-full" src={iconUrl} />
      </div>
    </div>
  );
};

// Convenience components for commonly used standard icons
export const MicIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="mic" {...props} />;
export const SendIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="send" {...props} />;
export const SearchIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="search" {...props} />;
export const FilterListIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="filter_list" {...props} />;
export const StethoscopeIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="stethoscope" {...props} />;
export const SettingsIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="settings" {...props} />;
export const AnalyticsIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="analytics" {...props} />;
export const PersonIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="person" {...props} />;
export const ContactSupportIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="contact_support" {...props} />;
export const CheckIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="check" {...props} />;
export const CloseSmallIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="close_small" {...props} />;
export const HexagonIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="hexagon" {...props} />;
export const KeyboardArrowLeftIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="keyboard_arrow_left" {...props} />;
export const KeyboardArrowRightIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="keyboard_arrow_right" {...props} />;
export const KeyboardArrowUpIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="keyboard_arrow_up" {...props} />;
export const CalendarTodayIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="calendar_today" {...props} />;
export const ArrowDropDownIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="arrow_drop_down" {...props} />;
export const OpenInNewIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="open_in_new" {...props} />;
export const MagicButtonIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="magic_button" {...props} />;
export const AddIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="add" {...props} />;

// Convenience components for custom icons
export const MagicEditIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="magic_edit" {...props} />;
export const MagicDocumentIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="magic_document" {...props} />;
export const MenuIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="menu" {...props} />;
export const LearnIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="learn" {...props} />;
export const PrependIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="prepend" {...props} />;
export const CloneIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="clone" {...props} />;
export const AppendIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="append" {...props} />;
export const BlendIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="blend" {...props} />;
export const LoadingIcon: React.FC<Omit<IconProps, 'name'>> = (props) => <Icon name="loading" {...props} />;

// Export all icon names for reference
export const standardIconNames = Object.keys(filledIconPaths) as StandardIconName[];
export const customIconNames = Object.keys(customIconPaths) as CustomIconName[];
export const allIconNames = [...standardIconNames, ...customIconNames] as IconName[];
