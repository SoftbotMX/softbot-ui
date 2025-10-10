import clsx from "clsx";
import * as React from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Tone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface ToggleProps extends Omit<React.HTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: Size;
  tone?: Tone;
  iconOff?: React.ReactNode;
  iconOn?: React.ReactNode;
  name?: string;
  "aria-label"?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultChecked,
  onChange,
  disabled,
  size = "md",
  tone,
  iconOff,
  iconOn,
  className,
  name,
  ...rest
}) => {
  const isControlled = typeof checked === "boolean";
  const [inner, setInner] = React.useState<boolean>(!!defaultChecked);
  const value = isControlled ? (checked as boolean) : inner;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  if (!iconOn && !iconOff) {
    return (
      <input
        type="checkbox"
        className={clsx("toggle", size && `toggle-${size}`, tone && `toggle-${tone}`, className)}
        name={name}
        checked={value}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
    );
  } else {
    return (
      <label
        className={clsx(
          "toggle",
          "text-base-content",
          size && `toggle-${size}`,
          tone && `toggle-${tone}`,
          className,
        )}
      >
        <input type="checkbox" {...rest} />
        <span className="icon-symbols" aria-label={"disabled"}>
          {iconOff}
        </span>
        <span className="icon-symbols" aria-label={"enabled"}>
          {iconOn}
        </span>
      </label>
    );
  }
};

export default Toggle;
