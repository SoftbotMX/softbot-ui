import clsx from "clsx";
import * as React from "react";

export type CheckboxTone =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type CheckboxSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "checked" | "defaultChecked" | "onChange"
  > {
  tone?: CheckboxTone;
  size?: CheckboxSize;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (
    value: boolean | "indeterminate",
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  label?: React.ReactNode;
  labelClassName?: string;
}

const sizeToClass = (s?: CheckboxSize) => (s ? `checkbox-${s}` : undefined);
const toneToClass = (t?: CheckboxTone) => (t ? `checkbox-${t}` : undefined);

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    tone,
    size = "md",
    className,
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    id,
    label,
    labelClassName,
    ...rest
  },
  ref,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const isControlled = typeof checked !== "undefined";

  const [inner, setInner] = React.useState<boolean | "indeterminate">(
    ((): boolean | "indeterminate" => {
      if (typeof defaultChecked === "string") return "indeterminate";
      if (typeof defaultChecked === "boolean") return defaultChecked;
      return false;
    })(),
  );

  const value: boolean | "indeterminate" = isControlled ? (checked as any) : inner;

  React.useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.indeterminate = value === "indeterminate";
  }, [value]);

  const ariaChecked =
    value === "indeterminate"
      ? "mixed"
      : typeof value === "boolean"
        ? value
          ? "true"
          : "false"
        : undefined;

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let next: boolean | "indeterminate";

    if (value === "indeterminate") {
      next = true;
    } else {
      next = ev.target.checked;
    }

    if (!isControlled) setInner(next);
    onCheckedChange?.(next, ev);
  };

  const inputEl = (
    <input
      id={id}
      ref={inputRef}
      type="checkbox"
      role="checkbox"
      className={clsx("checkbox", sizeToClass(size), toneToClass(tone), className)}
      checked={value === "indeterminate" ? false : !!value}
      aria-checked={ariaChecked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onChange={handleChange}
      {...rest}
    />
  );

  if (label) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputId = id || React.useId();
    return (
      <div className="inline-flex items-center gap-2">
        {React.cloneElement(inputEl, { id: inputId })}
        <label htmlFor={inputId} className={clsx("cursor-pointer select-none", labelClassName)}>
          {label}
        </label>
      </div>
    );
  }

  return inputEl;
});

export default Checkbox;
