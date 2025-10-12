import clsx from "clsx";
import * as React from "react";

export type FilterSize = "xs" | "sm" | "md" | "lg" | "xl";
export type FilterTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface FilterOption {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export type FilterType = "radio" | "checkbox";

export interface FilterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  name?: string;
  options: FilterOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  showReset?: "left" | "right";
  type?: FilterType;
  size?: FilterSize;
  tone?: FilterTone;
  ghost?: boolean;
  itemClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Filter = (props: FilterProps) => {
  const {
    name,
    options,
    value,
    defaultValue = null,
    onChange,
    showReset = "left",
    type = "radio",
    size = "sm",
    tone,
    ghost = false,
    className,
    itemClassName,
    ...rest
  } = props;

  const autoName = React.useId();
  const groupName = name ?? `filter-${autoName}`;

  const isControlled = typeof value !== "undefined";

  // Estado interno separado para radio vs checkbox
  const [innerRadio, setInnerRadio] = React.useState<string | null>(
    typeof defaultValue === "string" || defaultValue === null ? defaultValue : null,
  );
  const [innerCheck, setInnerCheck] = React.useState<Set<string>>(
    Array.isArray(defaultValue) ? new Set(defaultValue) : new Set(),
  );

  // Selección efectiva según modo
  const selectedRadio = isControlled ? (Array.isArray(value) ? null : (value ?? null)) : innerRadio;

  const selectedChecks = isControlled
    ? Array.isArray(value)
      ? new Set(value)
      : new Set<string>()
    : innerCheck;

  const setSelectedRadio = (v: string | null) => {
    if (!isControlled) setInnerRadio(v);
    onChange?.(v);
  };

  const setSelectedChecks = (nextSet: Set<string>) => {
    if (!isControlled) setInnerCheck(new Set(nextSet));
    onChange?.(nextSet.size ? Array.from(nextSet) : null);
  };

  // Estilo base de “botón de filtro”
  const baseBtn = clsx("btn", size && `btn-${size}`, tone && `btn-${tone}`, ghost && "btn-ghost");

  // Reset handler
  const handleReset = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (type === "radio") {
      setSelectedRadio(null);
    } else {
      setSelectedChecks(new Set());
    }
  };

  // Check handler
  const handleCheck = (v: string) => {
    if (type === "radio") {
      setSelectedRadio(v);
    } else {
      const next = new Set(selectedChecks);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      setSelectedChecks(next);
    }
  };

  return (
    <div className={clsx(type === "radio" && "filter", className)} role="group" {...rest}>
      {showReset === "left" && (
        <input
          type="reset"
          value="×"
          className={clsx(baseBtn, type === "radio" ? "filter-reset" : "square")}
          onClick={handleReset}
          aria-label="Reset filters"
        />
      )}

      {options.map(({ value: v, label, disabled, className: itemCls }, index) => {
        const checked = type === "radio" ? selectedRadio === v : selectedChecks.has(v);

        return (
          <input
            key={`option-${index}`}
            type={type}
            name={groupName}
            checked={checked}
            onChange={() => handleCheck(v)}
            disabled={disabled}
            className={clsx(baseBtn, itemClassName, "mx-1!", itemCls)}
            aria-label={label}
          />
        );
      })}

      {showReset === "right" && (
        <input
          type="reset"
          value="×"
          className={clsx(baseBtn, type === "radio" ? "filter-reset" : "square")}
          onClick={handleReset}
          aria-label="Reset filters"
        />
      )}
    </div>
  );
};

export default Filter;
