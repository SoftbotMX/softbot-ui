// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import clsx from "clsx";
import * as React from "react";

export type StatusTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export type StatusSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  size?: StatusSize;
  as?: keyof React.JSX.IntrinsicElements;
  label?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

const toneClass: Record<StatusTone, string> = {
  neutral: "status-neutral",
  primary: "status-primary",
  secondary: "status-secondary",
  accent: "status-accent",
  info: "status-info",
  success: "status-success",
  warning: "status-warning",
  error: "status-error",
};

const sizeClass: Record<StatusSize, string> = {
  xs: "status-xs",
  sm: "status-sm",
  md: "status-md",
  lg: "status-lg",
  xl: "status-xl",
};

const Status = (props: StatusProps) => {
  const { tone = "neutral", size = "md", as: Comp = "span", className, label, ...rest } = props;
  return (
    <Comp
      className={clsx("status", toneClass[tone], sizeClass[size], className)}
      role="status"
      aria-label={label}
      {...rest}
    />
  );
};

export default Status;
