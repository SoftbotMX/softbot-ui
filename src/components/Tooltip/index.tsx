// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import clsx from "clsx";
import * as React from "react";

type Placement = "top" | "bottom" | "left" | "right";
type Tone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLElement>, "content"> {
  content?: React.ReactNode;
  placement?: Placement;
  tone?: Tone;
  open?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  ref?: React.Ref<HTMLElement>;
}

const toneClass: Record<Tone, string> = {
  neutral: "",
  primary: "tooltip-primary",
  secondary: "tooltip-secondary",
  accent: "tooltip-accent",
  info: "tooltip-info",
  success: "tooltip-success",
  warning: "tooltip-warning",
  error: "tooltip-error",
};

const placementClass: Record<Placement, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  tone = "neutral",
  open,
  as: Tag = "span",
  className,
  children,
  ...rest
}) => {
  const isString = typeof content === "string" || typeof content === "number";

  return (
    <Tag
      className={clsx(
        "tooltip",
        placementClass[placement],
        toneClass[tone],
        open && "tooltip-open",
        className,
      )}
      {...(isString ? { "data-tip": String(content ?? "") } : {})}
      {...rest}
    >
      {children}
      {!isString && content ? <div className="tooltip-content">{content}</div> : null}
    </Tag>
  );
};

export default Tooltip;
