import clsx from "clsx";
import * as React from "react";

export type StackAlign = "bottom" | "top" | "start" | "end";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: StackAlign;
  ref?: React.Ref<HTMLDivElement>;
}

const Stack = (props: StackProps) => {
  const { align = "bottom", className, children, ...rest } = props;
  const alignClass =
    align === "top"
      ? "stack-top"
      : align === "start"
        ? "stack-start"
        : align === "end"
          ? "stack-end"
          : "stack-bottom";

  return (
    <div className={clsx("stack", alignClass, className)} {...rest}>
      {children}
    </div>
  );
};

export default Stack;
