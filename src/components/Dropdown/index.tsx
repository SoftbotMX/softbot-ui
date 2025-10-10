import clsx from "clsx";
import * as React from "react";

type HPlacement = "start" | "center" | "end";
type Side = "bottom" | "top" | "left" | "right";

export interface DropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content" | "popover"> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hover?: boolean;
  placement?: HPlacement;
  side?: Side;
  popover?: boolean;
  contentClassName?: string;
  triggerWrapperClassName?: string;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      content,
      open,
      defaultOpen,
      onOpenChange,
      hover = false,
      placement = "start",
      side = "bottom",
      popover = false,
      className,
      contentClassName,
      triggerWrapperClassName,
      ...rest
    },
    ref,
  ) => {
    const isControlled = typeof open === "boolean";
    const [innerOpen, setInnerOpen] = React.useState<boolean>(!!defaultOpen || false);
    const actualOpen = isControlled ? (open as boolean) : innerOpen;

    const setOpen = (next: boolean) => {
      if (!isControlled) setInnerOpen(next);
      onOpenChange?.(next);
    };

    const onTriggerClick: React.MouseEventHandler = (e) => {
      if (hover) return;
      setOpen(!actualOpen);
      (e.currentTarget as HTMLElement).focus();
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "dropdown",
          placement && `dropdown-${placement}`,
          side && `dropdown-${side}`,
          hover && "dropdown-hover",
          actualOpen && "dropdown-open",
          className,
        )}
        tabIndex={0}
        {...(popover ? { popover: "" as any } : {})}
        {...rest}
      >
        <div
          className={clsx("inline-flex", triggerWrapperClassName)}
          tabIndex={0}
          onClick={onTriggerClick}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          {trigger}
        </div>

        {content}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
export default Dropdown;
