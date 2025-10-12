import clsx from "clsx";
import * as React from "react";

export type SelectSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SelectTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "onChange" | "value" | "defaultValue" | "multiple"
  > {
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SelectSize;
  tone?: SelectTone;
  ghost?: boolean;
  placeholder?: string;
  wrapperClassName?: string;
  ref?: React.Ref<HTMLSelectElement>;
}

const Select = (props: SelectProps) => {
  const {
    options,
    groups,
    value,
    defaultValue,
    onChange,
    size = "md",
    tone,
    ghost = false,
    placeholder,
    className,
    wrapperClassName,
    name,
    id,
    disabled,
    ...rest
  } = props;
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<string>(defaultValue ?? "");

  const current = isControlled ? value! : inner;

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const next = e.currentTarget.value;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const wrapperCls = clsx(
    "select",
    size && `select-${size}`,
    tone && `select-${tone}`,
    ghost && "select-ghost",
    wrapperClassName,
  );

  return (
    <div className={wrapperCls}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        className={clsx(className)}
        value={isControlled ? current : undefined}
        defaultValue={!isControlled ? inner : undefined}
        onChange={handleChange}
        aria-disabled={disabled}
        {...rest}
      >
        {placeholder !== undefined && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {groups?.length
          ? groups.map((g) => (
              <optgroup key={g.label} label={g.label} disabled={g.disabled}>
                {g.options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options?.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
      </select>
    </div>
  );
};

export default Select;
