import clsx from "clsx";
import * as React from "react";

export type TextareaSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TextareaTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";
type Resize = "both" | "x" | "y" | "none";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextareaSize;
  tone?: TextareaTone;
  ghost?: boolean;
  fluid?: boolean;
  resize?: Resize;
}

const Textarea = ({
  size = "md",
  tone,
  ghost,
  fluid = true,
  resize = "both",
  className,
  style,
  ...rest
}: TextareaProps) => {
  const resizeClass =
    resize === "none"
      ? "resize-none"
      : resize === "x"
        ? "resize-x"
        : resize === "y"
          ? "resize-y"
          : "resize";

  return (
    <textarea
      className={clsx(
        "textarea w-full",
        size && `textarea-${size}`,
        tone && `textarea-${tone}`,
        ghost && "textarea-ghost",
        resizeClass,
        className,
      )}
      style={{ ...(fluid ? { width: "100%" } : {}), ...style }}
      {...rest}
    />
  );
};

export default Textarea;
