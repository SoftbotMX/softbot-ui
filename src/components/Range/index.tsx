import clsx from "clsx";
import * as React from "react";

export type RangeSize = "xs" | "sm" | "md" | "lg" | "xl";
export type RangeTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface RangeProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  tone?: RangeTone;
  size?: RangeSize;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

const Range = (props: RangeProps) => {
  const {
    tone,
    size = "md",
    className,
    min = 0,
    max = 100,
    step = 1,
    value,
    defaultValue,
    onChange,
    ...rest
  } = props;
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState<number>(
    (defaultValue as number | undefined) ?? Number(min),
  );

  const current = isControlled ? (value as number) : inner;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInner(Number(e.target.value));
    onChange?.(e);
  };

  return (
    <input
      type="range"
      className={clsx("range", size && `range-${size}`, tone && `range-${tone}`, className)}
      min={min}
      max={max}
      step={step}
      value={current}
      defaultValue={isControlled ? undefined : defaultValue}
      onChange={handleChange}
      aria-valuemin={Number(min)}
      aria-valuemax={Number(max)}
      aria-valuenow={Number(current)}
      {...rest}
    />
  );
};

export default Range;
