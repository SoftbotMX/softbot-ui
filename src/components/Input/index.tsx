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

type Size = "xs" | "sm" | "md" | "lg" | "xl";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLElement>, "size" | "color"> {
  tone?: Tone;
  size?: Size;
  ghost?: boolean;
  left?: string;
  right?: string;
  as?: "div" | "label";
  containerClassName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = (props: InputProps) => {
  const {
    tone,
    size = "md",
    ghost,
    left,
    right,
    as = "div",
    containerClassName,
    className,
    type = "text",
    ref,
    ...rest
  } = props;

  const As = as;
  const toneCls = tone ? `input-${tone}` : undefined;
  const sizeCls = size ? `input-${size}` : undefined;
  const ghostCls = ghost ? "input-ghost" : undefined;

  return (
    <As className={clsx("input", toneCls, sizeCls, ghostCls, containerClassName)}>
      {left ? <span className={`icon-symbols opacity-50 text-sm ${toneCls}`}>{left}</span> : null}
      <input ref={ref} type={type} className={clsx("grow", className)} {...rest} />
      {right ? <span className={`icon-symbols opacity-50 text-sm ${toneCls}`}>{right}</span> : null}
    </As>
  );
};

export default Input;
