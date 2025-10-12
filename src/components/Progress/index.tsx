import clsx from "clsx";
import * as React from "react";

export type ProgressTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLProgressElement>, "value"> {
  value?: number;
  max?: number;
  tone?: ProgressTone;
  thickness?: number | string;
  "aria-label"?: string;
  ref?: React.Ref<HTMLProgressElement>;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const Progress = (props: ProgressProps) => {
  const {
    value,
    max = 100,
    tone,
    thickness,
    className,
    style,
    "aria-label": ariaLabel = "Progress",
    ...rest
  } = props;

  const isIndeterminate = value === undefined;
  const safeMax = max > 0 ? max : 100;
  const safeValue = value !== undefined ? clamp(value, 0, safeMax) : undefined;

  const heightStyle =
    typeof thickness === "number"
      ? { height: `${thickness}px` }
      : thickness
        ? { height: thickness }
        : null;

  return (
    <progress
      className={clsx("progress", tone && `progress-${tone}`, className)}
      max={safeMax}
      {...(!isIndeterminate ? { value: safeValue } : {})}
      aria-label={ariaLabel}
      style={{ ...heightStyle, ...style }}
      {...rest}
    />
  );
};

export default Progress;
