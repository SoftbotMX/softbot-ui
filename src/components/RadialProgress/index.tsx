import clsx from "clsx";
import * as React from "react";

type Tone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  size?: number | string;
  thickness?: number | string;
  tone?: Tone;
  children?: React.ReactNode;
  "aria-label"?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

const toneClass = (tone?: Tone) => (tone ? `text-${tone}` : undefined);

const RadialProgress = ({
  value = 0,
  size,
  thickness,
  tone,
  className,
  style,
  children,
  "aria-label": ariaLabel = "Radial progress",
  ...rest
}: RadialProgressProps) => {
  const v = clamp(Math.round(value), 0, 100);

  const cssVars: React.CSSProperties = {
    ...(size != null
      ? { ["--size" as never]: typeof size === "number" ? `${size}px` : size }
      : null),
    ...(thickness != null
      ? { ["--thickness" as never]: typeof thickness === "number" ? `${thickness}px` : thickness }
      : null),
    ["--value" as never]: v,
    ...style,
  };

  return (
    <div
      className={clsx("radial-progress", toneClass(tone), className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={ariaLabel}
      style={cssVars}
      {...rest}
    >
      {children ?? <span className="text-sm font-medium">{v}%</span>}
    </div>
  );
};

export default RadialProgress;
