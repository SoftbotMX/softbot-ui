// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import clsx from "clsx";
import * as React from "react";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerAlign = "center" | "start" | "end";
export type DividerTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "error";

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;
  orientation?: DividerOrientation;
  align?: DividerAlign;
  tone?: DividerTone;
  as?: keyof React.JSX.IntrinsicElements;
  ref?: React.Ref<HTMLDivElement>;
}

const Divider = (props: DividerProps) => {
  const {
    children,
    className,
    orientation = "horizontal",
    align = "center",
    tone,
    as = "div",
    ...rest
  } = props;

  const As = as;

  const classes = ["divider"];

  if (orientation === "vertical") {
    classes.push("divider-horizontal");
  } else {
    classes.push("divider-vertical");
  }

  if (align === "start") classes.push("divider-start");
  if (align === "end") classes.push("divider-end");

  if (tone) classes.push(`divider-${tone}`);

  return (
    <As className={clsx(classes, className)} {...rest}>
      {children}
    </As>
  );
};

export default Divider;
