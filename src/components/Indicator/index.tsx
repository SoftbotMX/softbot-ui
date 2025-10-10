import clsx from "clsx";
import * as React from "react";

type HPos = "start" | "center" | "end";
type VPos = "top" | "middle" | "bottom";

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: React.ReactNode;
  icon?: string;
  horizontal?: HPos;
  vertical?: VPos;
  hidden?: boolean;
  itemClassName?: string;
  offsetX?: string;
  offsetY?: string;
  insetTop?: string;
  insetBottom?: string;
  insetStart?: string;
  insetEnd?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const Indicator = (props: IndicatorProps) => {
  const {
    children,
    label,
    icon,
    horizontal = "end",
    vertical = "top",
    hidden = false,
    className,
    itemClassName,
    offsetX,
    offsetY,
    insetTop,
    insetBottom,
    insetStart,
    insetEnd,
    ...rest
  } = props;

  const classes = clsx(
    "indicator",
    horizontal && `indicator-${horizontal}`,
    vertical && `indicator-${vertical}`,
    className,
  );

  const styleVars: React.CSSProperties = {
    ...(offsetX ? ({ ["--indicator-x" as never]: offsetX } as React.CSSProperties) : null),
    ...(offsetY ? ({ ["--indicator-y" as never]: offsetY } as React.CSSProperties) : null),
    ...(insetTop ? ({ ["--indicator-t" as never]: insetTop } as React.CSSProperties) : null),
    ...(insetBottom ? ({ ["--indicator-b" as never]: insetBottom } as React.CSSProperties) : null),
    ...(insetStart ? ({ ["--indicator-s" as never]: insetStart } as React.CSSProperties) : null),
    ...(insetEnd ? ({ ["--indicator-e" as never]: insetEnd } as React.CSSProperties) : null),
  };

  return (
    <div className={classes} {...rest}>
      {!hidden && (label != null || icon) && (
        <span
          className={clsx("indicator-item", icon && "icon-symbols", itemClassName)}
          style={styleVars}
        >
          {icon || label}
        </span>
      )}
      {children}
    </div>
  );
};

export default Indicator;
