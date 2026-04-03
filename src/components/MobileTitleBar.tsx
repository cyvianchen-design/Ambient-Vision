import { Button } from './Button';
import { InlineIcon } from './InlineIcon';

interface MobileTitleBarProps {
  title: string;
  onBack?: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionIcon?: React.ReactNode;
  showBackButton?: boolean;
  showPrimaryAction?: boolean;
}

export const MobileTitleBar = ({
  title,
  onBack,
  onPrimaryAction,
  primaryActionLabel = "Start Visit",
  primaryActionIcon = <InlineIcon name="mic" size={16} />,
  showBackButton = true,
  showPrimaryAction = true
}: MobileTitleBarProps) => {
  return (
    <div className="bg-[var(--surface-base,white)] content-stretch flex h-[60px] items-center justify-between px-[12px] relative shrink-0 w-full">
      {/* Left: Back Button */}
      <div className="flex items-center shrink-0">
        {showBackButton && (
          <Button
            variant="tertiary-neutral"
            size="small"
            icon={<InlineIcon name="keyboard_arrow_left" size={16} />}
            showPrefix={true}
            onClick={onBack}
          >
            Back
          </Button>
        )}
      </div>
      
      {/* Center: Title - Absolute for true centering */}
      <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none">
        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic overflow-hidden text-[17px] text-[color:var(--text-default,black)] text-center text-ellipsis tracking-[0.34px] whitespace-nowrap px-[12px]">
          {title}
        </p>
      </div>
      
      {/* Right: Primary Action Button */}
      <div className="flex items-center shrink-0">
        {showPrimaryAction && (
          <Button
            variant="primary"
            size="small"
            icon={primaryActionIcon}
            showPrefix={true}
            onClick={onPrimaryAction}
          >
            {primaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
