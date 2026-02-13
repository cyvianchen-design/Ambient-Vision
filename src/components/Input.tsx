import React, { useState } from 'react';
import { InlineIcon } from './InlineIcon';
import { IconButton } from './Button';

// Success checkmark icon
const SuccessIcon = "http://localhost:3845/assets/0ac9a48bc74420eedc1839eef9c7b0de462527cd.svg";
// Alert/error icon  
const AlertIcon = "http://localhost:3845/assets/c15b178f7b292108cddc028c2b319d26515445af.svg";

export type InputProps = {
  /** Input label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Help text below the input */
  helpText?: string;
  /** Feedback type for validation */
  feedback?: 'none' | 'success' | 'error';
  /** Leading icon or element */
  prefix?: React.ReactNode;
  /** Trailing icon or element */
  suffix?: React.ReactNode;
  /** Input size */
  size?: 'xs' | 'dense' | 'default';
  /** Disabled state */
  disabled?: boolean;
  /** Character counter (shows current/max) */
  characterCounter?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number';
  /** Custom className */
  className?: string;
};

/**
 * Input component following the Figma design system.
 * Supports multiple sizes, validation states, and optional character counter.
 * 
 * @example
 * // Basic input
 * <Input label="Email" placeholder="Enter your email" />
 * 
 * // With validation
 * <Input label="Name" value={name} feedback="success" helpText="Looks good!" />
 * <Input label="Phone" value={phone} feedback="error" helpText="Invalid format" />
 * 
 * // With icons and counter
 * <Input 
 *   label="Message" 
 *   characterCounter 
 *   maxLength={100}
 *   prefix={<Icon name="edit" size={20} />}
 * />
 */
export const Input: React.FC<InputProps> = ({
  label,
  placeholder = 'Placeholder',
  value,
  onChange,
  helpText = 'Optional Help Message',
  feedback = 'none',
  prefix,
  suffix,
  size = 'default',
  disabled = false,
  characterCounter = false,
  maxLength,
  type = 'text',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value?.length || 0;
  const counterText = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`;
  
  // Size configurations
  const sizeConfig = {
    xs: {
      height: 'h-[30px]',
      padding: 'px-[12px]',
      fontSize: 'text-[13px]',
      gap: 'gap-[6px]',
    },
    dense: {
      height: 'h-[40px]',
      padding: 'px-[12px]',
      fontSize: 'text-[15px]',
      gap: 'gap-[8px]',
    },
    default: {
      height: 'h-[48px]',
      padding: 'px-[12px]',
      fontSize: 'text-[15px]',
      gap: 'gap-[10px]',
    },
  };
  
  const config = sizeConfig[size];
  
  // Border colors based on feedback and state
  const getBorderColor = () => {
    if (disabled) return 'border-[var(--neutral-200,#ccc)] opacity-50';
    if (feedback === 'success') return 'border-[var(--shape-semantic-success,#479e4c)]';
    if (feedback === 'error') return 'border-[var(--shape-semantic-danger,#bb1411)]';
    if (isFocused) return 'border-[var(--shape-brand,#1132ee)]';
    return 'border-[var(--neutral-200,#ccc)]';
  };
  
  // Help text color based on feedback
  const getHelpTextColor = () => {
    if (feedback === 'success') return 'text-[color:var(--text-semantic-success,#479e4c)]';
    if (feedback === 'error') return 'text-[color:var(--text-semantic-danger,#bb1411)]';
    return 'text-[color:var(--text-subheading,#666)]';
  };
  
  return (
    <div className={`content-stretch flex flex-col gap-[4px] items-start justify-center relative w-full ${className}`}>
      {label && (
        <label className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.24px]">
          {label}
        </label>
      )}
      
      <div className={`border border-solid content-stretch flex ${config.gap} ${config.height} items-center ${config.padding} relative rounded-[6px] shrink-0 w-full transition-colors ${getBorderColor()}`}>
        {/* Prefix icon */}
        {prefix && (
          <div className="shrink-0">
            {prefix}
          </div>
        )}
        
        {/* Input field */}
        <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className={`content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px font-['Lato',sans-serif] font-normal leading-[1.4] not-italic ${config.fontSize} tracking-[0.15px] bg-transparent border-none outline-none ${
              value ? 'text-[color:var(--text-body,#1a1a1a)]' : 'text-[color:var(--text-placeholder,#808080)]'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
            style={{ fontFeatureSettings: "'ss07'" }}
          />
        </div>
        
        {/* Suffix icon or feedback icon */}
        {feedback === 'success' ? (
          <div className="overflow-clip relative shrink-0 size-[24px]">
            <div className="absolute inset-[30.94%_26.77%_33.33%_26.77%]">
              <img alt="Success" className="block max-w-none size-full" src={SuccessIcon} />
            </div>
          </div>
        ) : feedback === 'error' ? (
          <div className="overflow-clip relative shrink-0 size-[24px]">
            <div className="absolute inset-[8.33%]">
              <img alt="Error" className="block max-w-none size-full" src={AlertIcon} />
            </div>
          </div>
        ) : suffix ? (
          <div className="shrink-0">
            {suffix}
          </div>
        ) : null}
        
        {/* Focus outline */}
        {isFocused && (
          <div className="absolute border-[3px] border-[var(--shape-brand,#1132ee)] border-solid inset-[-1px] opacity-[0.12] rounded-[6px] pointer-events-none" />
        )}
      </div>
      
      {/* Help text and character counter */}
      {(helpText || characterCounter) && (
        <div className="content-stretch flex font-['Lato',sans-serif] gap-[12px] items-center leading-[1.2] not-italic relative shrink-0 text-[12px] w-full">
          {helpText && (
            <p className={`flex-[1_0_0] min-h-px min-w-px relative whitespace-pre-wrap ${getHelpTextColor()}`}>
              {helpText}
            </p>
          )}
          {characterCounter && (
            <p className="relative shrink-0 text-right text-[color:var(--text-subheading,#666)]">
              {counterText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export type TextAreaProps = {
  /** Textarea label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Textarea value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Help text below the textarea */
  helpText?: string;
  /** Feedback type for validation */
  feedback?: 'none' | 'success' | 'error';
  /** Disabled state */
  disabled?: boolean;
  /** Character counter (shows current/max) */
  characterCounter?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Number of rows */
  rows?: number;
  /** Custom className */
  className?: string;
};

/**
 * TextArea component following the Figma design system.
 * Similar to Input but for multi-line text with auto-expanding height.
 * 
 * @example
 * // Basic textarea
 * <TextArea label="Description" placeholder="Enter description" rows={5} />
 * 
 * // With validation
 * <TextArea label="Comment" value={comment} feedback="success" helpText="Comment saved!" />
 * 
 * // With character counter
 * <TextArea label="Bio" characterCounter maxLength={500} rows={6} />
 */
export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder = 'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.',
  value,
  onChange,
  helpText = 'Optional Help Message',
  feedback = 'none',
  disabled = false,
  characterCounter = true,
  maxLength,
  rows = 5,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value?.length || 0;
  const counterText = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}/00`;
  
  // Border colors based on feedback and state
  const getBorderColor = () => {
    if (disabled) return 'border-[var(--neutral-200,#ccc)] opacity-50';
    if (feedback === 'success') return 'border-[var(--shape-semantic-success,#479e4c)]';
    if (feedback === 'error') return 'border-[var(--shape-semantic-danger,#bb1411)]';
    if (isFocused) return 'border-[var(--shape-brand,#1132ee)]';
    return 'border-[var(--neutral-200,#ccc)]';
  };
  
  // Help text color based on feedback
  const getHelpTextColor = () => {
    if (feedback === 'success') return 'text-[color:var(--text-semantic-success,#479e4c)]';
    if (feedback === 'error') return 'text-[color:var(--text-semantic-danger,#bb1411)]';
    return 'text-[color:var(--text-subheading,#666)]';
  };
  
  // Get appropriate help text based on feedback
  const getDisplayHelpText = () => {
    if (feedback === 'success' && helpText === 'Optional Help Message') return 'Success Confirmation';
    if (feedback === 'error' && helpText === 'Optional Help Message') return 'Error Message';
    return helpText;
  };
  
  return (
    <div className={`content-stretch flex flex-col gap-[4px] items-start relative w-full ${className}`}>
      {label && (
        <label className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.24px]">
          {label}
        </label>
      )}
      
      <div className={`border border-solid content-stretch flex flex-col gap-[8px] min-h-[140px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full transition-colors ${getBorderColor()}`}>
        {/* Textarea field */}
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`font-['Lato',sans-serif] font-normal leading-[1.4] not-italic text-[15px] tracking-[0.15px] bg-transparent border-none outline-none resize-y w-full min-w-full ${
            value ? 'text-[color:var(--text-body,#1a1a1a)]' : 'text-[color:var(--text-placeholder,#808080)]'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{ fontFeatureSettings: "'ss07'" }}
        />
        
        {/* Success icon positioned at bottom right */}
        {feedback === 'success' && (
          <div className="absolute bottom-[12px] right-[12px] overflow-clip size-[20px]">
            <div className="absolute inset-[30.94%_26.77%_33.33%_26.77%]">
              <img alt="Success" className="block max-w-none size-full" src={SuccessIcon} />
            </div>
          </div>
        )}
        
        {/* Error icon positioned at bottom right */}
        {feedback === 'error' && (
          <div className="absolute bottom-[12px] right-[12px] overflow-clip size-[20px]">
            <div className="absolute inset-[8.33%]">
              <img alt="Error" className="block max-w-none size-full" src={AlertIcon} />
            </div>
          </div>
        )}
        
        {/* Focus outline */}
        {isFocused && (
          <div className="absolute border-[3px] border-[var(--shape-brand,#1132ee)] border-solid inset-[-1px] opacity-[0.12] rounded-[6px] pointer-events-none" />
        )}
      </div>
      
      {/* Help text and character counter */}
      {(helpText || characterCounter) && (
        <div className="content-stretch flex font-['Lato',sans-serif] gap-[8px] items-start justify-end leading-[1.2] not-italic relative shrink-0 text-[12px] w-full">
          {helpText && (
            <p className={`flex-[1_0_0] min-h-px min-w-px relative whitespace-pre-wrap ${getHelpTextColor()}`}>
              {getDisplayHelpText()}
            </p>
          )}
          {characterCounter && (
            <p className={`relative shrink-0 text-right ${
              feedback === 'none' ? 'text-[color:var(--text-subheading,#666)]' : getHelpTextColor()
            }`}>
              {counterText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export type ChatInputProps = {
  /** Placeholder text */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Send button click handler */
  onSend?: () => void;
  /** Voice/mic button click handler */
  onVoice?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
};

/**
 * ChatInput component following the Figma design system.
 * 
 * **Behavior:**
 * - Default: Compact (48px height), 1px border
 * - Focused: Expanded (81px height), 2px border, shows mic & send buttons
 * - Collapses when clicking outside (blur)
 * - Border color: Purple gradient (#8044ff)
 * - Buttons positioned at bottom right when expanded
 * 
 * @example
 * <ChatInput 
 *   placeholder="Ask any medical questions"
 *   value={message}
 *   onChange={setMessage}
 *   onSend={handleSend}
 *   onVoice={handleVoice}
 * />
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Ask any medical questions',
  value = '',
  onChange,
  onSend,
  onVoice,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Expanded state: only when focused
  const isExpanded = isFocused;
  
  return (
    <div
      className={`relative w-full transition-all ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      style={{
        background: disabled 
          ? 'transparent'
          : 'linear-gradient(-89.166deg, rgb(128, 68, 255) 2.281%, rgb(69, 84, 229) 50.375%, rgb(38, 112, 255) 98.469%)',
        padding: disabled ? '0' : '1px',
        borderRadius: '6px',
      }}
    >
      <div
        className={`relative rounded-[6px] w-full transition-all ${
          disabled ? 'cursor-not-allowed' : 'cursor-text'
        }`}
        onClick={() => !disabled && document.getElementById('chat-textarea')?.focus()}
        style={{
          background: 'white',
          padding: isExpanded ? '11px 11px 7px' : '11px',
          height: isExpanded ? '79px' : '46px',
          borderRadius: '5px',
          border: disabled ? '1px solid var(--neutral-200,#ccc)' : 'none',
        }}
      >
      <div className="content-stretch flex flex-col gap-[4px] items-start max-h-[240px] overflow-clip relative">
      {/* Textarea */}
      <textarea
        id="chat-textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={`font-['Lato',sans-serif] font-normal leading-[1.4] not-italic text-[15px] tracking-[0.15px] bg-transparent border-none outline-none resize-none w-full ${
          value && value.length > 0 ? 'text-[color:var(--text-body,#1a1a1a)]' : 'text-[color:var(--text-placeholder,#808080)]'
        } ${disabled ? 'cursor-not-allowed text-[color:var(--text-disabled,#999)]' : ''} ${
          isExpanded ? 'h-[21px]' : 'h-full pr-[88px]'
        }`}
        style={{ fontFeatureSettings: "'ss07'" }}
      />
        
        {/* Buttons - always visible, positioned on the right */}
        {!disabled && (
          <div 
            className={isExpanded 
              ? "content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full"
              : "absolute -translate-y-1/2 top-1/2 right-0 content-stretch flex gap-[8px] items-center justify-end"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              variant="tertiary"
              size="medium"
              icon={<InlineIcon name="mic" size={20} />}
              onClick={onVoice}
              aria-label="Voice input"
              className="text-[color:var(--text-brand,#1132ee)]"
            />
            
            <IconButton
              variant="tertiary"
              size="medium"
              icon={<InlineIcon name="send" size={20} />}
              onClick={onSend}
              aria-label="Send message"
              className="text-[color:var(--text-brand,#1132ee)]"
            />
          </div>
        )}
      </div>
      
      {/* Focus outline */}
      {isFocused && !disabled && (
        <div 
          className="absolute border-[3px] border-[var(--shape-brand,#1132ee)] border-solid opacity-[0.12] rounded-[6px] pointer-events-none"
          style={{ inset: '-1px' }}
        />
      )}
      </div>
    </div>
  );
};
