import clsx from "clsx";
import * as React from "react";

export type RadioSize = "xs" | "sm" | "md" | "lg" | "xl";
export type RadioTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  tone?: RadioTone;
  size?: RadioSize;
  ref?: React.ForwardedRef<HTMLInputElement>;
}

const Radio = ({ tone, size = "md", className, ...rest }: RadioProps) => {
  return (
    <input
      type="radio"
      className={clsx("radio", size && `radio-${size}`, tone && `radio-${tone}`, className)}
      {...rest}
    />
  );
};

export default Radio;
