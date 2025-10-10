import clsx from "clsx";
import * as React from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Variant = "default" | "border" | "lift" | "box";
type Position = "top" | "bottom";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  ref?: React.Ref<HTMLDivElement>;
  size?: Size;
  variant?: Variant;
  position?: Position;
  withPanels?: boolean;
}

const Tabs = (props: TabsProps) => {
  const {
    items,
    value,
    defaultValue,
    onChange,
    size = "md",
    variant = "default",
    position = "top",
    withPanels = true,
    className,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<string>(
    defaultValue ?? items.find((i) => !i.disabled)?.id ?? items[0]?.id ?? "",
  );
  const activeId = isControlled ? (value as string) : inner;

  const setActive = (id: string) => {
    if (!isControlled) setInner(id);
    onChange?.(id);
  };

  const rootCls = clsx(
    "tabs",
    size && `tabs-${size}`,
    position === "top" && "tabs-top",
    position === "bottom" && "tabs-bottom",
    variant === "border" && "tabs-border",
    variant === "lift" && "tabs-lift",
    variant === "box" && "tabs-box",
    className,
  );

  if (!withPanels) {
    return (
      <div className={rootCls} role="tablist" {...rest}>
        {items.map((item) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              disabled={item.disabled}
              className={clsx("tab", item.className, selected && "tab-active")}
              onClick={() => !item.disabled && setActive(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={rootCls} role="tablist" {...rest}>
      {items.map((item) => {
        const selected = item.id === activeId;
        const panelId = `${item.id}-panel`;
        return (
          <React.Fragment key={item.id}>
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              disabled={item.disabled}
              className={clsx("tab", item.className, selected && "tab-active")}
              onClick={() => !item.disabled && setActive(item.id)}
            >
              {item.label}
            </button>
            <div
              id={panelId}
              role="tabpanel"
              className={clsx("tab-content", !selected && "hidden")}
            >
              {item.content}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Tabs;
