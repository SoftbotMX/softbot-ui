import clsx from "clsx";
import * as React from "react";

import Swap from "../Swap";

export type InputTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export type InputSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLElement>, "size" | "color"> {
  tone?: InputTone;
  size?: InputSize;
  ghost?: boolean;
  left?: string | React.ReactNode;
  right?: string | React.ReactNode;
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

  const [show, setShow] = React.useState(false);

  const onShow = (checked: boolean) => {
    setShow(checked);
  };

  return (
    <As className={clsx("input", toneCls, sizeCls, ghostCls, containerClassName)}>
      {left ? (
        typeof left === "string" ? (
          <span className={`icon-symbols opacity-50 text-sm ${toneCls}`}>{left}</span>
        ) : (
          left
        )
      ) : undefined}
      <input
        ref={ref}
        type={type === "password" ? (show ? "text" : type) : type}
        className={clsx("grow", className)}
        {...rest}
      />
      {right ? (
        typeof right === "string" ? (
          <span className={`icon-symbols opacity-50 text-sm ${toneCls}`}>{right}</span>
        ) : (
          right
        )
      ) : undefined}
      {type === "password" && (
        <Swap iconOff={"visibility_off"} iconOn={"visibility"} rotate onCheckedChange={onShow} />
      )}
    </As>
  );
};

export default Input;
