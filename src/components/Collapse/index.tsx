import clsx from "clsx";
import * as React from "react";

export type CollapseIndicator = "arrow" | "plus" | "none";
export type CollapseMarkup = "input" | "details";
export type CollapseInputType = "checkbox" | "radio";

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  indicator?: CollapseIndicator;
  close?: boolean;
  markup?: CollapseMarkup;
  type?: CollapseInputType;
  name?: string;
  value?: string;
  disabled?: boolean;
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  {
    title,
    children,
    open,
    defaultOpen,
    onOpenChange,
    indicator = "arrow",
    close = false,
    markup = "input",
    type = "checkbox",
    name,
    value,
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const isControlled = typeof open === "boolean";
  const [internal, setInternal] = React.useState<boolean>(!!defaultOpen);
  const isOpen = isControlled ? (open as boolean) : internal;

  const inputId = React.useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  const indicatorClass =
    indicator === "arrow" ? "collapse-arrow" : indicator === "plus" ? "collapse-plus" : undefined;

  const rootClass = clsx(
    "collapse",
    indicatorClass,
    isOpen && "collapse-open",
    close && "collapse-close",
    className,
  );

  if (markup === "input") {
    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (disabled) return;
      setOpen(e.target.checked);
    };

    return (
      <div ref={ref} className={rootClass} aria-expanded={isOpen} {...rest}>
        <input
          id={inputId}
          type={type}
          name={type === "radio" ? name : undefined}
          value={type === "radio" ? value : undefined}
          checked={isOpen}
          onChange={onInputChange}
          disabled={disabled}
        />
        <div
          className="collapse-title"
          onClick={() => {
            if (disabled) return;
            setOpen(type === "radio" ? true : !isOpen);
          }}
          aria-disabled={disabled || undefined}
        >
          {title}
        </div>
        <div className="collapse-content">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={rootClass} {...rest}>
      <details
        open={isOpen}
        className="collapse"
        onToggle={(e) => {
          const el = e.currentTarget as HTMLDetailsElement;
          setOpen(el.open);
        }}
      >
        <summary className="collapse-title">{title}</summary>
        <div className="collapse-content">{children}</div>
      </details>
    </div>
  );
});

export default Collapse;
